"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

// Same EmailJS service/template/public key the previous contact form used
const EMAILJS = {
  service: "service_u5579sq",
  template: "template_n0d1aau",
  publicKey: "GVC4lZO9Db_aCA5BK",
};

export default function ContactForm() {
  const form = useRef(null);
  const [state, setState] = useState("idle"); // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault();
    setState("sending");
    try {
      await emailjs.sendForm(EMAILJS.service, EMAILJS.template, form.current, EMAILJS.publicKey);
      form.current.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <form ref={form} onSubmit={onSubmit} className="space-y-4" aria-describedby="contact-status">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="bk-mono mb-2 block text-bk-dim">name</span>
          <input name="name" required autoComplete="name" className="bk-input" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="bk-mono mb-2 block text-bk-dim">email</span>
          <input name="email" type="email" required autoComplete="email" className="bk-input" placeholder="you@company.com" />
        </label>
      </div>
      <label className="block">
        <span className="bk-mono mb-2 block text-bk-dim">message</span>
        <textarea
          name="project"
          required
          rows={5}
          className="bk-input resize-y"
          placeholder="What are you building, and where could I help?"
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="bk-btn bk-btn-primary disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Send message"} <span aria-hidden="true">→</span>
        </button>
        <p id="contact-status" role="status" aria-live="polite" className="bk-mono">
          {state === "sent" && <span className="text-bk-accent-ink">200 OK — message delivered, I'll reply soon.</span>}
          {state === "error" && <span className="text-bk-warn">500 — couldn't send. Please email me directly.</span>}
        </p>
      </div>
    </form>
  );
}
