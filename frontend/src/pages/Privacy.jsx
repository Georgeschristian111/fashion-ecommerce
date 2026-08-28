import LegalPage from "../components/ui/LegalPage";

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="August 2026">
      <h2>Information We Collect</h2>
      <p>
        When you create an account, we collect your name, email address, and shipping
        information. When you place an order, payment details are processed securely by
        Stripe — we never store your card information on our servers.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        We use your information to process orders, send order confirmations, manage your
        account, and respond to messages sent through our Contact page. We do not sell your
        personal data to third parties.
      </p>

      <h2>Cookies</h2>
      <p>
        We use a small number of essential cookies to keep you signed in securely. See our{" "}
        <a href="/cookies" className="text-brand underline">
          Cookies Policy
        </a>{" "}
        for details.
      </p>

      <h2>Your Rights</h2>
      <p>
        You can review or update your account information at any time from My Account, or
        contact us to request that your data be deleted.
      </p>

      <h2>Contact</h2>
      <p>Questions about this policy can be sent to support@fashion.com.</p>
    </LegalPage>
  );
}
