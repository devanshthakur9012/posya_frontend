'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  UserCircle, Box, Settings, XCircle, RefreshCw,
  PackageX, LogOut, Menu, X, FileText, Truck,
  ShoppingBag, AlertCircle
} from "lucide-react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User { name: string; email: string; phone: string; }
interface OrderItem { product_name: string; quantity: number; }
interface Order {
  id: number; order_number: string; date: string;
  items: OrderItem[]; total: number;
  payment_status: string; status: string;
}
interface ReturnRequest {
  id: number; order_id: number; type: string;
  reason: string; status: string; created_at: string;
  order: { order_number: string; total_amount: number; };
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedOrder, setSelectedOrder] = useState("");
  const [reason, setReason] = useState("");
  const [userRequests, setUserRequests] = useState<ReturnRequest[]>([]);
  const [requestType, setRequestType] = useState("return");
  const [mobOpen, setMobOpen] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) { toast.error("Please login first!"); router.push("/login"); return; }
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}profile`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) { localStorage.removeItem("token"); router.push("/login"); return; }
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data.user);
        setNewEmail(data.user.email || "");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "An error occurred");
        router.push("/login");
      } finally { setLoading(false); }
    })();
  }, [router, token]);

  useEffect(() => {
    if (activeTab !== "orders" && activeTab !== "returns") return;
    (async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch(`${BASE_URL}orders`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) { localStorage.removeItem("token"); router.push("/login"); return; }
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "An error occurred");
      } finally { setLoadingOrders(false); }
    })();
  }, [activeTab, token, router]);

  const fetchUserRequests = async () => {
    try {
      const res = await fetch(`${BASE_URL}returns`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setUserRequests(data.returns);
    } catch (err) { console.log("Failed to fetch requests", err); }
  };

  useEffect(() => { if (activeTab === "returns") fetchUserRequests(); }, [activeTab]);

  const validateSettings = () => {
    const newErrors: Record<string, string> = {};
    if (!user?.name.trim()) newErrors.name = "Full name is required";
    if (!user?.phone?.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10,15}$/.test(user.phone)) newErrors.phone = "Enter a valid phone number";
    if (!newEmail.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) newErrors.email = "Enter a valid email address";
    if (newPassword && newPassword.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateSettings = async () => {
    if (!validateSettings()) return;
    try {
      const res = await fetch(`${BASE_URL}settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: user?.name, email: newEmail, phone: user?.phone, password: newPassword, password_confirmation: newPassword }),
      });
      if (res.status === 401) { localStorage.removeItem("token"); router.push("/login"); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update settings");
      setUser(data.user);
      toast.success("Profile updated successfully!");
    } catch (err) { toast.error(err instanceof Error ? err.message : "An error occurred"); }
  };

  const handleSubmitRequest = async () => {
    if (!selectedOrder) { toast.error("Please select an order"); return; }
    if (!reason.trim()) { toast.error(`Please provide a reason for ${requestType}`); return; }
    try {
      const res = await fetch(`${BASE_URL}${requestType}-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ order_id: selectedOrder, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit request");
      toast.success(data.message || `${requestType} request submitted!`);
      setSelectedOrder(""); setReason("");
      fetchUserRequests();
      const ordersRes = await fetch(`${BASE_URL}orders`, { headers: { Authorization: `Bearer ${token}` } });
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders);
    } catch (err) { toast.error(err instanceof Error ? err.message : "An error occurred"); }
  };

  const getOrderActionButtons = (order: Order) => {
    const status = order.status.toLowerCase();
    const existingRequest = userRequests.find(req => req.order_id === order.id && ['pending', 'approved'].includes(req.status));
    if (existingRequest) return (
      <span className="dash-existing-req">{existingRequest.type} {existingRequest.status}</span>
    );
    if (['pending', 'processing'].includes(status)) return (
      <button onClick={() => { setSelectedOrder(order.id.toString()); setRequestType('cancel'); setActiveTab('returns'); }}
        className="dash-icon-btn dash-icon-btn--red" title="Cancel Order">
        <XCircle size={14} />
      </button>
    );
    if (['completed', 'delivered'].includes(status)) return (
      <button onClick={() => { setSelectedOrder(order.id.toString()); setRequestType('return'); setActiveTab('returns'); }}
        className="dash-icon-btn dash-icon-btn--blue" title="Return Order">
        <RefreshCw size={14} />
      </button>
    );
    return null;
  };

  const menuItems = [
    { label: "Profile", icon: UserCircle, tab: "profile" },
    { label: "My Orders", icon: Box, tab: "orders" },
    { label: "Settings", icon: Settings, tab: "settings" },
    { label: "Returns & Refunds", icon: PackageX, tab: "returns" },
  ];

  const SidebarContent = () => (
    <div className="dash-sidebar" style={{ position: 'relative', top: 'unset' }}>
      <div className="dash-sidebar-header">
        <div className="dash-sidebar-avatar">
          <UserCircle size={28} />
        </div>
        <p className="dash-sidebar-name">{user?.name}</p>
        <p className="dash-sidebar-email">{user?.email}</p>
      </div>
      <nav className="dash-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.tab} onClick={() => { setActiveTab(item.tab); setMobOpen(false); }}
              className={`dash-nav-btn ${activeTab === item.tab ? "dash-nav-btn--active" : ""}`}>
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="dash-logout-wrap">
        <button onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}
          className="dash-logout-btn">
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="dash-loading">
      <div className="dash-spinner" />
      Loading your dashboard...
    </div>
  );

  if (!user) return null;

  return (
    <div className="dash-page">
      <div className="dash-layout">

        {/* Desktop Sidebar */}
        <aside style={{ position: 'sticky', top: '90px' }} className="hidden lg:block">
          <SidebarContent />
        </aside>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button className="dash-mob-menu-btn" onClick={() => setMobOpen(true)}>
            <Menu size={16} /> My Account
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobOpen && (
          <div className="dash-mob-overlay" onClick={() => setMobOpen(false)}>
            <div className="dash-mob-sidebar" onClick={e => e.stopPropagation()}>
              <div style={{ padding: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setMobOpen(false)}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(203,136,54,0.15)', border: 'none', color: '#cb8836', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main content */}
        <main>
          <p className="dash-panel-heading" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            {menuItems.find(m => m.tab === activeTab)?.label}
          </p>

          {/* ── PROFILE ── */}
          {activeTab === "profile" && (
            <div className="dash-card">
              <span className="dash-card-section-label">Personal Information</span>
              <div className="dash-field">
                <label className="dash-input-label">Full Name</label>
                <input type="text" className="dash-input" value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Full Name" />
              </div>
              <div className="dash-field">
                <label className="dash-input-label">Phone Number</label>
                <input type="text" className="dash-input" value={user.phone || ""}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })} placeholder="Phone" />
              </div>
              <div className="dash-field">
                <label className="dash-input-label">Email Address</label>
                <input type="email" className="dash-input" value={user.email} disabled placeholder="Email" />
                <span style={{ fontSize: 11, color: '#a89070', marginTop: 4 }}>Email cannot be changed here</span>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "orders" && (
            <div className="dash-card">
              <span className="dash-card-section-label">Order History</span>
              {loadingOrders ? (
                <div className="dash-loading" style={{ minHeight: 160 }}>
                  <div className="dash-spinner" /> Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="dash-empty">
                  <ShoppingBag size={40} style={{ color: 'rgba(203,136,54,0.3)' }} />
                  <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 16, fontWeight: 700, color: '#2b1a06' }}>No orders yet</p>
                  <p>Your orders will appear here once you start shopping.</p>
                </div>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Products</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td><span className="dash-order-num">#{o.order_number}</span></td>
                          <td style={{ color: '#a89070', whiteSpace: 'nowrap' }}>{new Date(o.date).toLocaleDateString()}</td>
                          <td>
                            {o.items.map((item, idx) => {
                              const slug = item.product_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                              return (
                                <div key={idx} style={{ marginBottom: 3 }}>
                                  <Link href={`/product/${slug}`} className="dash-product-link">
                                    {item.product_name.length > 25 ? item.product_name.slice(0, 22) + "..." : item.product_name} ×{item.quantity}
                                  </Link>
                                </div>
                              );
                            })}
                          </td>
                          <td style={{ fontWeight: 700, color: '#2b1a06' }}>₹{o.total}</td>
                          <td>
                            <span className={`dash-pay-badge dash-pay-badge--${o.payment_status}`}>
                              {o.payment_status}
                            </span>
                          </td>
                          <td>
                            <span className={`dash-status-badge dash-status-badge--${o.status}`}>
                              {o.status}
                            </span>
                          </td>
                          <td>
                            <div className="dash-action-btns">
                              <a href={`/invoice/${o.order_number}`} target="_blank"
                                className="dash-icon-btn dash-icon-btn--green" title="Download Invoice">
                                <FileText size={14} />
                              </a>
                              <a href={`/track-order/${o.order_number}`}
                                className="dash-icon-btn dash-icon-btn--dark" title="Track Order">
                                <Truck size={14} />
                              </a>
                              {getOrderActionButtons(o)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === "settings" && (
            <div className="dash-card">
              <span className="dash-card-section-label">Account Settings</span>
              <div className="dash-field">
                <label className="dash-input-label">Full Name</label>
                <input type="text" className="dash-input" value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Full Name" />
                {errors.name && <span className="dash-error">{errors.name}</span>}
              </div>
              <div className="dash-field">
                <label className="dash-input-label">Phone Number</label>
                <input type="text" className="dash-input" value={user.phone || ""}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })} placeholder="Phone" />
                {errors.phone && <span className="dash-error">{errors.phone}</span>}
              </div>
              <div className="dash-field">
                <label className="dash-input-label">Email Address</label>
                <input type="email" className="dash-input" value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" />
                {errors.email && <span className="dash-error">{errors.email}</span>}
              </div>
              <div className="dash-field">
                <label className="dash-input-label">New Password <span style={{ color: '#a89070', fontWeight: 400 }}>(leave blank to keep current)</span></label>
                <input type="password" className="dash-input" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                {errors.password && <span className="dash-error">{errors.password}</span>}
              </div>
              <button onClick={handleUpdateSettings} className="dash-save-btn">
                Save Changes
              </button>
            </div>
          )}

          {/* ── RETURNS ── */}
          {activeTab === "returns" && (
            <div className="dash-card">
              <span className="dash-card-section-label">Returns, Refunds & Cancellations</span>

              <div className="dash-type-tabs">
                {[
                  { key: 'cancel', label: 'Cancel Order', icon: XCircle },
                  { key: 'return', label: 'Return', icon: RefreshCw },
                  { key: 'refund', label: 'Refund', icon: PackageX },
                ].map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setRequestType(key)}
                    className={`dash-type-tab dash-type-tab--${key} ${requestType === key ? 'dash-type-tab--active' : ''}`}>
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>

              <div className="dash-info-banner">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                {requestType === "cancel" && "You can only cancel orders that are pending or in processing."}
                {requestType === "return" && "Returns are available for completed or delivered orders within 30 days."}
                {requestType === "refund" && "Refund requests can be made for paid orders."}
              </div>

              <div className="dash-form-card">
                <p className="dash-form-card-title">
                  Submit {requestType.charAt(0).toUpperCase() + requestType.slice(1)} Request
                </p>
                <div className="dash-field">
                  <label className="dash-input-label">Select Order</label>
                  <select className="dash-select" value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)}>
                    <option value="">Choose an order...</option>
                    {orders.filter(o => {
                      if (requestType === 'cancel') return ['pending', 'processing'].includes(o.status);
                      if (requestType === 'return') return ['completed', 'delivered'].includes(o.status);
                      if (requestType === 'refund') return o.payment_status === 'paid';
                      return true;
                    }).map((o) => (
                      <option key={o.id} value={o.id}>#{o.order_number} — ₹{o.total} ({o.status})</option>
                    ))}
                  </select>
                </div>
                <div className="dash-field">
                  <label className="dash-input-label">Reason</label>
                  <textarea className="dash-textarea" rows={4} value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={`Why do you want to ${requestType} this order?`} />
                </div>
                <button onClick={handleSubmitRequest} className="dash-save-btn">
                  Submit {requestType.charAt(0).toUpperCase() + requestType.slice(1)} Request
                </button>
              </div>

              {/* Existing requests */}
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 16, fontWeight: 700, color: '#2b1a06', marginBottom: 14 }}>
                All Requests
              </p>
              {userRequests.length === 0 ? (
                <div className="dash-empty" style={{ padding: '28px 20px' }}>
                  <PackageX size={36} style={{ color: 'rgba(203,136,54,0.3)' }} />
                  <p>No requests submitted yet.</p>
                </div>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userRequests.map((r) => (
                        <tr key={r.id}>
                          <td><span className="dash-order-num">#{r.order.order_number}</span></td>
                          <td><span className={`dash-req-type dash-req-type--${r.type}`}>{r.type}</span></td>
                          <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</td>
                          <td style={{ fontWeight: 700 }}>₹{r.order.total_amount}</td>
                          <td>
                            <span className={`dash-status-badge dash-status-badge--${r.status}`}>{r.status}</span>
                          </td>
                          <td style={{ color: '#a89070', whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}