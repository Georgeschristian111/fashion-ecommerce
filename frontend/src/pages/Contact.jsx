import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { contactApi } from "../api/contact";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      await contactApi.submitMessage(formData);
      setStatus({ type: "success", message: "Votre message a bien été envoyé !" });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Contact Us</span>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            We&apos;d Love to Hear From You
          </h1>
          <p className="mt-4 text-gray-500">
            Whether you have a question about an order, need help finding the perfect outfit,
            or simply want to say hello, our team is always ready to assist you.
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <MapPin size={20} className="mt-0.5 shrink-0 text-gray-400" />
              <div>
                <h3 className="font-bold text-gray-900">Our Store</h3>
                <p className="text-sm text-gray-500">123 Fashion Avenue, New York, NY 10001</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail size={20} className="mt-0.5 shrink-0 text-gray-400" />
              <div>
                <h3 className="font-bold text-gray-900">Email</h3>
                <p className="text-sm text-gray-500">support@fashion.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone size={20} className="mt-0.5 shrink-0 text-gray-400" />
              <div>
                <h3 className="font-bold text-gray-900">Phone</h3>
                <p className="text-sm text-gray-500">+1 (234) 567-890</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-100 p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field mt-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field mt-2"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="input-field mt-2 resize-none"
            />
          </div>

          {status && (
            <p className={`text-sm font-medium ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {status.message}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Envoi..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
