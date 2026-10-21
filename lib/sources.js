// ============================================================================
// SOURCES CONFIGURATION
// This is the main file you'll want to edit to add, remove, or tweak sources.
// ============================================================================

// Helper: builds a free Google News RSS feed scoped to a search query.
// This is how we handle outlets (Reuters, BBC, AP...) that don't publish
// their own public "Georgia country" RSS feed. Google News keeps this feed
// updated automatically, no API key needed.
function googleNewsRSS(query) {
  const params = new URLSearchParams({
    q: query,
    hl: "en-US",
    gl: "US",
    ceid: "US:en",
  });
  return `https://news.google.com/rss/search?${params.toString()}`;
}

// "direct" = the outlet's own RSS feed
// "aggregated" = a Google News RSS query scoped to that outlet + Georgia
export const sources = [
  {
    name: "Georgia Today",
    url: "https://georgiatoday.ge/feed/",
    type: "direct",
    homepage: "https://www.georgiatoday.ge",
  },
  {
    name: "Civil Georgia",
    url: "https://civil.ge/feed",
    type: "direct",
    homepage: "https://www.civil.ge",
  },
  {
    name: "Reuters",
    // Reuters discontinued its public RSS feeds years ago, so this pulls
    // Reuters articles that mention Georgia/Tbilisi via Google News instead.
    url: googleNewsRSS("site:reuters.com (Georgia OR Tbilisi OR Georgian)"),
    type: "aggregated",
    homepage: "https://www.reuters.com/world/georgia",
  },
  {
    name: "BBC",
    // BBC has no dedicated "Georgia country" feed, only broad regional ones,
    // so we scope Google News to BBC + Georgia/Tbilisi instead.
    url: googleNewsRSS("site:bbc.com (Georgia OR Tbilisi OR Georgian)"),
    type: "aggregated",
    homepage: "https://www.bbc.com/news",
  },
  {
    name: "AP News",
    url: googleNewsRSS("site:apnews.com (Georgia OR Tbilisi OR Georgian)"),
    type: "aggregated",
    homepage: "https://apnews.com",
  },
  {
    name: "OC Media",
    // Independent outlet covering the whole Caucasus region, English-language.
    url: "https://oc-media.org/feed/",
    type: "direct",
    homepage: "https://oc-media.org",
  },

  // --- Social media (optional, off by default) ---------------------------
  // Native RSS from social platforms mostly doesn't exist anymore. The
  // practical free option is RSS-Bridge (https://github.com/RSS-Bridge/rss-bridge),
  // which converts a Telegram channel, X/Twitter account, or Facebook page
  // into an RSS feed you can drop in here. See the README for setup.
  //
  // Example, once you have a bridge instance running:
  // {
  //   name: "Civil.ge Telegram",
  //   url: "https://your-bridge-instance.com/?action=display&bridge=Telegram&username=civilge&format=Atom",
  //   type: "social",
  //   homepage: "https://t.me/civilge",
  // },
];
