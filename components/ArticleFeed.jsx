"use client";

import { useState, useMemo } from "react";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ArticleFeed({ articles, sourceNames }) {
  const [activeSource, setActiveSource] = useState("All");

  const filtered = useMemo(() => {
    if (activeSource === "All") return articles;
    return articles.filter((a) => a.sourceName === activeSource);
  }, [articles, activeSource]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <FilterPill
          label="All"
          active={activeSource === "All"}
          onClick={() => setActiveSource("All")}
        />
        {sourceNames.map((name) => (
          <FilterPill
            key={name}
            label={name}
            active={activeSource === name}
            onClick={() => setActiveSource(name)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-500">No articles found for this filter.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((a) => (
            <li
              key={a.link}
              className="bg-white rounded-lg border border-neutral-200 p-4 hover:border-neutral-400 transition-colors"
            >
              <a
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-neutral-900 hover:underline"
              >
                {a.title}
              </a>
              <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
                <span className="font-medium text-neutral-700">
                  {a.sourceName}
                </span>
                {a.pubDate && (
                  <>
                    <span>·</span>
                    <span>{formatDate(a.pubDate)}</span>
                  </>
                )}
              </div>
              {a.snippet && (
                <p className="mt-2 text-neutral-600 text-sm">{a.snippet}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
        active
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500"
      }`}
    >
      {label}
    </button>
  );
}
