<script lang="ts">
  let subject = $state('general');

  function closeDialog(dialog: HTMLDialogElement) {
    dialog.classList.add('closing');
    dialog.addEventListener(
      'transitionend',
      () => {
        dialog.classList.remove('closing');
        dialog.close();
      },
      { once: true },
    );
  }

  function onDialogClick(event: MouseEvent) {
    const dialog = event.currentTarget as HTMLDialogElement;
    if (event.target === dialog) {
      closeDialog(dialog);
    }
  }

  function onCloseClick() {
    const dialog = document.getElementById(
      'contact-dialog',
    ) as HTMLDialogElement;
    closeDialog(dialog);
  }
</script>

<dialog
  id="contact-dialog"
  aria-labelledby="dialog-title"
  onclick={onDialogClick}
>
  <form method="dialog">
    <div class="dialog-header">
      <h2 id="dialog-title">Contact Me</h2>
      <button
        type="button"
        class="close-btn"
        aria-label="Close dialog"
        onclick={onCloseClick}
      >
        <span class="ri-close-line"></span>
      </button>
    </div>

    <div class="dialog-body" role="group" aria-labelledby="dialog-title">
      <div class="yummyhunni" aria-hidden="true">
        <label for="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <div class="field">
        <label for="name">Full Name <span aria-hidden="true">*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autocomplete="name"
          aria-required="true"
          placeholder="Jane Doe"
        />
      </div>

      <div class="field">
        <label for="email">
          <span>Email Address</span>
          <span aria-hidden="true">*</span></label
        >
        <input
          type="email"
          id="email"
          name="email"
          required
          autocomplete="email"
          aria-required="true"
          aria-describedby="email-hint"
          placeholder="jane@example.com"
        />
      </div>

      <div class="field">
        <label for="subject">Subject</label>
        <select
          id="subject"
          name={subject === 'custom' ? undefined : 'subject'}
          bind:value={subject}
        >
          <option value="general">General Inquiry</option>
          <option value="comission">Commission Request</option>
          <option value="support">Support Request</option>
          <option value="custom">Other (custom)…</option>
        </select>
        {#if subject === 'custom'}
          <input
            type="text"
            name="subject"
            required
            aria-label="Custom subject"
            aria-required="true"
            placeholder="Describe your topic…"
          />
        {/if}
      </div>

      <div class="field">
        <label for="message">Message <span aria-hidden="true">*</span></label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          aria-required="true"
          placeholder="What's on your mind?"
        ></textarea>
      </div>
    </div>

    <footer class="dialog-footer">
      <button type="button" class="btn-cancel" onclick={onCloseClick}>
        Cancel
      </button>
      <button type="submit" class="btn-submit">
        <span class="ri-send-plane-line"></span>
        Send Message
      </button>
    </footer>
  </form>
</dialog>

<style>
  /* --- Dialog --- */
  dialog#contact-dialog {
    border: none;
    border-radius: 8px;
    padding: 0;
    max-width: min(520px, calc(100vw - 2rem));
    width: 100%;

    background-color: var(--clr-base-0);
    color: var(--clr-text-0);

    box-shadow:
      0 8px 32px oklch(from var(--clr-base-2) l c h / 0.4),
      0 2px 8px oklch(from var(--clr-base-2) l c h / 0.2);

    opacity: 1;
    transform: translateY(0) scale(1);

    transition:
      opacity 200ms ease-out,
      transform 200ms ease-out;
  }

  dialog#contact-dialog[open] {
    display: flex;
    flex-direction: column;
  }

  /* Entry animation */
  @starting-style {
    dialog#contact-dialog[open] {
      opacity: 0;
      transform: translateY(12px) scale(0.97);
    }
  }

  /* Exit animation — :global needed because .closing is added via JS */
  :global(dialog#contact-dialog.closing) {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }

  dialog#contact-dialog::backdrop {
    background-color: oklch(from var(--clr-base-2) l c h / 0.7);
    backdrop-filter: blur(16px);

    opacity: 1;
    transition: opacity 200ms ease-out;
  }

  @starting-style {
    dialog#contact-dialog[open]::backdrop {
      opacity: 0;
    }
  }

  :global(dialog#contact-dialog.closing::backdrop) {
    opacity: 0;
  }

  /* --- Spam Honeypot --- */
  .yummyhunni {
    position: absolute;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
  }

  /* --- Form --- */
  form {
    display: flex;
    flex-direction: column;
  }

  /* --- Header --- */
  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 1.25rem 1.5rem;

    border-bottom: 1px solid var(--clr-surface-0);
  }

  .dialog-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.01rem;
    margin: 0;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 2rem;
    height: 2rem;

    border: none;
    border-radius: 4px;
    background-color: transparent;

    color: var(--clr-text-2);
    font-size: 1.25rem;

    cursor: pointer;
    transition:
      background-color 200ms ease-out,
      color 200ms ease-out;
  }

  .close-btn:hover {
    background-color: var(--clr-surface-0);
    color: var(--clr-text-0);
  }

  /* --- Body / Fields --- */
  .dialog-body {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    padding: 1.5rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .field label {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.02rem;
    color: var(--clr-text-1);
  }

  .field label span {
    color: var(--clr-error);
  }

  .field input,
  .field select,
  .field textarea {
    font-family: inherit;
    font-size: 0.95rem;
    letter-spacing: 0.01rem;

    padding: 0.625rem 0.75rem;

    border: 1.5px solid var(--clr-surface-1);
    border-radius: 4px;

    background-color: var(--clr-surface-0);
    color: var(--clr-text-0);

    outline: none;
    transition:
      border-color 200ms ease-out,
      box-shadow 200ms ease-out;
  }

  .field input::placeholder,
  .field textarea::placeholder {
    color: var(--clr-text-2);
    opacity: 0.6;
  }

  .field input:focus,
  .field select:focus,
  .field textarea:focus {
    border-color: var(--clr-primary);
    box-shadow: 0 0 0 3px oklch(from var(--clr-primary) l c h / 0.15);
  }

  .field select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2.25rem;
  }

  .field textarea {
    resize: vertical;
    min-height: 6rem;
  }

  .field small {
    font-size: 0.75rem;
    color: var(--clr-text-2);
    letter-spacing: 0.02rem;
  }

  /* --- Footer --- */
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;

    padding: 1rem 1.5rem;

    border-top: 1px solid var(--clr-surface-0);
  }

  .btn-cancel,
  .btn-submit {
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.015ch;

    padding: 0.625rem 1.125rem;

    border: none;
    border-radius: 4px;

    cursor: pointer;

    transition:
      background-color 200ms ease-out,
      color 200ms ease-out,
      outline-color 200ms ease-out;
  }

  .btn-cancel {
    background-color: transparent;
    color: var(--clr-text-1);

    outline: 1.5px solid var(--clr-surface-1);
  }

  .btn-cancel:hover {
    background-color: var(--clr-surface-0);
    color: var(--clr-text-0);
    outline-color: var(--clr-surface-2);
  }

  .btn-submit {
    display: flex;
    align-items: center;
    gap: 0.375rem;

    font-weight: 700;

    background-color: var(--clr-primary);
    color: var(--clr-text);

    outline: 2px solid transparent;
  }

  :global(:root[data-color-scheme='dark']) .btn-submit {
    background-color: oklch(from var(--clr-primary) calc(l - 0.1) c h);
  }

  :global(:root[data-color-scheme='dark']) .btn-submit:hover {
    background-color: var(--clr-primary);
  }

  :global(:root[data-color-scheme='light']) .btn-submit {
    background-color: var(--clr-primary);
    color: var(--clr-base-0);
  }

  :global(:root[data-color-scheme='light']) .btn-submit:hover {
    background-color: oklch(from var(--clr-primary) calc(l + 0.1) c h);
  }

  .btn-submit:focus,
  .btn-cancel:focus {
    outline: 2px solid var(--clr-text-0);
  }

  .btn-submit span {
    font-size: 1.1rem;
  }

  /* --- Responsive --- */
  @media screen and (max-width: 600px) {
    .dialog-header {
      padding: 1rem 1.25rem;
    }

    .dialog-body {
      padding: 1.25rem;
    }

    .dialog-footer {
      padding: 1rem 1.25rem;
    }

    .dialog-header h2 {
      font-size: 1.25rem;
    }
  }
</style>
