import { useEffect, useRef } from "react";

// Documentation officielle : https://developers.google.com/identity/gsi/web/guides/display-button
export default function GoogleButton({ onCredential }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    // Le script est chargé globalement dans index.html ; on attend qu'il soit disponible.
    if (!window.google?.accounts?.id || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => onCredential(response.credential),
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: buttonRef.current.offsetWidth,
      text: "continue_with",
    });
  }, [onCredential]);

  return <div ref={buttonRef} className="w-full" />;
}
