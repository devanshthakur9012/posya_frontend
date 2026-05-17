"use client";

import React, { useState } from "react";
import { ChevronDown, Package, Clock, Truck, MapPin, PackageX } from "lucide-react";

const shippingSections = [
  {
    icon: <Package size={18} />,
    title: "Shipping",
    content:
      "Complimentary shipping is extended during select promotions and special offerings, as communicated from time to time.",
  },
  {
    icon: <MapPin size={18} />,
    title: "Order Details",
    content:
      "We request you to kindly provide a complete and accurate shipping address, including pin code, email ID, and contact number, to ensure a seamless delivery experience.",
  },
  {
    icon: <Clock size={18} />,
    title: "Dispatch",
    content:
      "Should there be any delay, our team will keep you informed.",
    list: [
      "Ready products are dispatched within 2–3 working days",
      "In case of limited availability, products are freshly prepared and dispatched within 7–10 working days",
    ],
  },
  {
    icon: <Truck size={18} />,
    title: "Delivery",
    content:
      "Deliveries are made between Monday to Saturday, 9 AM – 7 PM, excluding Sundays and public holidays. While we partner with reliable courier services, delivery timelines may occasionally be affected by factors beyond our control.",
  },
  {
    icon: <MapPin size={18} />,
    title: "Tracking",
    content:
      "Once your order is on its way, tracking details will be shared via email for your convenience.",
  },
  {
    icon: <PackageX size={18} />,
    title: "Assistance",
    content:
      "For any queries or support, please write to us at posyaorganics@gmail.com — we'll be happy to assist you.",
    hasEmail: true,
  },
];

export default function ShippingPolicyPage() {
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
            Shipping &amp; Delivery
          </h1>
          <p className="text-base md:text-lg text-white/80">
            Every Posya order reaches you promptly and in pristine condition.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#2b1a06", fontFamily: "'Libre Baskerville', serif" }}>
            How We Ship Your Order
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#7a6a58" }}>
            At POSYA, each product is thoughtfully crafted and carefully handled to ensure it reaches you in its purest form.
          </p>
        </div>

        {/* Accordion */}
        <div className="faq-list">
          {shippingSections.map((sec, i) => (
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
          <p className="faq-cta-text">Need help with your order?</p>
          <p className="faq-cta-sub">
            Mon – Sat &nbsp;|&nbsp; 9 AM – 7 PM IST
          </p>
          <a href="mailto:posyaorganics@gmail.com" className="faq-cta-btn">
            posyaorganics@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}