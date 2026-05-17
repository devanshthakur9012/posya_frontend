"use client";

import React, { useState } from "react";
import { ChevronDown, PackageX, Package, AlertTriangle } from "lucide-react";

const sections = [
  {
    icon: <PackageX size={18} />,
    title: "Damaged Product",
    content:
      "If your order arrives damaged, we will gladly arrange a replacement. Please notify us within 48 hours of delivery at posyaorganics@gmail.com. Once verified, we will initiate a replacement within 7–10 working days. For orders containing multiple items, only the affected product will be eligible for replacement.",
    hasEmail: true,
    list: [
      "Order number",
      "Image of the invoice",
      "One image of the outer packaging",
      "Two clear images of the damaged product",
      "An unboxing video clearly showing the damage",
    ],
    listLabel: "Kindly include:",
  },
  {
    icon: <Package size={18} />,
    title: "Missing Product",
    content:
      "If an item is missing from your order, please inform us within 48 hours of delivery at posyaorganics@gmail.com. While refunds are not applicable, we will promptly dispatch the missing product after verification.",
    hasEmail: true,
    list: [
      "Order number",
      "Image of the invoice",
      "One image of the outer packaging",
      "Two clear images of the opened package",
      "An unboxing video showing all received items",
    ],
    listLabel: "Kindly share:",
  },
  {
    icon: <AlertTriangle size={18} />,
    title: "Spoiled or Defective Product",
    content:
      "In the rare case of a product being spoiled or defective, notify us within 48 hours of delivery at posyaorganics@gmail.com. Since our products are 100% natural and handcrafted, slight variations in taste, texture, colour, or aroma are normal and not considered defects. Eligible cases will be resolved after review.",
    hasEmail: true,
    list: [
      "Order number",
      "Date of packaging/manufacture",
      "Clear images or a video highlighting the concern",
    ],
    listLabel: "Please include:",
  },
];

export default function RefundPolicyPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="min-h-screen" style={{ background: "#f2eee9" }}>

      {/* Hero */}
      <section
        className="relative w-full bg-cover bg-center bg-no-repeat text-white py-24"
        style={{ backgroundImage: "url('/images/naturalBgImage.webp')" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(43,26,6,0.72)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#cb8836" }}>
            Legal
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Refund &amp; Replacement
          </h1>
          <p className="text-base md:text-lg text-white/80">
            We stand behind every product we send your way.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#2b1a06", fontFamily: "'Libre Baskerville', serif" }}>
            Our Refund &amp; Replacement Policy
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#7a6a58" }}>
            At POSYA, every product is thoughtfully crafted using natural, Himalayan-sourced ingredients.
            Due to the nature of our offerings, once an order is confirmed, we do not accept returns or offer refunds.
            However, your experience matters deeply to us — in the situations below, we are committed to working with
            you to ensure a fair and satisfactory resolution.
          </p>
        </div>

        {/* Accordion */}
        <div className="faq-list">
          {sections.map((sec, i) => (
            <div
              key={i}
              className="faq-item"
              style={{ borderColor: openIndex === i ? "#cb8836" : "rgba(203,136,54,0.2)" }}
            >
              <button className="faq-question" onClick={() => toggle(i)}>
                <span className="flex items-center gap-3">
                  <span className="pp-icon">{sec.icon}</span>
                  {sec.title}
                </span>
                <ChevronDown
                  size={20}
                  className="faq-chevron"
                  style={{
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                    color: "#cb8836",
                  }}
                />
              </button>

              {openIndex === i && (
                <div className="faq-answer">
                  {sec.listLabel && (
                    <p className="mb-2" style={{ color: "#6b5a42", fontWeight: 500 }}>{sec.listLabel}</p>
                  )}
                  {sec.list && (
                    <ul className="pp-list mb-3">
                      {sec.list.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {sec.content && (
                    <p>
                      {sec.hasEmail
                        ? (() => {
                            const parts = sec.content.split("posyaorganics@gmail.com");
                            return (
                              <>
                                {parts[0]}
                                <a href="mailto:posyaorganics@gmail.com" className="faq-link">
                                  posyaorganics@gmail.com
                                </a>
                                {parts[1] || ""}
                              </>
                            );
                          })()
                        : sec.content}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="faq-cta">
          <p className="faq-cta-text">Need help with a replacement?</p>
          <p className="faq-cta-sub">
            Email us within 48 hours of delivery and we'll sort it out.
          </p>
          <a href="mailto:posyaorganics@gmail.com" className="faq-cta-btn">
            posyaorganics@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}