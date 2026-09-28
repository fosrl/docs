'use client';
import { useEffect, useRef } from 'react';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from 'fumadocs-ui/components/dialog/search';
import type { SharedProps } from 'fumadocs-ui/contexts/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { fetchClient } from 'fumadocs-core/search/client/fetch';
import { randomId, sendEvent } from '@/lib/analytics/client';

/** a query has to sit still this long before it counts as a search */
const SETTLE_MS = 1500;

const client = fetchClient({ api: '/api/search' });

/**
 * Fumadocs' default search dialog plus analytics: each search is stored once with how
 * many pages matched (0 = no results) and which result, if any, was opened. Typing
 * further ("dock" → "docker compose") updates the same row instead of logging prefixes.
 */
export function LoggedSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({ client });

  const settled = useRef<{ query: string; results: number } | null>(null);
  const logged = useRef<{ id: string; query: string; results: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  function commit(clickedUrl?: string) {
    window.clearTimeout(timer.current);
    const current = settled.current;
    if (!current) return;

    const prev = logged.current;
    if (!clickedUrl && prev?.query === current.query && prev.results === current.results) return;
    const refines = prev && current.query.toLowerCase().startsWith(prev.query.toLowerCase());
    logged.current = { id: refines ? prev.id : randomId(), ...current };

    sendEvent('/api/analytics/search', {
      id: logged.current.id,
      query: current.query,
      results: current.results,
      clickedUrl,
      page: location.pathname,
    });
  }

  const text = search.trim();
  const data = query.data;
  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!text || query.isLoading || !data || data === 'empty') {
      if (!text) settled.current = null;
      return;
    }
    // results are listed per heading/paragraph too; count the pages
    settled.current = { query: text, results: data.filter((item) => item.type === 'page').length };
    timer.current = window.setTimeout(() => commit(), SETTLE_MS);
    return () => window.clearTimeout(timer.current);
  }, [text, query.isLoading, data]);

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
      onOpenChange={(open) => {
        if (!open) commit();
        props.onOpenChange(open);
      }}
      onSelect={(item) => {
        if (item.type !== 'action') commit(item.url);
      }}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={data && data !== 'empty' ? data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
