"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search, Eye, EyeOff, ImagePlus } from "lucide-react";
import { parseImages } from "@/lib/utils";

interface Category { id: string; name: string; }
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  stock: number;
  sku: string | null;
  isActive: boolean;
  featured: boolean;
  images: string;
  categoryId: string | null;
  category?: { name: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [form, setForm] = useState({
    name: "", description: "", price: "", compareAt: "", stock: "", sku: "",
    categoryId: "", featured: false, isActive: true,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) =>
    search === "" || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const addImage = () => {
    const url = newImageUrl.trim();
    if (url && !formImages.includes(url)) {
      setFormImages([...formImages, url]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormImages(formImages.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formImages.length) return;
    const updated = [...formImages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setFormImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...(editingProduct && { id: editingProduct.id }),
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
      stock: parseInt(form.stock) || 0,
      sku: form.sku || null,
      categoryId: form.categoryId || null,
      featured: form.featured,
      isActive: form.isActive,
      images: JSON.stringify(formImages),
    };
    await fetch("/api/admin/products", {
      method: editingProduct ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setShowModal(false);
    setEditingProduct(null);
    resetForm();
    const res = await fetch("/api/admin/products");
    setProducts(await res.json());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    const res = await fetch("/api/admin/products");
    setProducts(await res.json());
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormImages(parseImages(product.images));
    setForm({
      name: product.name, description: product.description || "",
      price: (product.price / 100).toString(),
      compareAt: product.compareAt ? (product.compareAt / 100).toString() : "",
      stock: product.stock.toString(), sku: product.sku || "",
      categoryId: product.categoryId || "", featured: product.featured,
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      name: "", description: "", price: "", compareAt: "", stock: "", sku: "",
      categoryId: "", featured: false, isActive: true,
    });
    setFormImages([]);
    setNewImageUrl("");
  };

  const toggleActive = async (product: Product) => {
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, isActive: !product.isActive }),
    });
    const res = await fetch("/api/admin/products");
    setProducts(await res.json());
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500 text-sm">Loading products...</div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingProduct(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-gray-900 text-white px-3 sm:px-4 py-2.5 rounded-lg hover:bg-gray-700 text-sm min-h-[44px]"
        >
          <Plus size={16} /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text" placeholder="Search products..." value={search}
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
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No products found</td></tr>
              )}
              {filtered.map((product) => {
                const images = parseImages(product.images);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {images[0] ? <img src={images[0]} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.sku || "No SKU"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.category?.name || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">₹{(product.price / 100).toLocaleString("en-IN")}</div>
                      {product.compareAt && <div className="text-xs text-gray-400 line-through">₹{(product.compareAt / 100).toLocaleString("en-IN")}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-orange-600" : "text-red-600"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleActive(product)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          product.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}>
                        {product.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        {product.isActive ? "Active" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(product)} className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
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
          const images = parseImages(product.images);
          return (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {images[0] ? <img src={images[0]} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.category?.name || "No category"}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold">₹{(product.price / 100).toLocaleString("en-IN")}</span>
                    {product.compareAt && <span className="text-xs text-gray-400 line-through">₹{(product.compareAt / 100).toLocaleString("en-IN")}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(product)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${
                      product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                    {product.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                    {product.isActive ? "Active" : "Draft"}
                  </button>
                  <span className={`text-xs font-medium ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-orange-600" : "text-red-600"}`}>
                    {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(product)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm">
                  <option value="">No Category</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compare at (₹)</label>
                  <input type="number" step="0.01" value={form.compareAt} onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
                </div>
              </div>

              {/* Multi-Photo Manager */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-1.5"><ImagePlus size={14} /> Product Photos ({formImages.length})</span>
                </label>
                {formImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {formImages.map((url, i) => (
                      <div key={i} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">PRIMARY</span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          {i > 0 && (
                            <button type="button" onClick={() => moveImage(i, -1)} className="p-1 bg-white/90 rounded text-xs font-medium" title="Move left">←</button>
                          )}
                          {i < formImages.length - 1 && (
                            <button type="button" onClick={() => moveImage(i, 1)} className="p-1 bg-white/90 rounded text-xs font-medium" title="Move right">→</button>
                          )}
                          <button type="button" onClick={() => removeImage(i)} className="p-1 bg-red-500 text-white rounded" title="Remove"><X size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="url" value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                    placeholder="Paste image URL and press Add"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                  <button type="button" onClick={addImage}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium whitespace-nowrap">
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Paste image URL, click Add or press Enter. First image is the primary photo.</p>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded w-4 h-4" />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded w-4 h-4" />
                  <span className="text-sm">Active</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700">
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
