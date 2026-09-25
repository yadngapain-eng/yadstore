# YadStore

Website belajar + top up game bergaya Duolingo.

## Auto Deploy

Setiap push ke `main` akan otomatis deploy ke Cloudflare Pages.

- **Live:** https://duniamu.my.id
- **Preview:** https://yadstore.pages.dev

## GitHub Secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Manual Deploy

```bash
wrangler pages deploy . --project-name=yadstore
```

## Struktur

```
.
|-- index.html
|-- sw.js
|-- _headers
|-- wrangler.toml
|-- css/style.css
|-- js/
|   |-- lessons-data.js
|   |-- duolingo-core.js
|   |-- duolingo-ui.js
|   |-- games-data.js
|   |-- games-ui.js
|   `-- app.js
`-- .github/workflows/
    |-- deploy.yml
    |-- deploy-wrangler.yml
    `-- cleanup.yml
```
