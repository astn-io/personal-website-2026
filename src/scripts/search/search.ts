import Fuse from 'fuse.js';
import fuseOptions from './fuseOptions';
import resultTemplate from './resultTemplate';

document.addEventListener('astro:page-load', () => {
  let searchData: any[] = [];
  let fuseInstance: any = undefined;

  const search = document.getElementById('search') as HTMLInputElement | null;
  const searchReadout = document.getElementById('search-readout');
  const searchResultOutput = document.getElementById('search-results');
  const searchCount = document.getElementById('search-count');
  const searchState = document.getElementById('search-state');
  const searchStateIcon = document.getElementById('search-state-icon');
  const searchStateTitle = document.getElementById('search-state-title');
  const searchStateText = document.getElementById('search-state-text');

  if (!search || !searchReadout || !searchResultOutput) return;

  const urlParams =
    new URLSearchParams(window.location.search).get('q') ?? '';

  function escapeText(value: string) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  function updateDocumentTitle(term: string) {
    document.title = term
      ? `Search results for "${term}"`
      : `Search the site`;
  }

  function updateSearchReadout(term: string) {
    if (!searchReadout) return;
    searchReadout.innerHTML = term
      ? `Results for <em>"${escapeText(term)}"</em>`
      : `Start a search`;
  }

  function updateSearchCount(term: string, count: number | null) {
    if (!searchCount) return;
    if (!term) {
      searchCount.textContent = '';
      return;
    }
    if (count === null) {
      searchCount.textContent = 'Searching…';
      return;
    }
    searchCount.textContent =
      count === 1 ? `1 result` : `${count} results`;
  }

  function setState(
    visible: boolean,
    opts?: { icon?: string; title?: string; text?: string },
  ) {
    if (!searchState) return;
    if (!visible) {
      searchState.hidden = true;
      return;
    }
    if (opts?.icon && searchStateIcon) {
      searchStateIcon.className = `search-state-icon ${opts.icon}`;
    }
    if (opts?.title && searchStateTitle) {
      searchStateTitle.textContent = opts.title;
    }
    if (opts?.text && searchStateText) {
      searchStateText.textContent = opts.text;
    }
    searchState.hidden = false;
  }

  function updateSearchPageURL(term: string) {
    const url = new URL(window.location.href);
    if (term) {
      url.searchParams.set('q', term);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState(null, '', url);
  }

  function generateSearchList(results: any) {
    return results.map((r: any) => resultTemplate(r.item)).join('');
  }

  async function fetchSearchResults(term: string) {
    const spinner = document.getElementById('spinner');

    if (!searchResultOutput) return;

    if (term.length === 0) {
      searchResultOutput.innerHTML = '';
      updateSearchCount('', null);
      setState(true, {
        icon: 'ri-search-2-line',
        title: 'Start typing to search',
        text: 'Search across blog posts, guides, and frontend projects.',
      });
      spinner?.setAttribute('data-active', 'false');
      return;
    }

    setState(false);
    spinner?.setAttribute('data-active', 'true');
    updateSearchCount(term, null);

    if (searchData.length === 0) {
      try {
        const res = await fetch('/search.json');
        if (!res.ok) {
          throw new Error('"search.json" not found!');
        }
        searchData = await res.json();
      } catch (error) {
        console.error(error);
      }
    }

    if (searchData.length && !fuseInstance) {
      fuseInstance = new Fuse(searchData, fuseOptions);
    }

    if (!fuseInstance) {
      spinner?.setAttribute('data-active', 'false');
      return;
    }

    const searchResult = fuseInstance.search(term);

    spinner?.setAttribute('data-active', 'false');

    if (searchResult.length > 0) {
      searchResultOutput.innerHTML = generateSearchList(searchResult);
      updateSearchCount(term, searchResult.length);
      setState(false);
    } else {
      searchResultOutput.innerHTML = '';
      updateSearchCount(term, 0);
      setState(true, {
        icon: 'ri-emotion-sad-line',
        title: 'No results found',
        text: `No matches for "${term}". Try a different keyword or broader term.`,
      });
    }
  }

  function initSearchPage() {
    fetchSearchResults(urlParams);
    updateDocumentTitle(urlParams);
    updateSearchReadout(urlParams);

    if (search) {
      search.value = urlParams;
      search.focus();
    }
  }

  search.addEventListener('input', () => {
    const term = search.value;
    fetchSearchResults(term);
    updateDocumentTitle(term);
    updateSearchReadout(term);
    updateSearchPageURL(term);
  });

  initSearchPage();
});
