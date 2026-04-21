<script lang="ts">
  type FormState = 'idle' | 'submitting' | 'success' | 'error';

  let honeypot = $state('');
  let name = $state('');
  let email = $state('');
  let subject = $state('general');
  let customSubject = $state('');
  let message = $state('');
  let formState = $state<FormState>('idle');
  let errorMessage = $state('');

  function closeDialog(dialog: HTMLDialogElement) {
    dialog.classList.add('closing');
    dialog.addEventListener(
      'transitionend',
      () => {
        dialog.classList.remove('closing');
        dialog.close();
        if (formState === 'success') {
          formState = 'idle';
          subject = 'general';
        }
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

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (formState === 'submitting') return;
    if (honeypot) return;

    formState = 'submitting';
    errorMessage = '';

    const resolvedSubject = subject === 'custom' ? customSubject : subject;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: resolvedSubject,
          message,
          website: honeypot,
        }),
      });

      if (!res.ok) {
        errorMessage = 'Failed to submit. Please try again.';
        formState = 'error';
      } else {
        formState = 'success';
        name = '';
        email = '';
        subject = 'general';
        customSubject = '';
        message = '';
      }
    } catch {
      errorMessage =
        'Network error. Please check your connection and try again.';
      formState = 'error';
    }
  }
</script>

<dialog
  id="contact-dialog"
  aria-labelledby="dialog-title"
  onclick={onDialogClick}
>
  <form onsubmit={onSubmit}>
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

    {#if formState === 'success'}
      <div class="dialog-body success-state" role="status">
        <span class="ri-checkbox-circle-line success-icon"></span>
        <p class="success-title">Message sent!</p>
        <p class="success-body">
          Thanks for reaching out. I'll get back to you soon.
        </p>
      </div>
      <footer class="dialog-footer">
        <button type="button" class="btn-submit" onclick={onCloseClick}>
          Close
        </button>
      </footer>
    {:else}
      <div class="dialog-body" role="group" aria-labelledby="dialog-title">
        <div class="yummyhunni" aria-hidden="true">
          <label for="website">Website</label>
          <input
            type="text"
            id="website"
            tabindex="-1"
            autocomplete="off"
            bind:value={honeypot}
          />
        </div>

        <div class="field">
          <label for="name">Full Name <span aria-hidden="true">*</span></label>
          <input
            type="text"
            id="name"
            required
            autocomplete="name"
            aria-required="true"
            placeholder="Jane Doe"
            disabled={formState === 'submitting'}
            bind:value={name}
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
            required
            autocomplete="email"
            aria-required="true"
            placeholder="jane@example.com"
            disabled={formState === 'submitting'}
            bind:value={email}
          />
        </div>

        <div class="field">
          <label for="subject">Subject</label>
          <select
            id="subject"
            bind:value={subject}
            disabled={formState === 'submitting'}
          >
            <option value="general">General Inquiry</option>
            <option value="comission">Commission Request</option>
            <option value="support">Support Request</option>
            <option value="custom">Other (custom)…</option>
          </select>
          {#if subject === 'custom'}
            <input
              type="text"
              required
              aria-label="Custom subject"
              aria-required="true"
              placeholder="Describe your topic…"
              disabled={formState === 'submitting'}
              bind:value={customSubject}
            />
          {/if}
        </div>

        <div class="field">
          <label for="message">Message <span aria-hidden="true">*</span></label>
          <textarea
            id="message"
            rows="5"
            required
            aria-required="true"
            placeholder="What's on your mind?"
            disabled={formState === 'submitting'}
            bind:value={message}
          ></textarea>
        </div>

        {#if formState === 'error'}
          <p class="error-message" role="alert">
            <span class="ri-error-warning-line"></span>
            {errorMessage}
          </p>
        {/if}
      </div>

      <footer class="dialog-footer">
        <button
          type="button"
          class="btn-cancel"
          onclick={onCloseClick}
          disabled={formState === 'submitting'}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn-submit"
          disabled={formState === 'submitting'}
        >
          {#if formState === 'submitting'}
            <span class="ri-loader-4-line spin"></span>
            Sending…
          {:else}
            <span class="ri-send-plane-line"></span>
            Send Message
          {/if}
        </button>
      </footer>
    {/if}
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

  .field input:disabled,
  .field select:disabled,
  .field textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  /* .field small {
    font-size: 0.75rem;
    color: var(--clr-text-2);
    letter-spacing: 0.02rem;
  } */

  /* --- Error message --- */
  .error-message {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    font-size: 0.875rem;
    color: var(--clr-error);
    margin: 0;
  }

  /* --- Success state --- */
  .success-state {
    align-items: center;
    text-align: center;
    padding: 2.5rem 1.5rem;
    gap: 0.5rem;
  }

  .success-icon {
    font-size: 2.5rem;
    color: var(--clr-success, oklch(0.72 0.18 145));
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .success-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0;
  }

  .success-body {
    font-size: 0.9rem;
    color: var(--clr-text-1);
    margin: 0;
  }

  /* --- Spinner --- */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .spin {
    display: inline-block;
    animation: spin 0.7s linear infinite;
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

  .btn-cancel:hover:not(:disabled) {
    background-color: var(--clr-surface-0);
    color: var(--clr-text-0);
    outline-color: var(--clr-surface-2);
  }

  .btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  :global(:root[data-color-scheme='dark']) .btn-submit {
    background-color: oklch(from var(--clr-primary) calc(l - 0.1) c h);
  }

  :global(:root[data-color-scheme='dark']) .btn-submit:hover:not(:disabled) {
    background-color: var(--clr-primary);
  }

  :global(:root[data-color-scheme='light']) .btn-submit {
    background-color: var(--clr-primary);
    color: var(--clr-base-0);
  }

  :global(:root[data-color-scheme='light']) .btn-submit:hover:not(:disabled) {
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
