import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import './Contact.css';

export default function Contact() {
  const [state, handleSubmit] = useForm('YOUR_FORM_ID');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  if (state.succeeded) {
    return <p className="form-status success">Message sent! Thank you for reaching out.</p>;
  }

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" name="name" required maxLength={50} />
        <ValidationError prefix="Name" field="name" errors={state.errors} />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" required maxLength={100} />
        <ValidationError prefix="Email" field="email" errors={state.errors} />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={maxChars}
          onChange={(e) => setCharCount(e.target.value.length)}
        />
        <span className="char-limit">{charCount}/{maxChars} characters</span>
        <ValidationError prefix="Message" field="message" errors={state.errors} />

        <button type="submit" disabled={state.submitting}>Send</button>
      </form>
    </div>
  );
}
