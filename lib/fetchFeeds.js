import Parser from "rss-parser";
import { sources } from "./sources";

const parser = new Parser({
  timeout: 10000,
  headers: {
    // Some sites block requests with no user-agent
    "User-Agent":
      "Mozilla/5.0 (compatible; GeorgiaNewsAggregator/1.0; +https://example.com)",
  },
});

// Fetches one feed and never throws - a broken/slow source should never
// take down the whole page. Failures are just logged and skipped.
async function fetchOneSource(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).map((item) => ({
      title: item.title || "(untitled)",
      link: item.link,
      pubDate: item.isoDate || item.pubDate || null,
      sourceName: source.name,
      sourceType: source.type,
      homepage: source.homepage,
      snippet: stripHtml(item.contentSnippet || item.summary || "").slice(
        0,
        220
      ),
    }));
  } catch (err) {
    console.error(`[feeds] Failed to fetch "${source.name}":`, err.message);
    return [];
  }
}

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, "").trim();
}

function dedupeByLink(articles) {
  const seen = new Set();
  return articles.filter((a) => {
    if (!a.link || seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });
}

// Fetches every configured source in parallel, merges, dedupes, and
// sorts newest-first. This is the one function the page calls.
export async function getAllArticles() {
  const results = await Promise.all(sources.map(fetchOneSource));
  const merged = results.flat();
  const deduped = dedupeByLink(merged);

  deduped.sort((a, b) => {
    const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return dateB - dateA;
  });

  return deduped;
}

export function getSourceNames() {
  return sources.map((s) => s.name);
}
