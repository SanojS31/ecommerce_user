"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronDown,
  ChevronUp,
  Shield,
  RotateCcw,
  Truck,
  ImageIcon,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useGetProductById, Variant } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import {
  useAddToWishlist,
  useGetWishlist,
  useRemoveFromWishlist,
} from "@/hooks/useWishlist";
import { useGetReviews, useSubmitReview } from "@/hooks/useReviews";
import { toast } from "react-toastify";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

function StarRating({
  rating,
  size = 16,
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className={
              star <= (hovered || rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
}

function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-sm font-medium text-gray-800 hover:text-[var(--brand-primary-hover)] transition-colors"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-500 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailSection() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data, isLoading } = useGetProductById(productId);
  const { data: wishlistData } = useGetWishlist(isLoggedIn);
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { data: reviewData, isLoading: reviewsLoading } =
    useGetReviews(productId);
  const { mutate: submitReview, isPending: submittingReview } =
    useSubmitReview(productId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(
    {}
  );

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("userAccessToken")));
    };
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  const product = data?.product;

  const isInWishlist = wishlistData?.wishlist?.products?.some(
    (p: any) => p._id === productId || p === productId
  );

  const activeVariants =
    product?.variants?.filter((v: Variant) => v.isActive) || [];

  const getSizeVariants = (): string[] => {
    const sizes: string[] = Array.from(
      new Set(
        activeVariants
          .filter((v: Variant) => (v.attributes as any).size)
          .map((v: Variant) => String((v.attributes as any).size))
      )
    );
    return sizes.sort(
      (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
    );
  };

  const getAgeVariants = (): string[] =>
    Array.from(
      new Set(
        activeVariants
          .filter((v: Variant) => (v.attributes as any).ageGroup)
          .map((v: Variant) => String((v.attributes as any).ageGroup))
      )
    );

  const getColorVariants = (): string[] =>
    Array.from(
      new Set(
        activeVariants
          .filter((v: Variant) => (v.attributes as any).color)
          .map((v: Variant) => String((v.attributes as any).color))
      )
    );

  const findVariant = (attrs: Record<string, string>): Variant | null =>
    activeVariants.find((v: Variant) => {
      const va = v.attributes as any;
      return product?.options?.every(
        (opt: string) => !attrs[opt] || va[opt] === attrs[opt]
      );
    }) || null;

  const handleAttrSelect = (key: string, value: string) => {
    const newAttrs = {
      ...selectedAttrs,
      [key]: selectedAttrs[key] === value ? "" : value,
    };
    setSelectedAttrs(newAttrs);
    setSelectedVariant(findVariant(newAttrs));
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!selectedVariant) {
      toast.warning("Please select a variant first");
      return;
    }
    addToCart(
      { productId, variantId: selectedVariant._id, quantity },
      {
        onSuccess: () => toast.success("Added to cart!"),
        onError: (err: any) =>
          toast.error(err?.response?.data?.msg || "Failed to add to cart"),
      }
    );
  };

  const handleWishlist = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (isInWishlist) removeFromWishlist(productId);
    else addToWishlist(productId);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!reviewComment.trim()) { toast.warning("Please write a comment"); return; }
    submitReview(
      { rating: reviewRating, title: reviewTitle, comment: reviewComment },
      {
        onSuccess: () => {
          toast.success("Review submitted!");
          setReviewSubmitted(true);
          setReviewTitle("");
          setReviewComment("");
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.msg || "Failed to submit review"),
      }
    );
  };

  const reviews = reviewData?.reviews || [];
  const avgRating = reviewData?.average || 0;
  const reviewCount = reviewData?.count || 0;

  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct:
      reviewCount > 0
        ? (reviews.filter((r) => r.rating === star).length / reviewCount) * 100
        : 0,
  }));

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-[3/4] rounded-3xl bg-gray-100" />
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-7 bg-gray-100 rounded w-2/3" />
            <div className="h-8 bg-gray-100 rounded w-1/4" />
            <div className="h-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        Product not found.{" "}
        <Link href="/products" className="text-[var(--brand-primary-hover)] underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const displayPrice = selectedVariant
    ? selectedVariant.price
    : product.basePrice;

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/home" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-600 transition-colors">Products</Link>
        {typeof product.category === "object" && (
          <>
            <span>/</span>
            <span className="hover:text-gray-600">{product.category.name}</span>
          </>
        )}
        <span>/</span>
        <span className="text-gray-600 font-medium truncate max-w-[160px]">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* ── Left: Image Gallery ── */}
        <div className="flex gap-3">
          {/* Thumbnail strip */}
          {product.images?.length > 1 && (
            <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === i
                    ? "border-[var(--brand-primary)] shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#fdf5f8] border border-pink-50">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={40} className="text-gray-300" />
                </div>
              )}
              {/* Wishlist pill on image */}
              <button
                onClick={handleWishlist}
                className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm shadow-lg transition-all ${isInWishlist
                  ? "bg-red-50 text-red-500"
                  : "bg-white/80 text-gray-400 hover:text-red-400"
                  }`}
              >
                <Heart
                  size={18}
                  fill={isInWishlist ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Mobile thumbnails */}
            {product.images?.length > 1 && (
              <div className="sm:hidden flex gap-2 mt-3 overflow-x-auto pb-1">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === i
                      ? "border-[var(--brand-primary)]"
                      : "border-transparent opacity-60"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Product Info ── */}
        <div className="space-y-6">
          {/* Brand + Name */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {typeof product.brand === "object" && (
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-primary-hover)] bg-[var(--brand-primary-soft)] px-2.5 py-1 rounded-full">
                  {product.brand.name}
                </span>
              )}
              {typeof product.category === "object" && (
                <span className="text-xs text-gray-400">{product.category.name}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            {reviewCount > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={Math.round(avgRating)} size={14} />
                <span className="text-sm font-medium text-gray-700">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              ₹{displayPrice.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400">Inclusive of all taxes</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed">
            {product.description}
          </p>

          <hr className="border-pink-100" />

          {/* Size Selector */}
          {product.options?.includes("size") && getSizeVariants().length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2.5">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {getSizeVariants().map((size: string) => {
                  const v = activeVariants.find(
                    (va: Variant) => (va.attributes as any).size === size
                  );
                  const outOfStock = !v || v.stock === 0;
                  return (
                    <button
                      key={size}
                      onClick={() => !outOfStock && handleAttrSelect("size", size)}
                      disabled={outOfStock}
                      className={`min-w-[44px] h-10 px-3 text-sm font-medium rounded-xl border-2 transition-all ${selectedAttrs.size === size
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary-hover)]"
                        : outOfStock
                          ? "border-gray-100 text-gray-300 cursor-not-allowed line-through bg-gray-50"
                          : "border-gray-200 text-gray-700 hover:border-[var(--brand-primary)]"
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Age Group Selector */}
          {product.options?.includes("ageGroup") && getAgeVariants().length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2.5">
                Age Group
              </p>
              <div className="flex flex-wrap gap-2">
                {getAgeVariants().map((age: string) => {
                  const v = activeVariants.find(
                    (va: Variant) => (va.attributes as any).ageGroup === age
                  );
                  const outOfStock = !v || v.stock === 0;
                  return (
                    <button
                      key={age}
                      onClick={() => !outOfStock && handleAttrSelect("ageGroup", age)}
                      disabled={outOfStock}
                      className={`h-10 px-4 text-sm font-medium rounded-xl border-2 transition-all ${selectedAttrs.ageGroup === age
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary-hover)]"
                        : outOfStock
                          ? "border-gray-100 text-gray-300 cursor-not-allowed line-through bg-gray-50"
                          : "border-gray-200 text-gray-700 hover:border-[var(--brand-primary)]"
                        }`}
                    >
                      {age}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.options?.includes("color") && getColorVariants().length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2.5">
                Color:{" "}
                <span className="font-normal text-gray-500">
                  {selectedAttrs.color || "Select"}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {getColorVariants().map((color: string) => (
                  <button
                    key={color}
                    onClick={() => handleAttrSelect("color", color)}
                    className={`h-10 px-4 text-sm font-medium rounded-xl border-2 transition-all ${selectedAttrs.color === color
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary-hover)]"
                      : "border-gray-200 text-gray-700 hover:border-[var(--brand-primary)]"
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock badge */}
          {selectedVariant && (
            <p
              className={`text-xs font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${selectedVariant.stock === 0
                ? "bg-red-50 text-red-500"
                : selectedVariant.stock < 5
                  ? "bg-amber-50 text-amber-600"
                  : "bg-green-50 text-green-600"
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedVariant.stock === 0 ? "bg-red-400" : selectedVariant.stock < 5 ? "bg-amber-400" : "bg-green-400"
                }`} />
              {selectedVariant.stock === 0
                ? "Out of stock"
                : selectedVariant.stock < 5
                  ? `Only ${selectedVariant.stock} left`
                  : "In stock"}
            </p>
          )}

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {/* Qty stepper */}
            {selectedVariant && selectedVariant.stock > 0 && (
              <div className="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-3 py-2 w-fit">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none font-medium"
                >
                  −
                </button>
                <span className="text-sm font-semibold text-gray-900 w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(selectedVariant.stock, q + 1))
                  }
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none font-medium"
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[var(--brand-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 transition-all shadow-lg shadow-purple-100 active:scale-[0.98]"
            >
              <ShoppingCart size={17} />
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>

          {/* Feature badges */}
          {/* <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, label: "Free Delivery", sub: "On orders ₹499+" },
              { icon: RotateCcw, label: "Easy Returns", sub: "7 day policy" },
              { icon: Shield, label: "100% Authentic", sub: "Quality assured" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-[#fdf5f8] border border-pink-50"
              >
                <Icon size={18} className="text-[var(--brand-primary-hover)]" />
                <span className="text-xs font-semibold text-gray-800">
                  {label}
                </span>
                <span className="text-[10px] text-gray-400">{sub}</span>
              </div>
            ))}
          </div> */}

          {/* Accordion */}
          <div className="mt-2">
            <AccordionItem title="Product Description">
              <p>{product.description}</p>
            </AccordionItem>
            <AccordionItem title="Care Instructions">
              <ul className="list-disc list-inside space-y-1">
                <li>Machine wash cold with similar colors</li>
                <li>Do not bleach or tumble dry</li>
                <li>Iron on low heat if needed</li>
                <li>Dry in shade for best results</li>
              </ul>
            </AccordionItem>
            <AccordionItem title="Shipping & Returns">
              <p>
                Orders are processed within 1–2 business days. Standard delivery
                takes 3–7 business days.
              </p>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* ── Reviews Section ── */}
      <div className="border-t border-pink-100 pt-10 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Customer Reviews
          </h2>
          {reviewCount > 0 && (
            <span className="text-sm text-gray-400">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Rating summary panel */}
          <div className="bg-[#fdf5f8] rounded-3xl p-6 border border-pink-50 flex flex-col items-center text-center gap-3">
            <p className="text-5xl font-bold text-gray-900">
              {reviewCount > 0 ? avgRating.toFixed(1) : "–"}
            </p>
            <StarRating rating={Math.round(avgRating)} size={20} />
            <p className="text-sm text-gray-500">
              {reviewCount > 0
                ? `Based on ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`
                : "No reviews yet"}
            </p>
            {/* Breakdown bars */}
            {reviewCount > 0 && (
              <div className="w-full space-y-1.5 mt-2">
                {ratingBreakdown.map(({ star, count, pct }) => (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 w-3">{star}</span>
                    <Star size={10} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-gray-400 w-4 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review list + form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Review list */}
            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse space-y-2 p-4 bg-gray-50 rounded-2xl">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--brand-primary-soft)] flex items-center justify-center text-sm font-bold text-[var(--brand-primary-hover)]">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {review.userName}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short", year: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size={13} />
                    </div>
                    {review.title && (
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        {review.title}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-4">
                No reviews yet. Be the first to review!
              </p>
            )}

            {/* Write a review form */}
            <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-5">
                Write a Review
              </h3>
              {!isLoggedIn ? (
                <p className="text-sm text-gray-500">
                  Please{" "}
                  <Link
                    href="/login"
                    className="text-[var(--brand-primary-hover)] font-semibold hover:underline"
                  >
                    sign in
                  </Link>{" "}
                  to leave a review.
                </p>
              ) : reviewSubmitted ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle2 size={18} />
                  Thanks for your review!
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </p>
                    <StarRating
                      rating={reviewRating}
                      size={28}
                      interactive
                      onChange={setReviewRating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Title{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Summarize your experience"
                      className="w-full rounded-xl border border-pink-100 bg-[#fdf5f8] px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Comment <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Tell others what you think about this product..."
                      rows={4}
                      required
                      className="w-full rounded-xl border border-pink-100 bg-[#fdf5f8] px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--brand-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 transition-all shadow-md shadow-purple-100 active:scale-[0.98]"
                  >
                    <Send size={15} />
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
