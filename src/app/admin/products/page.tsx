"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { parseImages } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

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
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAt: "",
    stock: "",
    sku: "",
    categoryId: "",
    featured: false,
    isActive: true,
    images: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imagesArray = form.images
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
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
      images: JSON.stringify(imagesArray),
    };

    const method = editingProduct ? "PUT" : "POST";
    await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setShowModal(false);
    setEditingProduct(null);
    resetForm();
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const images = parseImages(product.images);
    setForm({
      name: product.name,
      description: product.description || "",
      price: (product.price / 100).toString(),
      compareAt: product.compareAt ? (product.compareAt / 100).toString() : "",
      stock: product.stock.toString(),
      sku: product.sku || "",
      categoryId: product.categoryId || "",
      featured: product.featured,
      isActive: product.isActive,
      images: images.join(", "),
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      compareAt: "",
      stock: "",
      sku: "",
      categoryId: "",
      featured: false,
      isActive: true,
      images: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 sm:gap-2 bg-gray-900 text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg hover:bg-gray-700 text-xs sm:text-sm min-h-[44px]"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-xs sm:text-sm text-gray-500 border-b border-gray-200">
                <th className="p-3 sm:p-4">Product</th>
                <th className="p-3 sm:p-4 hidden sm:table-cell">Category</th>
                <th className="p-3 sm:p-4">Price</th>
                <th className="p-3 sm:p-4 hidden md:table-cell">Stock</th>
                <th className="p-3 sm:p-4 hidden sm:table-cell">Status</th>
                <th className="p-3 sm:p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const images = parseImages(product.images);
                return (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {images[0] ? (
                            <img src={images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-xs sm:text-sm">{product.name}</div>
                          {product.featured && (
                            <span className="text-[10px] sm:text-xs text-yellow-600">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-gray-500 text-xs sm:text-sm hidden sm:table-cell">
                      {product.category?.name || "-"}
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">₹{(product.price / 100).toFixed(0)}</td>
                    <td className="p-3 sm:p-4 hidden md:table-cell">
                      <span className={product.stock > 0 ? "text-green-600 text-xs sm:text-sm" : "text-red-600 text-xs sm:text-sm"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell">
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full ${
                        product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 hover:bg-gray-100 rounded min-w-[44px] min-h-[44px] flex items-center justify-center">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 text-red-500 rounded min-w-[44px] min-h-[44px] flex items-center justify-center">
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base">
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Compare at (₹)</label>
                  <input type="number" step="0.01" value={form.compareAt} onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base" />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Images (comma-separated URLs)</label>
                <input type="text" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base" />
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <label className="flex items-center gap-2 min-h-[44px]">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded w-4 h-4" />
                  <span className="text-xs sm:text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 min-h-[44px]">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded w-4 h-4" />
                  <span className="text-xs sm:text-sm">Active</span>
                </label>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-700 min-h-[44px] text-sm sm:text-base">
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
