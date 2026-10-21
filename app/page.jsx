import { getAllArticles, getSourceNames } from "../lib/fetchFeeds";
import ArticleFeed from "../components/ArticleFeed";

// This is what makes the page update "daily": Next.js will regenerate this
// page in the background at most once every 86,400 seconds (24 hours), the
// first time someone visits after that window passes. No cron job, no
// database needed.
export const revalidate = 86400;

export default async function HomePage() {
  const articles = await getAllArticles();
  const sourceNames = getSourceNames();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Georgia News Digest
        </h1>
        <p className="mt-2 text-neutral-600">
          English-language news on Georgia (the country), pulled daily from
          official Georgian outlets and international coverage.
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          {articles.length} articles · updates roughly once a day
        </p>
      </header>

      <ArticleFeed articles={articles} sourceNames={sourceNames} />
    </main>
  );
}
