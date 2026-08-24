"use client";

import { useState } from "react";

export default function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      window.location.href = `/track-order/${orderNumber.trim()}`;
    }
  };

  return (
    <form className="flex gap-3 max-w-md" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Order number (e.g. GT-123456)"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Track
      </button>
    </form>
  );
}
