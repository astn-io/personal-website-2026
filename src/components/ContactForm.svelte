<dialog id="contact-dialog" aria-labelledby="dialog-title">
  <form method="dialog">
    <div>
      <h2 id="dialog-title">Contact Us</h2>
      <button
        type="button"
        aria-label="Close dialog"
        commandfor="contact-dialog"
        command="close"
      >
        <span>X</span>
      </button>
    </div>

    <div role="group" aria-labelledby="dialog-title">
      <div>
        <label for="name">Full Name <span aria-hidden="true">*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autocomplete="name"
          aria-required="true"
        />
      </div>

      <div>
        <label for="email"
          >Email Address <span aria-hidden="true">*</span></label
        >
        <input
          type="email"
          id="email"
          name="email"
          required
          autocomplete="email"
          aria-required="true"
          aria-describedby="email-hint"
        />
        <small id="email-hint">We'll never share your email.</small>
      </div>

      <div>
        <label for="subject">Subject</label>
        <select id="subject" name="subject">
          <option value="">— Choose a topic —</option>
          <option value="general">General Inquiry</option>
          <option value="support">Technical Support</option>
          <option value="billing">Billing</option>
        </select>
      </div>

      <div>
        <label for="message">Message <span aria-hidden="true">*</span></label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          aria-required="true"
        ></textarea>
      </div>
    </div>

    <footer>
      <button type="button" commandfor="contact-dialog" command="close">
        <span>Cancel</span>
      </button>
      <button type="submit">Send Message</button>
    </footer>
  </form>
</dialog>

<style>
  dialog#contact-dialog[open] {
    display: flex;
    align-items: center;
    justify-content: center;

    border: none;

    background-color: var(--clr-base-0);
  }

  dialog#contact-dialog::backdrop {
    background-color: hsl(from var(--clr-base-2) h s l / 0.8);
    backdrop-filter: blur(24px);
  }

  form {
    padding: 1rem;
  }
</style>
