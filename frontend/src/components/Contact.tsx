import { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import './Contact.css';

export default function Contact() {
  const [state, handleSubmit] = useForm('YOUR_FORM_ID');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  return (
    <div className="main-content">
      <div className="container py-4 py-md-5 contact-container">
        {state.succeeded && (
          <div className="row justify-content-center mb-4">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="alert alert-success shadow-sm mb-0" role="alert">
                Message sent! Thank you for reaching out.
              </div>
            </div>
          </div>
        )}
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <h1 className="text-center mb-4">Contact Us</h1>
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  maxLength={50}
                  className="form-control"
                  disabled={state.submitting}
                />
                <ValidationError prefix="Name" field="name" errors={state.errors} />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  maxLength={100}
                  className="form-control"
                  disabled={state.submitting}
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>

              <div className="mb-2">
                <label htmlFor="message" className="form-label fw-semibold">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  maxLength={maxChars}
                  className="form-control"
                  onChange={(e) => setCharCount(e.target.value.length)}
                  disabled={state.submitting}
                />
                <div className="d-flex justify-content-end">
                  <span className="char-limit small text-light">{charCount}/{maxChars} characters</span>
                </div>
                <ValidationError prefix="Message" field="message" errors={state.errors} />
              </div>

              <div className="d-grid mt-3">
                <button type="submit" className="btn btn-danger btn-lg fw-bold" disabled={state.submitting}>
                  {state.submitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
