/**
 * Firebase Cloud Functions — Learn Earn
 * Deploy: cd functions && npm install && firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const CONFIG = {
  MAX_AD_PER_DAY: 5,
  AD_COOLDOWN_SEC: 30,
  DAILY_LOGIN_REWARD: 15,
  MIN_WITHDRAW_BASE: 1000,
  WITHDRAW_INCREMENT: 1500,
};

exports.earnReward = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login dulu');
  }

  const { type, amount, reason } = data;
  const uid = context.auth.uid;
  const userRef = db.collection('users').doc(uid);

  const allowedTypes = ['ad', 'lesson', 'article', 'spin', 'achievement'];
  if (!allowedTypes.includes(type)) {
    throw new functions.https.HttpsError('invalid-argument', 'Type tidak valid');
  }

  if (typeof amount !== 'number' || amount <= 0 || amount > 10000) {
    throw new functions.https.HttpsError('invalid-argument', 'Amount tidak valid');
  }

  return await db.runTransaction(async (t) => {
    const userDoc = await t.get(userRef);
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User tidak ditemukan');
    }

    const user = userDoc.data();
    const today = new Date().toISOString().split('T')[0];

    if (type === 'ad') {
      if (user.lastAdDate === today && user.lastAdWatch >= CONFIG.MAX_AD_PER_DAY) {
        throw new functions.https.HttpsError('resource-exhausted', 'Limit iklan harian');
      }
      if (user.lastAdTime && (Date.now() - user.lastAdTime) < CONFIG.AD_COOLDOWN_SEC * 1000) {
        throw new functions.https.HttpsError('resource-exhausted', 'Cooldown');
      }
    }

    const updates = {
      balance: (user.balance || 0) + amount,
      totalEarned: (user.totalEarned || 0) + amount,
      updatedAt: new Date().toISOString(),
    };

    if (type === 'ad') {
      updates.lastAdWatch = (user.lastAdDate === today ? (user.lastAdWatch || 0) : 0) + 1;
      updates.lastAdDate = today;
      updates.lastAdTime = Date.now();
    }

    t.update(userRef, updates);

    const historyRef = db.collection('users').doc(uid).collection('history').doc();
    t.set(historyRef, {
      type: 'earn',
      amount,
      reason: reason || 'Reward',
      date: new Date().toISOString(),
    });

    return { success: true, newBalance: updates.balance };
  });
});

exports.requestWithdraw = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login dulu');
  }

  const { amount, method, account, name } = data;
  const uid = context.auth.uid;

  if (!amount || amount < 1000) {
    throw new functions.https.HttpsError('invalid-argument', 'Minimal Rp 1.000');
  }
  if (!method || !account || !name) {
    throw new functions.https.HttpsError('invalid-argument', 'Data tidak lengkap');
  }

  const userRef = db.collection('users').doc(uid);

  return await db.runTransaction(async (t) => {
    const userDoc = await t.get(userRef);
    const user = userDoc.data();

    const minWithdraw = user.custom_min_withdraw ||
                       (CONFIG.MIN_WITHDRAW_BASE + (user.withdrawCount || 0) * CONFIG.WITHDRAW_INCREMENT);

    if (amount < minWithdraw) {
      throw new functions.https.HttpsError('invalid-argument', `Minimal Rp ${minWithdraw}`);
    }
    if ((user.balance || 0) < amount) {
      throw new functions.https.HttpsError('failed-precondition', 'Saldo tidak cukup');
    }

    const newCount = (user.withdrawCount || 0) + 1;
    const nextMin = CONFIG.MIN_WITHDRAW_BASE + newCount * CONFIG.WITHDRAW_INCREMENT;
    const wdId = 'WD' + Date.now().toString(36).toUpperCase();

    t.update(userRef, {
      balance: user.balance - amount,
      totalWithdrawn: (user.totalWithdrawn || 0) + amount,
      withdrawCount: newCount,
      nextMinWithdraw: nextMin,
      updatedAt: new Date().toISOString(),
    });

    const wdRef = db.collection('withdrawals').doc(wdId);
    t.set(wdRef, {
      id: wdId,
      userId: uid,
      userName: user.displayName || 'Guest',
      amount,
      method,
      account,
      name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      withdrawNumber: newCount,
    });

    return { success: true, withdrawId: wdId, newMinWithdraw: nextMin };
  });
});
