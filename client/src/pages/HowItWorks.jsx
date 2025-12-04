import { useState, useEffect } from "react";
import {
  ChevronDown,
  CheckCircle2,
  Truck,
  ShoppingBag,
  ClipboardList,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetch("/data/faq.json")
      .then((res) => res.json())
      .then(setFaqs)
      .catch((err) => console.error("Error loading FAQ:", err));
  }, []);

  const steps = [
    {
      icon: ClipboardList,
      title: "Submit Your Request",
      desc: "Start by filling out the quotation form with your business or individual needs.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: MessageCircle,
      title: "Get Matched",
      desc: "Our team reviews your request and matches you with the best product options available.",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: ShoppingBag,
      title: "Confirm & Pay",
      desc: "Once you approve your quotation, confirm your order and complete payment securely.",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: Truck,
      title: "Delivery & Support",
      desc: "Your order is processed and delivered according to your preferred schedule — with dedicated support all the way.",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const benefits = [
    "100% Verified Products",
    "Dedicated Relationship Managers",
    "Flexible Payment Terms",
    "Nationwide Delivery Network",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              Simple & Transparent Process
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">How It Works</h1>
          <p className="text-xl text-green-50 max-w-2xl mx-auto leading-relaxed">
            From quotation to delivery — our process is designed to be simple,
            transparent, and reliable. Join thousands of satisfied customers.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Our Simple Process
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Four easy steps to get the products you need, when you need them
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-3 w-6 h-0.5 bg-gradient-to-r from-green-300 to-green-400 dark:from-green-600 dark:to-green-700">
                    <ArrowRight className="absolute -right-1 -top-2 w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                )}

                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>

                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Why Choose Viridian?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Our customers trust us because we combine reliable supply,
              high-quality produce, and seamless service — all built around
              transparency and partnership.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((text, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-green-100 dark:border-green-900/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                    {text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Find answers to common questions about our process
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                openIndex === i
                  ? "border-green-500 dark:border-green-600"
                  : "border-transparent"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex justify-between items-center w-full text-left p-6 group"
              >
                <span className="font-semibold text-lg text-gray-800 dark:text-gray-200 pr-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {item.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-all duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </button>

              {openIndex === i && (
                <div className="px-6 pb-6 pt-2 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-green-100 dark:border-green-900/30">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto">
            Submit your first quotation request today and experience the
            Viridian difference
          </p>
          <Link
            to="/partnership"
            className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            Get Satrted Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
