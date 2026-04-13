import Fuse from 'fuse.js';
import fuseOptions from './fuseOptions';
import resultTemplate from './resultTemplate';

const PAGE_SIZE = 10;

document.addEventListener('astro:page-load', () => {
  let searchData: any[] = [];
  let fuseInstance: any = undefined;
  let currentResults: any[] = [];
  let currentPage = 1;

  const search = document.getElementById('search') as HTMLInputElement | null;
  const searchReadout = document.getElementById('search-readout');
  const searchResultOutput = document.getElementById('search-results');
  const searchCount = document.getElementById('search-count');
  const searchState = document.getElementById('search-state');
  const searchStateIcon = document.getElementById('search-state-icon');
  const searchStateTitle = document.getElementById('search-state-title');
  const searchStateText = document.getElementById('search-state-text');
  const paginatorContainer = document.getElementById('search-paginator');

  if (!search || !searchReadout || !searchResultOutput) return;

  const urlParams = new URLSearchParams(window.location.search);
  const initialTerm = urlParams.get('q') ?? '';
  const initialPage = Math.max(
    1,
    parseInt(urlParams.get('page') ?? '1', 10) || 1,
  );

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

  function updateSearchPageURL(term: string, page: number) {
    const url = new URL(window.location.href);
    if (term) {
      url.searchParams.set('q', term);
    } else {
      url.searchParams.delete('q');
    }
    if (page > 1) {
      url.searchParams.set('page', String(page));
    } else {
      url.searchParams.delete('page');
    }
    window.history.replaceState(null, '', url);
  }

  function generateSearchList(results: any) {
    return results.map((r: any) => resultTemplate(r.item)).join('');
  }

  function getPageItems(current: number, last: number): number[] {
    const windowSize = Math.min(5, last);
    let start = current - 2;
    start = Math.max(1, start);
    start = Math.min(start, last - windowSize + 1);
    return Array.from({ length: windowSize }, (_, i) => start + i);
  }

  function clearPaginator() {
    if (paginatorContainer) paginatorContainer.innerHTML = '';
  }

  function renderPaginator() {
    if (!paginatorContainer) return;
    const lastPage = Math.max(1, Math.ceil(currentResults.length / PAGE_SIZE));

    if (lastPage <= 1) {
      clearPaginator();
      return;
    }

    const items = getPageItems(currentPage, lastPage);
    const atFirst = currentPage === 1;
    const atLast = currentPage === lastPage;

    const navBtn = (
      disabled: boolean,
      page: number,
      icon: string,
      label: string,
    ) =>
      disabled
        ? `<span class="page-nav-btn disabled" aria-disabled="true"><i class="${icon}"></i></span>`
        : `<a class="page-nav-btn" href="#" data-page="${page}" title="${label}"><span class="visually-hidden">${label}</span><i class="${icon}"></i></a>`;

    const pageItemsHtml = items
      .map((n) =>
        n === currentPage
          ? `<li><span class="page-list-item current" aria-current="page">${n}</span></li>`
          : `<li><a class="page-list-item" href="#" data-page="${n}" title="Go to page ${n}">${n}</a></li>`,
      )
      .join('');

    paginatorContainer.innerHTML = `
      <nav class="page-nav" data-last-page="${lastPage}">
        <div class="page-nav-arrows back-arrows">
          ${navBtn(atFirst, 1, 'ri-skip-left-line', 'First page')}
          ${navBtn(atFirst, currentPage - 1, 'ri-arrow-left-s-line', 'Previous page')}
        </div>
        <ol class="page-list">${pageItemsHtml}</ol>
        <div class="page-nav-arrows forward-arrows">
          ${navBtn(atLast, currentPage + 1, 'ri-arrow-right-s-line', 'Next page')}
          ${navBtn(atLast, lastPage, 'ri-skip-right-line', 'Last page')}
        </div>
        <form class="go-to-page" data-paginator-form>
          <input type="number" min="1" max="${lastPage}" placeholder="${currentPage}/${lastPage}" aria-label="Go to page (1–${lastPage})" required data-paginator-input />
          <button type="submit">Go to Page</button>
        </form>
      </nav>
    `;

    paginatorContainer
      .querySelectorAll<HTMLAnchorElement>('a[data-page]')
      .forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const page = parseInt(el.dataset.page ?? '1', 10);
          goToPage(page);
        });
      });

    const form = paginatorContainer.querySelector<HTMLFormElement>(
      '[data-paginator-form]',
    );
    const input = paginatorContainer.querySelector<HTMLInputElement>(
      '[data-paginator-input]',
    );
    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const page = parseInt(input.value, 10);
        if (isNaN(page) || page < 1 || page > lastPage) return;
        goToPage(page);
      });
    }
  }

  function renderCurrentPage() {
    if (!searchResultOutput) return;
    const lastPage = Math.max(1, Math.ceil(currentResults.length / PAGE_SIZE));
    if (currentPage > lastPage) currentPage = lastPage;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageResults = currentResults.slice(start, end);
    searchResultOutput.innerHTML = generateSearchList(pageResults);
    renderPaginator();
  }

  function goToPage(page: number) {
    const term = search?.value ?? '';
    currentPage = page;
    renderCurrentPage();
    updateSearchPageURL(term, currentPage);

    document.getElementById('search-results')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  async function fetchSearchResults(term: string) {
    const spinner = document.getElementById('spinner');

    if (!searchResultOutput) return;

    if (term.length === 0) {
      currentResults = [];
      searchResultOutput.innerHTML = '';
      clearPaginator();
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
    currentResults = searchResult;

    spinner?.setAttribute('data-active', 'false');

    if (searchResult.length > 0) {
      updateSearchCount(term, searchResult.length);
      setState(false);
      renderCurrentPage();
    } else {
      currentResults = [];
      searchResultOutput.innerHTML = '';
      clearPaginator();
      updateSearchCount(term, 0);
      setState(true, {
        icon: 'ri-emotion-sad-line',
        title: 'No results found',
        text: `No matches for "${term}". Try a different keyword or broader term.`,
      });
    }
  }

  async function initSearchPage() {
    currentPage = initialPage;
    await fetchSearchResults(initialTerm);
    updateDocumentTitle(initialTerm);
    updateSearchReadout(initialTerm);
    updateSearchPageURL(initialTerm, currentPage);

    if (search) {
      search.value = initialTerm;
      search.focus();
    }
  }

  search.addEventListener('input', async () => {
    const term = search.value;
    currentPage = 1;
    await fetchSearchResults(term);
    updateDocumentTitle(term);
    updateSearchReadout(term);
    updateSearchPageURL(term, 1);
  });

  initSearchPage();
});
