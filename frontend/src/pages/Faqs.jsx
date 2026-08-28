import FaqItem from "../components/ui/FaqItem";

const FAQS = [
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 3–5 business days. Orders over $100 qualify for free shipping, as shown at checkout.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return window from the delivery date. Items must be unworn and in their original condition.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "All payments are processed securely through Stripe. We accept major credit and debit cards.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once you're signed in, go to My Account to see your order history and the current status of each order.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We currently ship within the countries listed at checkout. Reach out via our Contact page if you have a specific destination in mind.",
  },
];

export default function Faqs() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-gray-500">
          Everything you need to know about shopping with Fashion.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        {FAQS.map((faq) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}
