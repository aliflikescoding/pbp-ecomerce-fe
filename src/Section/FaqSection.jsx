import React from "react";

const FaqSection = () => {
  const faqData = [
    {
      id: 1,
      question: "How do I create an account?",
      answer:
        "Click the 'Sign Up' button in the top right corner and follow the registration process. You'll need to provide your email address, create a secure password, and verify your email before accessing your account.",
    },
    {
      id: 2,
      question: "I forgot my password. What should I do?",
      answer:
        "Click on 'Forgot Password' on the login page and follow the instructions sent to your email. You'll receive a password reset link that expires in 24 hours for security purposes.",
    },
    {
      id: 3,
      question: "How do I update my profile information?",
      answer:
        "Go to 'My Account' settings and select 'Edit Profile' to make changes. You can update your personal information, contact details, and notification preferences from there.",
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All transactions are secured with SSL encryption for your safety.",
    },
    {
      id: 5,
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. International orders may take 7-14 business days depending on your location and customs processing.",
    },
    {
      id: 6,
      question: "Can I cancel or modify my order?",
      answer:
        "You can cancel or modify your order within 1 hour of placement. After that, please contact our customer service team who will do their best to accommodate your request if the order hasn't been shipped yet.",
    },
    {
      id: 7,
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for all products. Items must be returned in their original condition with all packaging and tags intact to qualify for a full refund.",
    },
    {
      id: 8,
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also log into your account and check the order status in the 'My Orders' section for real-time updates.",
    },
    {
      id: 9,
      question: "Is my personal information secure?",
      answer:
        "Absolutely. We use industry-standard encryption and security measures to protect your personal and payment information. We never share your data with third parties without your consent.",
    },
    {
      id: 10,
      question: "How do I contact customer support?",
      answer:
        "You can reach our customer support team via email at support@example.com, phone at 1-800-123-4567 (Mon-Fri, 9AM-6PM EST), or through the live chat feature on our website.",
    },
  ];

  return (
    <section className="custom-container pb-12">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] px-8 py-12 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.9)]">
        <div className="text-center text-neutral-content mb-10">
          <div className="inline-block mb-6">
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4 mx-auto"></div>
            <span className="text-xs font-light tracking-[0.3em] text-amber-200 uppercase">
              Need Assistance?
            </span>
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-4 mx-auto"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-light font-playfair">
            Frequently Asked Questions
          </h1>
        </div>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={faq.id}
              className="collapse collapse-arrow bg-white/5 border border-white/10 text-neutral-content backdrop-blur-md rounded-2xl transition-all duration-500 hover:border-amber-300/50 hover:bg-white/10"
            >
              <input
                type="radio"
                name="faq-accordion"
                defaultChecked={index === 0}
              />
              <div className="collapse-title font-light text-lg tracking-wide">
                {faq.question}
              </div>
              <div className="collapse-content text-sm text-neutral-content/70 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
