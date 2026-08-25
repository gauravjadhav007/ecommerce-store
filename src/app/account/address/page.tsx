"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Plus, Pencil, Trash2, Check, ChevronRight } from "lucide-react";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

const EMPTY_ADDRESS: Omit<Address, "id" | "isDefault"> = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
};

export default function AddressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      const stored = localStorage.getItem(`addresses-${session.user.id}`);
      if (stored) {
        setAddresses(JSON.parse(stored));
      }
    }
  }, [session]);

  const persistAddresses = (addrs: Address[]) => {
    if (session?.user) {
      localStorage.setItem(`addresses-${session.user.id}`, JSON.stringify(addrs));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      if (editingId) {
        const updated = addresses.map((a) =>
          a.id === editingId ? { ...a, ...form } : a
        );
        setAddresses(updated);
        persistAddresses(updated);
      } else {
        const newAddress: Address = {
          ...form,
          id: Date.now().toString(),
          isDefault: addresses.length === 0,
        };
        const updated = [...addresses, newAddress];
        setAddresses(updated);
        persistAddresses(updated);
      }

      setForm(EMPTY_ADDRESS);
      setEditingId(null);
      setShowForm(false);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 300);
  };

  const handleEdit = (addr: Address) => {
    setForm({
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this address?")) return;
    const updated = addresses.filter((a) => a.id !== id);
    if (addresses.find((a) => a.id === id)?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    persistAddresses(updated);
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    persistAddresses(updated);
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent min-h-[44px]";

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        <Link href="/account" className="hover:text-gray-900">My Account</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">Address Book</span>
      </nav>

      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Address Book</h1>
        <button
          onClick={() => {
            setForm(EMPTY_ADDRESS);
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 min-h-[44px]"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg mb-4 text-sm flex items-center gap-2">
          <Check size={14} />
          Address saved successfully!
        </div>
      )}

      {/* Address Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Full name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  required
                  placeholder="10-digit phone"
                  maxLength={10}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
                placeholder="House no., street, area"
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                  placeholder="City"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  required
                  placeholder="State"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP *</label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  required
                  placeholder="PIN code"
                  maxLength={6}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder="Country"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 min-h-[44px]"
              >
                {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(EMPTY_ADDRESS);
                }}
                className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <MapPin size={32} className="text-gray-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No addresses saved</h2>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Add a delivery address to speed up checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white border rounded-xl p-4 sm:p-5 ${
                addr.isDefault ? "border-gray-900" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">{addr.name}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-900 text-white rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{addr.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {addr.address}, {addr.city}, {addr.state} - {addr.zip}
                  </p>
                  <p className="text-sm text-gray-600">{addr.country}</p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(addr)}
                    className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
