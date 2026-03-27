import { create } from "zustand";

export type SearchResult = {
  id:       number;
  title:    string;
  subtitle: string;
  category: "announcements" | "members" | "files" | "groups";
  url:      string;
  avatar?:  string | null;
};

export type SearchResults = {
  announcements: SearchResult[];
  members:       SearchResult[];
  files:         SearchResult[];
  groups:        SearchResult[];
};

type SearchState = {
  query:   string;
  results: SearchResults | null;
  loading: boolean;
  error:   string | null;

  setQuery:   (query: string) => void;
  setResults: (results: SearchResults | null) => void;
  setLoading: (loading: boolean) => void;
  setError:   (error: string | null) => void;
  reset:      () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  query:   "",
  results: null,
  loading: false,
  error:   null,

  setQuery:   (query)   => set({ query }),
  setResults: (results) => set({ results }),
  setLoading: (loading) => set({ loading }),
  setError:   (error)   => set({ error }),
  reset:      ()        => set({ query: "", results: null, loading: false, error: null }),
}));