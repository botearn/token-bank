# Claude Bridge Vault

A multi-vendor AI API gateway + dashboard. Issues **Sub-Keys** (`sk-vault-...`) to proxy requests to upstream AI vendors (Claude / YourAgent), with per-key usage tracking, quota, and expiry management.

## Features

- **Dashboard** — create/manage keys by vendor & group
- **Proxy endpoints** — accept Sub-Keys, forward to upstream vendor APIs
- **Usage tracking** — calls, tokens, cost per key with daily breakdown
- **Quota & expiry** — token-based quota, date-based expiry per key
- **Rate limiting** — 20 req / 60s sliding window per key
- **Master key rotation** — round-robin + auto-failover on 401/429/5xx
- **Scope separation** — Internal / External key distinction
- **Webhooks** — Feishu + generic webhook on quota/expiry events
- **i18n** — English / Chinese toggle

## Supported Vendors

| Vendor | Proxy Path | Auth Header | Format |
|--------|-----------|-------------|--------|
| Claude | `/api/v1/claude` | `x-api-key` | Anthropic Messages |
| YourAgent | `/api/v1/youragent` | `x-api-key` | Anthropic Messages |
| Clawos (国内) | `/api/v1/clawos-cn` | `Authorization: Bearer` | OpenAI Chat Completions |
| Clawos (海外) | `/api/v1/clawos-intl` | `Authorization: Bearer` | OpenAI Chat Completions |

## Setup

### 1. Environment Variables

Create `.env.local`:

```bash
# Admin auth (required)
ADMIN_SECRET=your_secret_here

# Upstash Redis (required)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Vendor master keys
CLAUDE_MASTER_KEY=sk-ant-...
YOURAGENT_MASTER_KEY=...
CLAWOS_CN_MASTER_KEY=...      # 国内生产 token-gateway.clawos.metacarbon-inc.com
CLAWOS_INTL_MASTER_KEY=...    # 海外生产 token-gateway.clawos.agentclawos.com

# Optional
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
WEBHOOK_URL=...
FEISHU_WEBHOOK_URL=...
```

### 2. Redis

Uses [Upstash Redis](https://upstash.com) (serverless, free tier available). Create a database and copy the REST URL + token.

### 3. Local Dev

```bash
npm install
npm run dev
# Open http://localhost:3000
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables in the Vercel dashboard under Settings → Environment Variables.

## API Usage

### Claude / YourAgent (Anthropic format)

```bash
curl https://yourdomain.com/api/v1/claude \
  -H "x-api-key: sk-vault-claude-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Pages

| Path | Description |
|------|-------------|
| `/vault` | Dashboard — manage keys by vendor & group |
| `/analytics` | Calls, tokens, cost, key health, daily breakdown |
| `/monitoring` | Real-time event log |
| `/settings` | Key details, group management |
| `/query` | Single key lookup with usage history |
| `/docs` | API documentation |

## Security Notes

- `ADMIN_SECRET` protects all `/api/v1/manage/*` endpoints via middleware
- Sub-Keys are scoped to a single vendor — a `sk-vault-claude-*` key cannot call `/api/v1/youragent`
- Rate limiting is enforced per Sub-Key (not per IP)
- Master keys never leave the server — Sub-Keys are what you distribute

## License

MIT
