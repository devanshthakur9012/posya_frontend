"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order_number");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { label: "Order Confirmed", done: true },
    { label: "Packing", done: false },
    { label: "Shipped", done: false },
    { label: "Delivered", done: false },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: "rgb(255 243 211)" }}
    >
      {/* Background blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -80, right: -80, width: 360, height: 360,
          borderRadius: "50%",
          background: "rgba(203,136,54,0.10)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -80, left: -80, width: 300, height: 300,
          borderRadius: "50%",
          background: "rgba(203,136,54,0.07)",
          filter: "blur(60px)",
        }}
      />

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(28)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                width: 6 + Math.random() * 6,
                height: 6 + Math.random() * 6,
                backgroundColor: ["#cb8836","#f0dca0","#a06a20","#e8c97e","#faf7f2"][Math.floor(Math.random() * 5)],
                left: `${Math.random() * 100}%`,
                top: "-10px",
              }}
              animate={{ y: "110vh", opacity: [1, 0.7, 0], rotate: Math.random() * 360 }}
              transition={{
                duration: 3 + Math.random() * 2.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full text-center"
        style={{
          maxWidth: 440,
          background: "#fff",
          borderRadius: 24,
          padding: "44px 40px 40px",
          border: "1px solid rgba(203,136,54,0.2)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
        }}
      >
        {/* Brand */}
        <p style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 14, fontWeight: 700,
          letterSpacing: 5, color: "#2b1a06", marginBottom: 2,
        }}>
          POSYA
        </p>
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", color: "#cb8836", marginBottom: 28,
        }}>
          Petal-born wellness
        </p>

        {/* Check icon */}
        <motion.div
          className="flex items-center justify-center"
          style={{ marginBottom: 22 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "#2b1a06",
            border: "4px solid rgba(203,136,54,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <motion.path
                d="M10 21L17 28L30 13"
                stroke="#cb8836"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={80}
                strokeDashoffset={80}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 22, fontWeight: 700,
            color: "#2b1a06", marginBottom: 12,
          }}
        >
          Order Placed!
        </motion.h1>

        {/* Order ID pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#faf7f2",
            border: "1.5px solid rgba(203,136,54,0.25)",
            borderRadius: 10, padding: "8px 18px", marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "#a89070" }}>
            Order ID
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#2b1a06", fontFamily: "monospace" }}>
            #{orderNumber || "N/A"}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          style={{ fontSize: 14, color: "#7a6a58", lineHeight: 1.65, marginBottom: 24 }}
        >
          Thank you for choosing Posya! We'll send you a<br />
          confirmation once your order is shipped.
        </motion.p>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(203,136,54,0.15)", marginBottom: 22 }} />

        {/* Order tracker steps */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 26 }}
        >
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "initial" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: step.done ? "#2b1a06" : "rgba(203,136,54,0.1)",
                  border: step.done ? "none" : "1.5px solid rgba(203,136,54,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {step.done ? (
                    <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                      <path d="M3 8.5l3.5 3.5 6.5-7" stroke="#cb8836" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#cb8836", opacity: 0.5 }} />
                  )}
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.5px",
                  textTransform: "uppercase", color: "#a89070",
                  textAlign: "center", lineHeight: 1.3, maxWidth: 56,
                }}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 2,
                  background: "rgba(203,136,54,0.2)",
                  marginBottom: 18,
                  marginLeft: 4, marginRight: 4,
                }} />
              )}
            </div>
          ))}
        </motion.div> */}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35 }}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          {/* <Link
            href={`/dashboard?tab=orders`}
            style={{
              display: "block", padding: "14px 0",
              background: "#2b1a06", color: "#f2eee9",
              fontFamily: "'Libre Baskerville', serif",
              fontSize: 14, fontWeight: 700,
              borderRadius: 50, textDecoration: "none",
              letterSpacing: "0.5px", transition: "background .2s",
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#cb8836")}
            onMouseOut={e => (e.currentTarget.style.background = "#2b1a06")}
          >
            Track My Order
          </Link> */}

          <Link
            href="/shop"
            style={{
              display: "block", padding: "12px 0",
              background: "transparent", color: "#cb8836",
              fontSize: 13, fontWeight: 700,
              border: "1.5px solid rgba(203,136,54,0.35)",
              borderRadius: 50, textDecoration: "none",
              letterSpacing: "0.5px", transition: "all .2s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "rgba(203,136,54,0.08)";
              e.currentTarget.style.borderColor = "#cb8836";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(203,136,54,0.35)";
            }}
          >
            Continue Shopping
          </Link>
        </motion.div>

        {/* Trust badges */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 18,
          marginTop: 22, paddingTop: 16,
          borderTop: "1px solid rgba(203,136,54,0.12)",
          flexWrap: "wrap",
        }}>
          {["100% Authentic", "Fast Dispatch", "Secure Payment"].map((t) => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#a89070", fontWeight: 600 }}>
              <span style={{ color: "#cb8836" }}>✓</span> {t}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}