"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, Send } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string | null };
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (session?.user) {
      checkPurchased();
    }
  }, [session, productId]);

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?productId=${productId}`);
    if (res.ok) {
      const data = await res.json();
      setReviews(data);
    }
    setLoading(false);
  };

  const checkPurchased = async () => {
    const res = await fetch("/api/orders");
    if (res.ok) {
      const orders = await res.json();
      const purchased = orders.some((order: any) =>
        order.items.some((item: any) => item.productId === productId)
      );
      setHasPurchased(purchased);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment: comment.trim() || undefined }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setRating(0);
        setComment("");
        setSuccess("Review submitted successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit review");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mt-10 sm:mt-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Customer Reviews</h2>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">{reviews.length} reviews</p>
          </div>
        </div>
      )}

      {/* Write a Review Form */}
      {session?.user && hasPurchased && (
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Write a Review</h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg mb-3 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5"
                  >
                    <Star
                      size={24}
                      className={`transition-colors ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-sm text-gray-500 ml-2">{rating}/5</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your experience..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
            >
              <Send size={14} />
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {!session?.user && (
        <p className="text-sm text-gray-500 mb-6">
          Sign in and purchase this product to leave a review.
        </p>
      )}

      {session?.user && !hasPurchased && (
        <p className="text-sm text-gray-500 mb-6">
          Purchase this product to leave a review.
        </p>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 sm:pb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="font-medium text-sm text-gray-900">{review.user.name || "Anonymous"}</span>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
