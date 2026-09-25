# YadStore

Website belajar + top up game bergaya Duolingo.

## Fitur

- 31 lesson (Coding, English, Matematika, Sains)
- Top up 8 game populer
- XP, Level, Streak, Hearts, Gems
- 12 Achievements

## Auto Deploy

Setiap push ke `main` auto deploy ke Cloudflare Pages via GitHub Actions.

## GitHub Secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Manual Deploy

```bash
wrangler pages deploy . --project-name=yadstore
```
