<script lang="ts">
  import { onMount } from 'svelte';
  import type { SearchRecord, SearchResponse } from '@/pages/api/search';

  // Note: the /search page is prerendered, so any query/page passed from
  // Astro.url is always empty at build time. Read from window.location on
  // mount instead — that's the authoritative source on the client.

  const SOURCE_META: Record<
    string,
    { label: string; icon: string; path: (s: string) => string }
  > = {
    blog: {
      label: 'Blog Post',
      icon: 'ri-quill-pen-line',
      path: (s) => `/blog/${s}`,
    },
    guides: {
      label: 'Guide',
      icon: 'ri-book-open-line',
      path: (s) => `/guides/${s}`,
    },
    frontendProjects: {
      label: 'Frontend Project',
      icon: 'ri-code-s-slash-line',
      path: (s) => `/projects/frontend/${s}`,
    },
    graphicDesignProjects: {
      label: 'Graphic Design Project',
      icon: 'ri-palette-line',
      path: (s) => `/projects/graphic-design/${s}`,
    },
    threeDArtProjects: {
      label: '3D Art Project',
      icon: 'ri-shape-line',
      path: (s) => `/projects/3d-art/${s}`,
    },
  };

  let query = $state('');
  let page = $state(1);
  let results: SearchRecord[] = $state([]);
  let totalDocs = $state(0);
  let totalPages = $state(1);
  let loading = $state(false);
  let hasSearched = $state(false);

  let inputEl: HTMLInputElement | undefined;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function updateURL() {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    if (page > 1) url.searchParams.set('page', String(page));
    else url.searchParams.delete('page');
    window.history.replaceState(null, '', url);
    document.title = query ? `Search results for "${query}"` : 'Search the site';
  }

  async function doSearch(q: string, p: number) {
    if (!q.trim()) {
      results = [];
      totalDocs = 0;
      totalPages = 1;
      hasSearched = false;
      loading = false;
      return;
    }

    console.log(`[SearchResults] doSearch q="${q}" page=${p}`);
    hasSearched = true;
    loading = true;

    try {
      const params = new URLSearchParams({ q, page: String(p) });
      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error(`Search API responded ${res.status}`);
      const data: SearchResponse = await res.json();
      console.log(`[SearchResults] API returned totalDocs=${data.totalDocs} results=${data.results.length}`);
      results = data.results;
      totalDocs = data.totalDocs;
      totalPages = data.totalPages;
      page = data.page;
    } catch (err) {
      console.error('[SearchResults] fetch error:', err);
      results = [];
      totalDocs = 0;
      totalPages = 1;
    } finally {
      loading = false;
    }
  }

  function handleInput() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      page = 1;
      updateURL();
      doSearch(query, 1);
    }, 300);
  }

  function goToPage(p: number) {
    page = p;
    updateURL();
    doSearch(query, p);
    document.querySelector('.search-results-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function getPageItems(current: number, last: number): number[] {
    const windowSize = Math.min(5, last);
    let start = Math.max(1, current - 2);
    start = Math.min(start, Math.max(1, last - windowSize + 1));
    return Array.from({ length: windowSize }, (_, i) => start + i);
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function syncFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get('q')?.trim() ?? '';
    const urlPage = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);
    query = urlQuery;
    page = urlPage;
    if (urlQuery) {
      doSearch(urlQuery, urlPage);
    } else {
      results = [];
      totalDocs = 0;
      totalPages = 1;
      hasSearched = false;
    }
  }

  onMount(() => {
    inputEl?.focus();
    syncFromUrl();
    document.addEventListener('astro:page-load', syncFromUrl);
    return () => document.removeEventListener('astro:page-load', syncFromUrl);
  });
</script>

<div class="search-page-container">
  <div class="search-input-wrapper">
    <span class="ri-search-2-line search-input-icon" aria-hidden="true"></span>
    <input
      bind:this={inputEl}
      bind:value={query}
      oninput={handleInput}
      type="search"
      class="search-input"
      placeholder="Search posts, guides, projects…"
      aria-label="Search"
      autocomplete="off"
      spellcheck="false"
    />
  </div>

  <div class="search-results-header">
    <p class="section-title" id="search-readout">
      {#if query}
        Results for <em>"{query}"</em>
      {:else}
        Start a search
      {/if}
    </p>
    <span aria-live="polite" id="search-count">
      {#if query && loading}
        Searching…
      {:else if query && !loading}
        {totalDocs === 1 ? '1 result' : totalDocs > 0 ? `${totalDocs} results` : ''}
      {/if}
    </span>
  </div>

  <section aria-label="Search Results" class="search-results-section">
    <div class="loading-icon">
      <i
        id="spinner"
        class="ri-loader-2-fill"
        data-active={loading ? 'true' : 'false'}
      ></i>
    </div>

    {#if !loading && hasSearched && results.length === 0}
      <div class="search-state">
        <span class="search-state-icon ri-emotion-sad-line" aria-hidden="true"></span>
        <p class="search-state-title">No results found</p>
        <p class="search-state-text">
          No matches for "{query}". Try a different keyword or broader term.
        </p>
      </div>
    {:else if !hasSearched}
      <div class="search-state">
        <span class="search-state-icon ri-search-2-line" aria-hidden="true"></span>
        <p class="search-state-title">Start typing to search</p>
        <p class="search-state-text">
          Search across blog posts, guides, and frontend projects.
        </p>
      </div>
    {:else if !loading}
      <ul id="search-results" aria-label="Search results">
        {#each results as result (result.slug + result.source)}
          {@const meta = SOURCE_META[result.source] ?? {
            label: result.source,
            icon: 'ri-file-line',
            path: () => '#',
          }}
          {@const link = meta.path(result.slug)}
          <li class="search-result-item">
            <h3 class="search-result-title">
              <a href={link}>{result.title}</a>
            </h3>
            <hr class="search-result-hr" />
            <div class="search-result-meta">
              <span class="search-result-source">
                <span class={meta.icon} aria-hidden="true"></span>{meta.label}
              </span>
              <time class="search-result-date">
                <span class="ri-calendar-line" aria-hidden="true"></span>{formatDate(result.date)}
              </time>
            </div>
            <p class="search-result-desc">{result.description}</p>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <div id="search-paginator">
    {#if totalPages > 1}
      {@const pageItems = getPageItems(page, totalPages)}
      <nav class="page-nav" aria-label="Results pagination">
        <div class="page-nav-arrows back-arrows">
          {#if page === 1}
            <span class="page-nav-btn disabled" aria-disabled="true"
              ><i class="ri-skip-left-line"></i></span
            >
            <span class="page-nav-btn disabled" aria-disabled="true"
              ><i class="ri-arrow-left-s-line"></i></span
            >
          {:else}
            <button class="page-nav-btn" onclick={() => goToPage(1)} title="First page">
              <span class="visually-hidden">First page</span><i class="ri-skip-left-line"></i>
            </button>
            <button
              class="page-nav-btn"
              onclick={() => goToPage(page - 1)}
              title="Previous page"
            >
              <span class="visually-hidden">Previous page</span><i
                class="ri-arrow-left-s-line"
              ></i>
            </button>
          {/if}
        </div>

        <ol class="page-list">
          {#each pageItems as n}
            <li>
              {#if n === page}
                <span class="page-list-item current" aria-current="page">{n}</span>
              {:else}
                <button
                  class="page-list-item"
                  onclick={() => goToPage(n)}
                  title="Go to page {n}">{n}</button
                >
              {/if}
            </li>
          {/each}
        </ol>

        <div class="page-nav-arrows forward-arrows">
          {#if page === totalPages}
            <span class="page-nav-btn disabled" aria-disabled="true"
              ><i class="ri-arrow-right-s-line"></i></span
            >
            <span class="page-nav-btn disabled" aria-disabled="true"
              ><i class="ri-skip-right-line"></i></span
            >
          {:else}
            <button
              class="page-nav-btn"
              onclick={() => goToPage(page + 1)}
              title="Next page"
            >
              <span class="visually-hidden">Next page</span><i
                class="ri-arrow-right-s-line"
              ></i>
            </button>
            <button
              class="page-nav-btn"
              onclick={() => goToPage(totalPages)}
              title="Last page"
            >
              <span class="visually-hidden">Last page</span><i
                class="ri-skip-right-line"
              ></i>
            </button>
          {/if}
        </div>

        <form
          class="go-to-page"
          onsubmit={(e) => {
            e.preventDefault();
            const input = (e.currentTarget as HTMLFormElement).elements.namedItem(
              'goto',
            ) as HTMLInputElement;
            const p = parseInt(input.value, 10);
            if (!isNaN(p) && p >= 1 && p <= totalPages) {
              input.value = '';
              goToPage(p);
            }
          }}
        >
          <input
            type="number"
            name="goto"
            min="1"
            max={totalPages}
            placeholder="{page}/{totalPages}"
            aria-label="Go to page (1–{totalPages})"
            required
          />
          <button type="submit">Go to Page</button>
        </form>
      </nav>
    {/if}
  </div>
</div>
