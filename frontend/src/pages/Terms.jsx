import LegalPage from "../components/ui/LegalPage";

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updatedAt="August 2026">
      <h2>Orders and Payment</h2>
      <p>
        By placing an order, you confirm that the shipping and payment information provided is
        accurate. All prices are displayed in USD and include applicable taxes at checkout.
        Payments are processed securely through Stripe.
      </p>

      <h2>Shipping</h2>
      <p>
        Orders over $100 qualify for free shipping. Estimated delivery times are provided at
        checkout and may vary depending on your location.
      </p>

      <h2>Returns</h2>
      <p>
        Items can be returned within 7 days of delivery, provided they are unworn and in their
        original condition. See our Contact page to start a return.
      </p>

      <h2>Account Responsibility</h2>
      <p>
        You are responsible for keeping your account credentials secure. Notify us immediately
        if you suspect unauthorized access to your account.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after changes
        constitutes acceptance of the updated terms.
      </p>
    </LegalPage>
  );
}
