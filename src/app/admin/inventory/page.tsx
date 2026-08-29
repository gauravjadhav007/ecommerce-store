"use client";

import { useEffect, useState } from "react";
import { Search, X, AlertTriangle, Package, Edit3, Check, Minus, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  stock: number;
  price: number;
  images: string;
  isActive: boolean;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "out" | "low" | "ok">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);

  useEffect(() => {
    fetch("/api/admin/inventory")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ? true :
      filter === "out" ? p.stock === 0 :
      filter === "low" ? p.stock > 0 && p.stock <= 5 :
      p.stock > 5;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: products.length,
    out: products.filter(p => p.stock === 0).length,
    low: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    ok: products.filter(p => p.stock > 5).length,
  };

  const updateStock = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    await fetch("/api/admin/inventory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stock: newStock }),
    });
    setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
    setEditingId(null);
  };

  const quickAdjust = async (id: string, delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const newStock = Math.max(0, product.stock + delta);
    await updateStock(id, newStock);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500 text-sm">Loading inventory...</div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
        </div>
        {counts.out > 0 && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
            <AlertTriangle size={16} />
            {counts.out} out of stock
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: "all" as const, label: "All", count: counts.all },
          { key: "out" as const, label: "Out of Stock", count: counts.out, color: "text-red-600" },
          { key: "low" as const, label: "Low Stock (1-5)", count: counts.low, color: "text-orange-600" },
          { key: "ok" as const, label: "In Stock (6+)", count: counts.ok, color: "text-green-600" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.key
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No products found
                  </td>
                </tr>
              )}
              {filtered.map((product) => {
                const stockColor = product.stock === 0 ? "text-red-600" : product.stock <= 5 ? "text-orange-600" : "text-green-600";
                const bgColor = product.stock === 0 ? "bg-red-50" : product.stock <= 5 ? "bg-orange-50" : "bg-green-50";
                return (
                  <tr key={product.id} className={`hover:bg-gray-50 ${product.stock === 0 ? "bg-red-50/30" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.sku || "—"}</td>
                    <td className="px-6 py-4 text-sm">₹{(product.price / 100).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            autoFocus
                          />
                          <button onClick={() => updateStock(product.id, editValue)}
                            className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="p-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => quickAdjust(product.id, -1)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                            disabled={product.stock === 0}>
                            <Minus size={14} />
                          </button>
                          <button
                            onClick={() => { setEditingId(product.id); setEditValue(product.stock); }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${bgColor} ${stockColor}`}
                          >
                            {product.stock === 0 ? "Out of stock" : product.stock}
                          </button>
                          <button onClick={() => quickAdjust(product.id, 1)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => { setEditingId(product.id); setEditValue(product.stock); }}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                        title="Edit stock"
                      >
                        <Edit3 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No products found</div>
        )}
        {filtered.map((product) => {
          const stockColor = product.stock === 0 ? "text-red-600" : product.stock <= 5 ? "text-orange-600" : "text-green-600";
          const bgColor = product.stock === 0 ? "bg-red-50" : product.stock <= 5 ? "bg-orange-50" : "bg-green-50";
          return (
            <div key={product.id} className={`bg-white rounded-xl border border-gray-200 p-4 ${product.stock === 0 ? "border-red-200" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{product.name}</div>
                  {product.sku && <div className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</div>}
                  <div className="text-xs text-gray-400 mt-0.5">₹{(product.price / 100).toLocaleString("en-IN")}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                {editingId === product.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      autoFocus
                    />
                    <button onClick={() => updateStock(product.id, editValue)}
                      className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200">
                      <Check size={14} />
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="p-1.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => quickAdjust(product.id, -1)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                      disabled={product.stock === 0}>
                      <Minus size={16} />
                    </button>
                    <button
                      onClick={() => { setEditingId(product.id); setEditValue(product.stock); }}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${bgColor} ${stockColor}`}
                    >
                      {product.stock === 0 ? "Out of stock" : product.stock}
                    </button>
                    <button onClick={() => quickAdjust(product.id, 1)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
