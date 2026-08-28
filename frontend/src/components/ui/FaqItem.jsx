import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 py-5">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <p className="mt-3 text-sm text-gray-500">{answer}</p>}
    </div>
  );
}
