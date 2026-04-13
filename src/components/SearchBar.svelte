<form id="search-input-form">
  <fieldset>
    <legend class="visually-hidden">Search the site</legend>
    <label for="search">
      <input
        type="search"
        name="search"
        id="search"
        placeholder="Search"
        min="1"
      />
    </label>
    <button title="Search">
      <span class="visually-hidden">Search</span>
      <span class={`search-btn-icon ri-search-line`}></span>
    </button>
  </fieldset>
</form>

<style>
  fieldset {
    position: relative;

    padding: 0;
    border: none;
    margin: 0;
  }

  input#search {
    content: '';
    width: 10rem;
    height: 2.25rem;

    border-radius: 2.25rem;
    border: none;

    padding-left: 3rem;

    background-color: var(--clr-base-0);
    outline-width: 0.1rem;
    outline-style: solid;
    outline-color: var(--clr-surface-1);
  }

  button {
    position: absolute;
    left: 0;

    height: 100%;
    width: 2.5rem;

    cursor: pointer;

    border: none;
    border-radius: 999px 0 0 999px;

    background-color: transparent;
    color: var(--clr-text-2);

    transition: color 200ms ease-out;
  }

  button:hover {
    color: var(--clr-primary);
  }
</style>
