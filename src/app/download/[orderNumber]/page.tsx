"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Check, FileText } from "lucide-react";
import Link from "next/link";

interface DownloadItem {
  name: string;
  downloadUrl: string;
}

export default function DownloadPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<DownloadItem[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/downloads/${orderNumber}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Order not found");
          return;
        }
        setItems(data.items);
      } catch {
        setError("Failed to load download links");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading download links...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/" className="text-blue-600 text-sm font-semibold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 sm:px-5 py-12 sm:py-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 text-center mb-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Download Ready</h1>
          <p className="text-gray-500 text-sm mb-1">
            Order <span className="font-mono font-bold text-gray-900">{orderNumber}</span>
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
              </div>
              <a
                href={item.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors flex-shrink-0 ml-3"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No downloadable files found for this order.
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-400 text-xs mb-4">
            Save these files to your device. A copy was also sent to your email.
          </p>
          <Link href="/" className="text-blue-600 text-sm font-semibold hover:underline">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
