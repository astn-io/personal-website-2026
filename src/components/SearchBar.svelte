<form id="search-input-form" role="search">
  <fieldset>
    <legend class="visually-hidden">Search the site</legend>
    <input
      type="search"
      name="search"
      id="search"
      placeholder="Search"
      aria-label="Search the site"
      minlength="1"
    />
    <button type="submit" title="Search">
      <span class="visually-hidden">Search</span>
      <span class="search-btn-icon ri-search-line"></span>
    </button>
  </fieldset>
</form>

<style>
  fieldset {
    position: relative;

    display: flex;
    align-items: center;

    padding: 0;
    border: none;
    margin: 0;
  }

  input#search {
    width: 10rem;
    height: 2rem;

    border-radius: 999px;
    border: none;

    padding-left: 2.25rem;
    padding-right: 0.75rem;

    font-size: 0.85rem;
    font-weight: 400;
    letter-spacing: 0.01em;

    color: var(--clr-text-1);
    background-color: oklch(from var(--clr-base-0) l c h / 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    outline: 1px solid oklch(from var(--clr-surface-2) l c h / 0.5);

    transition:
      outline-color 200ms ease,
      width 250ms ease;
  }

  input#search::placeholder {
    color: var(--clr-text-2);
    font-weight: 400;
  }

  input#search:focus {
    outline-color: oklch(from var(--clr-primary) l c h / 0.5);
    width: 14rem;
  }

  button {
    position: absolute;
    left: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 2.25rem;

    cursor: pointer;

    border: none;
    background-color: transparent;
    color: var(--clr-text-2);

    font-size: 0.85rem;

    transition: color 150ms ease;
  }

  button:hover {
    color: var(--clr-primary);
  }
</style>
