import { Suspense } from "react";
import VerifyOtpContent from "./verify-otp-content";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <p className="auth-brand-name">POSYA</p>
            <p className="auth-brand-tag">Petal-born wellness</p>
          </div>
          <div className="flex flex-col items-center gap-3 py-6">
            <svg className="animate-spin h-8 w-8 text-current opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="auth-form-sub">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}