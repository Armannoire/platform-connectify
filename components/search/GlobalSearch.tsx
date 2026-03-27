"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import type { SearchResult } from "@/store/useSearchStore";

// ── Types ─────────────────────────────────────────────────────

type Category = "announcements" | "members" | "files" | "groups";

// ── Constants ─────────────────────────────────────────────────

const CATEGORY_LABELS: Record<Category, string> = {
  announcements: "Announcements",
  members:       "Members",
  files:         "Files",
  groups:        "Groups",
};

const CATEGORY_COLORS: Record<Category, string> = {
  announcements: "#7c3aed",
  members:       "#0ea5e9",
  files:         "#10b981",
  groups:        "#f59e0b",
};

const CATEGORY_ICONS: Record<Category, React.ReactElement> = {
  announcements: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  members: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  files: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  groups: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 1-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

const CATEGORIES: Category[] = ["announcements", "members", "files", "groups"];

// ── Component ─────────────────────────────────────────────────

type Props = {
  workspaceId: number;
  placeholder?: string;
};

export default function GlobalSearch({
  workspaceId,
  placeholder = "Search documents, team members...",
}: Props) {
  const { query, results, loading, setQuery, reset } = useSearch(workspaceId);
  const [open, setOpen]               = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef    = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router      = useRouter();

  const flatResults: SearchResult[] = results
    ? CATEGORIES.flatMap((cat) => results[cat])
    : [];

  const totalCount = flatResults.length;
  const hasResults = results && totalCount > 0;
  const isEmpty    = results && totalCount === 0 && !loading;

  // ── Effects ───────────────────────────────────────────────

  useEffect(() => {
    if (query.trim()) setOpen(true);
    else setOpen(false);
  }, [query, results]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Handlers ──────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, totalCount - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigate(flatResults[activeIndex]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  const navigate = (item: SearchResult) => {
    router.push(item.url);
    close();
  };

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
    reset();
    inputRef.current?.blur();
  };

  // ── Render ────────────────────────────────────────────────

  let flatIdx = 0;

  const renderCategory = (category: Category, items: SearchResult[]) => {
    if (!items.length) return null;

    return (
      <div key={category} className="search-category">
        <div className="search-category-label">
          <span className="search-category-dot" style={{ background: CATEGORY_COLORS[category] }} />
          {CATEGORY_LABELS[category]}
        </div>

        {items.map((item) => {
          const idx      = flatIdx++;
          const isActive = idx === activeIndex;

          return (
            <button
              key={item.id}
              className={`search-result-item ${isActive ? "active" : ""}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(-1)}
              onClick={() => navigate(item)}
            >
              <span className="search-result-icon" style={{ color: CATEGORY_COLORS[category] }}>
                {CATEGORY_ICONS[category]}
              </span>
              <span className="search-result-text">
                <span className="search-result-title">{item.title}</span>
                {item.subtitle && (
                  <span className="search-result-subtitle">{item.subtitle}</span>
                )}
              </span>
              {isActive && <span className="search-result-enter">↵</span>}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 480px;
          font-family: inherit;
        }
        .search-input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8f7ff;
          border: 1.5px solid #ede9fe;
          border-radius: 12px;
          padding: 0 14px;
          height: 42px;
          transition: all 0.2s ease;
          cursor: text;
        }
        .search-input-container:focus-within {
          background: #fff;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        .search-icon {
          color: #a78bfa;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .search-input-container:focus-within .search-icon { color: #7c3aed; }
        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 13.5px;
          color: #1e1b4b;
          min-width: 0;
        }
        .search-input::placeholder { color: #a78bfa; }
        .search-kbd {
          display: flex;
          align-items: center;
          gap: 3px;
          flex-shrink: 0;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .search-input-container:focus-within .search-kbd {
          opacity: 0;
          pointer-events: none;
        }
        .kbd {
          font-size: 10px;
          font-weight: 600;
          color: #7c3aed;
          background: #ede9fe;
          border-radius: 5px;
          padding: 2px 5px;
          line-height: 1.4;
        }
        .search-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ede9fe;
          border: none;
          border-radius: 6px;
          width: 20px;
          height: 20px;
          cursor: pointer;
          color: #7c3aed;
          flex-shrink: 0;
          transition: background 0.15s;
          padding: 0;
        }
        .search-clear:hover { background: #ddd6fe; }
        .search-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1.5px solid #ede9fe;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(109, 40, 217, 0.12), 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
          z-index: 100;
          animation: dropdownIn 0.15s ease;
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .search-dropdown-inner {
          max-height: 380px;
          overflow-y: auto;
          padding: 8px;
          scrollbar-width: thin;
          scrollbar-color: #ede9fe transparent;
        }
        .search-dropdown-inner::-webkit-scrollbar { width: 4px; }
        .search-dropdown-inner::-webkit-scrollbar-thumb {
          background: #ede9fe;
          border-radius: 4px;
        }
        .search-loading {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 12px;
          color: #a78bfa;
          font-size: 13px;
        }
        .search-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #ede9fe;
          border-top-color: #7c3aed;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .search-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 24px 12px;
          color: #a78bfa;
          font-size: 13px;
          text-align: center;
        }
        .search-category { margin-bottom: 4px; }
        .search-category-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #9ca3af;
          padding: 8px 10px 4px;
        }
        .search-category-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 10px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: background 0.1s;
        }
        .search-result-item.active { background: #f5f3ff; }
        .search-result-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: #f5f3ff;
          flex-shrink: 0;
        }
        .search-result-item.active .search-result-icon { background: #ede9fe; }
        .search-result-text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .search-result-title {
          font-size: 13.5px;
          font-weight: 500;
          color: #1e1b4b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .search-result-subtitle {
          font-size: 11.5px;
          color: #9ca3af;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .search-result-enter {
          font-size: 11px;
          color: #a78bfa;
          background: #ede9fe;
          border-radius: 5px;
          padding: 2px 6px;
          flex-shrink: 0;
        }
        .search-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-top: 1px solid #f3f0ff;
          background: #faf9ff;
        }
        .search-footer-count { font-size: 11px; color: #c4b5fd; }
        .search-footer-hints {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #c4b5fd;
        }
        .search-footer-hint { display: flex; align-items: center; gap: 4px; }
        .search-footer-kbd {
          font-size: 10px;
          background: #ede9fe;
          color: #7c3aed;
          border-radius: 4px;
          padding: 1px 5px;
          font-weight: 600;
        }
      `}</style>

      <div className="search-wrapper">
        <div className="search-input-container" onClick={() => inputRef.current?.focus()}>
          <span className="search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          <input
            ref={inputRef}
            className="search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setOpen(true)}
            autoComplete="off"
          />

          {query ? (
            <button className="search-clear" onClick={close} tabIndex={-1}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : (
            <span className="search-kbd">
              <span className="kbd">⌘</span>
              <span className="kbd">K</span>
            </span>
          )}
        </div>

        {open && (
          <div className="search-dropdown" ref={dropdownRef}>
            <div className="search-dropdown-inner">
              {loading && (
                <div className="search-loading">
                  <div className="search-spinner" />
                  Searching...
                </div>
              )}

              {isEmpty && !loading && (
                <div className="search-empty">
                  <span style={{ fontSize: 24, opacity: 0.5 }}>🔍</span>
                  No results for <strong>"{query}"</strong>
                </div>
              )}

              {hasResults && !loading && CATEGORIES.map((cat) =>
                renderCategory(cat, results[cat])
              )}
            </div>

            {hasResults && !loading && (
              <div className="search-footer">
                <span className="search-footer-count">{totalCount} results</span>
                <div className="search-footer-hints">
                  <span className="search-footer-hint">
                    <span className="search-footer-kbd">↑↓</span> navigate
                  </span>
                  <span className="search-footer-hint">
                    <span className="search-footer-kbd">↵</span> open
                  </span>
                  <span className="search-footer-hint">
                    <span className="search-footer-kbd">esc</span> close
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}