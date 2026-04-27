"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, Lock, KeyRound, Eye, EyeOff, User, X } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginRegisterModal({
  isOpen,
  onClose,
  onSuccess,
}: LoginRegisterModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginType, setLoginType] = useState<"password" | "otp">("password");
  const [form, setForm] = useState({
    name: "",
    phoneOrEmail: "",
    password: "",
    password_confirmation: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  // ── Handlers ───────────────────────────────────────────

  const handlePasswordLogin = async () => {
    if (!form.phoneOrEmail || !form.password) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: form.phoneOrEmail, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (!data.token) throw new Error("Token not received from server");
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendLoginOTP = async () => {
    if (!form.phoneOrEmail) return toast.error("Please enter email or phone");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ identifier: form.phoneOrEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cannot send OTP");
      setOtpStep(true);
      toast.success("OTP sent! Check your email / phone.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOTP = async () => {
    if (!form.otp || form.otp.length !== 4) return toast.error("Please enter valid 4-digit OTP");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ identifier: form.phoneOrEmail, otp: form.otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      if (!data.token) throw new Error("Token not received");
      localStorage.setItem("token", data.token);
      toast.success("OTP verified! Login successful.");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!form.name || !form.phoneOrEmail || !form.password)
      return toast.error("Please fill all fields");
    if (form.password !== form.password_confirmation)
      return toast.error("Passwords don't match");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          phoneOrEmail: form.phoneOrEmail,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: "customer",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setOtpSent(true);
      toast.success(`OTP sent to ${form.phoneOrEmail}`);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegisterOTP = async () => {
    if (!form.otp || form.otp.length !== 4) return toast.error("Please enter valid 4-digit OTP");
    setLoading(true);
    try {
      const verifyRes = await fetch(`${BASE_URL}verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ identifier: form.phoneOrEmail, otp: form.otp }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.message || "OTP verification failed");

      const loginRes = await fetch(`${BASE_URL}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: form.phoneOrEmail, password: form.password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok || !loginData.token) throw new Error("Auto-login failed after verification");

      localStorage.setItem("token", loginData.token);
      toast.success("Registration & Login successful!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Shared input style ──────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px 12px 42px",
    fontSize: 14,
    color: "#2b1a06",
    background: "#faf7f2",
    border: "1.5px solid rgba(203,136,54,0.22)",
    borderRadius: 10,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color .2s, box-shadow .2s, background .2s",
  };

  const IconWrap = ({ children }: { children: React.ReactNode }) => (
    <span style={{ position: "absolute", left: 14, color: "#cb8836", display: "flex", alignItems: "center", pointerEvents: "none",top:"16px" }}>
      {children}
    </span>
  );

  // ── OTP Screen ─────────────────────────────────────────
  if (otpSent || (loginType === "otp" && otpStep)) {
    const isRegister = otpSent;
    return (
      <div style={overlayStyle}>
        <div style={cardStyle}>
          {/* Close */}
          <button onClick={onClose} style={closeBtnStyle}>
            <X size={13} />
          </button>

          {/* Brand header */}
          <div style={headerStyle}>
            <p style={brandNameStyle}>POSYA</p>
            <span style={brandTagStyle}>Petal-born wellness</span>
          </div>

          {/* OTP body */}
          <div style={{ padding: "36px 36px 40px", textAlign: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(203,136,54,0.1)",
              border: "2px solid rgba(203,136,54,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
            }}>
              <KeyRound size={26} color="#cb8836" />
            </div>

            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontWeight: 700, color: "#2b1a06", marginBottom: 8 }}>
              Verify OTP
            </h3>
            <p style={{ fontSize: 13, color: "#a89070", lineHeight: 1.6, marginBottom: 24 }}>
              Enter the 4-digit OTP sent to<br />
              <strong style={{ color: "#2b1a06" }}>{form.phoneOrEmail}</strong>
            </p>

            <div style={{ position: "relative", marginBottom: 20 }}>
              <input
                type="text"
                placeholder="· · · ·"
                maxLength={4}
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
                style={{
                  ...inputStyle,
                  paddingLeft: 14,
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: 12,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#cb8836";
                  e.target.style.boxShadow = "0 0 0 3px rgba(203,136,54,0.1)";
                  e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(203,136,54,0.22)";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "#faf7f2";
                }}
              />
            </div>

            <button
              onClick={isRegister ? handleVerifyRegisterOTP : handleVerifyLoginOTP}
              disabled={loading || form.otp.length !== 4}
              style={submitBtnStyle(loading || form.otp.length !== 4)}
            >
              {loading ? <span><span style={spinnerStyle} />Verifying...</span> : "Verify & Continue"}
            </button>

            <button
              onClick={() => { setOtpSent(false); setOtpStep(false); setForm({ ...form, otp: "" }); }}
              style={{ fontSize: 12, fontWeight: 700, color: "#a89070", background: "none", border: "none", cursor: "pointer", marginTop: 12, display: "block", width: "100%" }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Modal ─────────────────────────────────────────
  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        {/* Close */}
        <button onClick={onClose} style={closeBtnStyle}>
          <X size={13} />
        </button>

        {/* Brand header + tabs */}
        <div style={headerStyle}>
          <p style={brandNameStyle}>POSYA</p>
          <span style={brandTagStyle}>Petal-born wellness</span>

          {/* Tabs */}
          <div style={{ display: "flex" }}>
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setLoginType("password"); setOtpStep(false); setForm({ ...form, otp: "" }); }}
                style={{
                  flex: 1, padding: "10px 0",
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: 13, fontWeight: 700,
                  background: "transparent", border: "none",
                  borderBottom: tab === t ? "2px solid #cb8836" : "2px solid transparent",
                  color: tab === t ? "#cb8836" : "#a89070",
                  cursor: "pointer", letterSpacing: "0.5px",
                  transition: "all .2s",
                }}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px 32px" }}>

          {/* ── LOGIN ── */}
          {tab === "login" && (
            <>
              <p style={{ fontSize: 12, color: "#a89070", textAlign: "center", marginBottom: 18 }}>
                {loginType === "otp" && !otpStep
                  ? "We'll send a code to your email / phone"
                  : "Sign in to your Posya account"}
              </p>

              {/* Identifier */}
              <div style={{ position: "relative", marginBottom: 14 }}>
                <IconWrap>
                  {form.phoneOrEmail.includes("@") ? <Mail size={15} /> : <Phone size={15} />}
                </IconWrap>
                <input
                  type="text"
                  placeholder="Email or Phone number"
                  value={form.phoneOrEmail}
                  onChange={(e) => setForm({ ...form, phoneOrEmail: e.target.value })}
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              {loginType === "password" && (
                <div style={{ position: "relative", marginBottom: 14 }}>
                  <IconWrap><Lock size={15} /></IconWrap>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: 42 }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a89070", display: "flex" }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              )}

              <button
                onClick={loginType === "password" ? handlePasswordLogin : handleSendLoginOTP}
                disabled={loading}
                style={submitBtnStyle(loading)}
              >
                {loading
                  ? <><span style={spinnerStyle} />Processing...</>
                  : loginType === "password" ? "Sign In" : "Send OTP"}
              </button>

              <button
                onClick={() => { setLoginType(loginType === "password" ? "otp" : "password"); setOtpStep(false); setForm({ ...form, otp: "", password: "" }); }}
                style={{ display: "block", width: "100%", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#cb8836", background: "none", border: "none", cursor: "pointer", marginTop: 12, transition: "color .2s" }}
              >
                {loginType === "password" ? "Login with OTP instead →" : "← Login with Password instead"}
              </button>
            </>
          )}

          {/* ── REGISTER ── */}
          {tab === "register" && (
            <>
              {/* Name */}
              <div style={{ position: "relative", marginBottom: 14 }}>
                <IconWrap><User size={15} /></IconWrap>
                <input type="text" placeholder="Full Name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>

              {/* Identifier */}
              <div style={{ position: "relative", marginBottom: 14 }}>
                <IconWrap>
                  {form.phoneOrEmail.includes("@") ? <Mail size={15} /> : <Phone size={15} />}
                </IconWrap>
                <input type="text" placeholder="Email or Phone" value={form.phoneOrEmail}
                  onChange={(e) => setForm({ ...form, phoneOrEmail: e.target.value })}
                  style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>

              {/* Password */}
              <div style={{ position: "relative", marginBottom: 14 }}>
                <IconWrap><Lock size={15} /></IconWrap>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ ...inputStyle, paddingRight: 42 }}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a89070", display: "flex" }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div style={{ position: "relative", marginBottom: 20 }}>
                <IconWrap><Lock size={15} /></IconWrap>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  style={{ ...inputStyle, paddingRight: 42 }}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a89070", display: "flex" }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button onClick={handleRegister} disabled={loading} style={submitBtnStyle(loading)}>
                {loading ? <><span style={spinnerStyle} />Please wait...</> : "Create Account & Send OTP"}
              </button>

              {/* Trust badges */}
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(203,136,54,0.12)", flexWrap: "wrap" }}>
                {["100% Secure", "No Spam", "Petal-born Wellness"].map((t) => (
                  <span key={t} style={{ fontSize: 10, color: "#a89070", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: "#cb8836" }}>✓</span> {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0,
  background: "rgba(43,26,6,0.6)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 50, padding: 16,
  backdropFilter: "blur(4px)",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 24,
  width: "100%",
  maxWidth: 420,
  position: "relative",
  border: "1px solid rgba(203,136,54,0.2)",
  boxShadow: "0 24px 60px rgba(43,26,6,0.35)",
  overflow: "hidden",
};

const headerStyle: React.CSSProperties = {
  background: "#2b1a06",
  padding: "28px 32px 0",
  textAlign: "center",
};

const brandNameStyle: React.CSSProperties = {
  fontFamily: "'Libre Baskerville', serif",
  fontSize: 15, fontWeight: 700,
  letterSpacing: 5, color: "#f2eee9", marginBottom: 2,
};

const brandTagStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 700,
  letterSpacing: 2, textTransform: "uppercase",
  color: "#cb8836", display: "block", marginBottom: 18,
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute", top: 14, right: 16,
  width: 30, height: 30, borderRadius: "50%",
  background: "rgba(203,136,54,0.12)",
  border: "1.5px solid rgba(203,136,54,0.25)",
  color: "#cb8836", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 10, transition: "all .2s",
};

const submitBtnStyle = (disabled: boolean): React.CSSProperties => ({
  width: "100%", padding: "13px 0",
  background: disabled ? "rgba(43,26,6,0.5)" : "#2b1a06",
  color: "#f2eee9",
  fontFamily: "'Libre Baskerville', serif",
  fontSize: 14, fontWeight: 700,
  border: "none", borderRadius: 50,
  cursor: disabled ? "not-allowed" : "pointer",
  letterSpacing: "0.5px",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  transition: "background .25s, transform .2s, box-shadow .2s",
});

const spinnerStyle: React.CSSProperties = {
  display: "inline-block", width: 14, height: 14,
  border: "2px solid rgba(242,238,233,0.3)",
  borderTopColor: "#f2eee9", borderRadius: "50%",
  animation: "spin .7s linear infinite",
};

const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "#cb8836";
  e.target.style.boxShadow = "0 0 0 3px rgba(203,136,54,0.1)";
  e.target.style.background = "#fff";
};

const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "rgba(203,136,54,0.22)";
  e.target.style.boxShadow = "none";
  e.target.style.background = "#faf7f2";
};