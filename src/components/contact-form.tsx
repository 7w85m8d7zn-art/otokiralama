"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitContactAction } from "@/actions/contact";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="button-primary w-full" disabled={pending}>
      {pending ? "Gönderiliyor..." : "Mesajı Gönder"}
    </button>
  );
}

const initialState = { success: false, message: "" };

export function ContactForm() {
  const [state, action] = useFormState(submitContactAction, initialState);

  return (
    <form action={action} className="card space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Bize Ulaşın</h2>
      <p className="text-sm text-slate-600">Bilgilerinizi eksiksiz girin, size hızlıca dönüş yapalım.</p>

      <input className="input" name="name" placeholder="Ad soyad" required minLength={2} />
      <input className="input" name="email" type="email" placeholder="E-posta" required />
      <input className="input" name="phone" placeholder="Telefon" />
      <textarea className="input min-h-32" name="message" placeholder="Mesajınız" required minLength={10} />

      {state.message && (
        <p className={`text-sm ${state.success ? "text-emerald-700" : "text-amber-800"}`}>{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}
