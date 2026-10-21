# Georgia News Digest

A daily-refreshing aggregator of English-language news about Georgia (the
country), pulling from Georgian outlets and international coverage.

## How it works (the short version)

- Every source in `lib/sources.js` is an RSS feed.
- `lib/fetchFeeds.js` fetches them all, merges, dedupes, and sorts by date.
- `app/page.jsx` renders the list, and is set to rebuild itself once every
  24 hours (`export const revalidate = 86400`). That's your "daily update" —
  no server, database, or cron job required.
- If one feed is down or slow, it's skipped silently — the page never
  breaks because of a single bad source.

## Sources included out of the box

| Source | How it's pulled |
|---|---|
| Georgia Today | direct RSS (`/feed/`) |
| Civil.ge | direct RSS (`/feed`) |
| Reuters | via Google News RSS, scoped to Reuters + Georgia (Reuters shut down its own public RSS feeds years ago) |
| BBC | via Google News RSS, scoped to BBC + Georgia (BBC has no dedicated Georgia feed) |
| AP News | via Google News RSS, scoped to AP + Georgia |
| OC Media | direct RSS — independent outlet covering the whole Caucasus |

**Heads up:** I couldn't verify the exact `/feed/` URLs live from this
environment (its network is locked down to a handful of domains). WordPress
sites almost always expose `/feed/` automatically, which both Georgia Today
and Civil.ge appear to be built on — but the very first time you run this
for real, check your deployed site. If a source shows zero articles, open
its URL from `lib/sources.js` directly in your browser: if it doesn't load
as XML, see "Fixing a broken source" below.

## Running it locally

You'll need [Node.js](https://nodejs.org) installed (version 18 or later).

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Locally, feeds refetch on every request in
dev mode, so you'll see live behavior immediately.

## Deploying for free (Vercel)

1. Create a free [GitHub](https://github.com) account if you don't have one,
   and a free [Vercel](https://vercel.com) account (you can sign up with
   your GitHub account directly).
2. Create a new GitHub repository and push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. In Vercel, click **Add New Project**, select the repository you just
   pushed, and click **Deploy**. Vercel auto-detects Next.js — you don't
   need to configure anything.
4. You'll get a live URL (like `your-project.vercel.app`) in about a minute.

From then on, every time you push a change to GitHub, Vercel redeploys
automatically. The page itself also silently refreshes its content once a
day on its own, with no redeploy needed.

## Adding or fixing sources

Open `lib/sources.js`. Each entry looks like:

```js
{
  name: "Georgia Today",
  url: "https://georgiatoday.ge/feed/",
  type: "direct",
  homepage: "https://www.georgiatoday.ge",
},
```

To add a new outlet with its own RSS feed, just add an entry the same way.
Most news sites publish RSS at `/feed/`, `/rss`, or `/rss.xml` — check the
site's footer, or search "`<site name>` RSS feed".

To pull an outlet that doesn't have public RSS, use the `googleNewsRSS()`
helper already defined at the top of the file:

```js
{
  name: "Some Outlet",
  url: googleNewsRSS("site:someoutlet.com Georgia Tbilisi"),
  type: "aggregated",
  homepage: "https://someoutlet.com",
},
```

### Fixing a broken source

If a feed URL stops working (sites do restructure), open your deployed
site's server logs in the Vercel dashboard — failures are logged as
`[feeds] Failed to fetch "Name": <error>`. Fastest fix is usually swapping
in a Google News RSS query for that outlet instead of chasing their new
feed URL.

## Adding social media (Telegram, X/Twitter, Facebook)

None of these platforms offer a simple free RSS feed anymore — X's API is
paid for meaningful use, and Facebook requires an approved developer app.
The practical free workaround is **[RSS-Bridge](https://github.com/RSS-Bridge/rss-bridge)**,
an open-source tool that converts a public Telegram channel, X account, or
Facebook page into an RSS feed.

Two ways to use it:

1. **Use a public instance** — several people run free public RSS-Bridge
   instances. Search "RSS-Bridge public instance" for a current one, then
   build a URL like:
   ```
   https://<instance>/?action=display&bridge=Telegram&username=civilge&format=Atom
   ```
2. **Self-host it** (more reliable, still free) — RSS-Bridge deploys in one
   click to Vercel or Render from its GitHub repo. This is a good "phase 2"
   project once the core aggregator above is working for you.

Once you have a bridge URL, just add it to `lib/sources.js` with
`type: "social"`, the same as any other source — the rest of the app
doesn't need to change.

## Notes on this being a "beginner" setup

This deliberately avoids a database, a cron service, and API keys, because
none of those are needed for a once-a-day news digest. If you later want
faster-than-daily updates, more sources than a page can comfortably hold,
or saved/starred articles per visitor, that's when adding a small database
(e.g. Vercel Postgres, also free tier) starts to make sense — happy to help
with that when you're there.
