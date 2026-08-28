import LegalPage from "../components/ui/LegalPage";

export default function Cookies() {
  return (
    <LegalPage title="Cookies Policy" updatedAt="August 2026">
      <h2>What We Use Cookies For</h2>
      <p>
        Fashion. uses a single essential cookie to keep you securely signed in while you shop.
        This cookie is <strong>httpOnly</strong>, meaning it cannot be accessed by JavaScript,
        which helps protect your account from cross-site scripting attacks.
      </p>

      <h2>Third-Party Cookies</h2>
      <p>
        Our payment provider, Stripe, may set its own cookies during checkout to process your
        payment securely. We don&apos;t control these directly — see Stripe&apos;s own privacy
        policy for details.
      </p>

      <h2>Managing Cookies</h2>
      <p>
        You can clear cookies at any time through your browser settings. Note that doing so
        will sign you out of your account.
      </p>
    </LegalPage>
  );
}
