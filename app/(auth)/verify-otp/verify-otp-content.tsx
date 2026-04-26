"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { KeyRound, Mail, Phone } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;

export default function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const identifier = searchParams.get("identifier") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: any) => {
    e.preventDefault();
    if (otp.length !== 4) return toast.error("Please enter a 4-digit OTP");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        const role = data.user.role.toLowerCase();
        if (role === "admin" || role === "shop_manager") {
          router.push(`${DOMAIN_URL}admin`);
        } else {
          router.push("/dashboard");
        }
        toast.success("OTP verified! Logged in successfully.");
      } else {
        toast.success("OTP verified successfully! Please login.");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
      toast.success("OTP resent successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <p className="auth-brand-name">POSYA</p>
          <p className="auth-brand-tag">Petal-born wellness</p>
        </div>

        <h1 className="auth-form-heading">Verify OTP</h1>
        <p className="auth-form-sub">
          Enter the 4-digit OTP sent to your{" "}
          <span className="font-semibold">{identifier}</span>
        </p>

        <form onSubmit={handleVerify} className="auth-form">

          {/* Identifier display */}
          <div className="auth-field">
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                {identifier.includes("@") ? <Mail size={16} /> : <Phone size={16} />}
              </span>
              <input
                type="text"
                value={identifier}
                readOnly
                className="auth-input opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          {/* OTP input */}
          <div className="auth-field">
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><KeyRound size={16} /></span>
              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="auth-input"
                autoComplete="one-time-code"
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Verifying...
              </span>
            ) : "Verify OTP"}
          </button>
        </form>

        {/* Resend */}
        <button
          className="auth-toggle-btn"
          onClick={handleResend}
          disabled={loading}
        >
          Didn't receive OTP? Resend →
        </button>

        {/* Back to login */}
        <p className="auth-footer-text">
          Remember your password?{" "}
          <a href="/login" className="auth-footer-link">Back to Login</a>
        </p>

      </div>
    </div>
  );
}