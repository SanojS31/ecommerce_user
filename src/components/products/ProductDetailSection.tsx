"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, ShoppingCart, ArrowLeft, Image } from "lucide-react";
import { useGetProductById, Variant } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAddToWishlist, useGetWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function ProductDetailSection() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const { data, isLoading } = useGetProductById(productId);
  const { data: wishlistData } = useGetWishlist();
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState("");

  const product = data?.product;

  const isInWishlist = wishlistData?.wishlist?.products?.some(
    (p: any) => p._id === productId || p === productId
  );

  const activeVariants = product?.variants?.filter(
    (v: Variant) => v.isActive
  ) || [];

  const getSizeVariants = () => {
    const sizes = [...new Set(
      activeVariants
        .filter((v: Variant) => (v.attributes as any).size)
        .map((v: Variant) => (v.attributes as any).size)
    )];
    return sizes.sort((a, b) =>
      SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
    );
  };

  const getAgeVariants = () => {
    return [...new Set(
      activeVariants
        .filter((v: Variant) => (v.attributes as any).ageGroup)
        .map((v: Variant) => (v.attributes as any).ageGroup)
    )];
  };

  const getColorVariants = () => {
    return [...new Set(
      activeVariants
        .filter((v: Variant) => (v.attributes as any).color)
        .map((v: Variant) => (v.attributes as any).color)
    )];
  };

  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});

  const findVariant = (attrs: Record<string, string>): Variant | null => {
    return (
      activeVariants.find((v: Variant) => {
        const va = v.attributes as any;
        return product?.options?.every(
          (opt: string) => !attrs[opt] || va[opt] === attrs[opt]
        );
      }) || null
    );
  };

  const handleAttrSelect = (key: string, value: string) => {
    const newAttrs = {
      ...selectedAttrs,
      [key]: selectedAttrs[key] === value ? "" : value,
    };
    setSelectedAttrs(newAttrs);
    const variant = findVariant(newAttrs);
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    const token = localStorage.getItem("userAccessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!selectedVariant) {
      setAddedMsg("Please select a variant");
      setTimeout(() => setAddedMsg(""), 2000);
      return;
    }
    addToCart(
      {
        productId,
        variantId: selectedVariant._id,
        quantity,
      },
      {
        onSuccess: () => {
          setAddedMsg("Added to cart!");
          setTimeout(() => setAddedMsg(""), 2000);
        },
        onError: (err: any) => {
          setAddedMsg(err?.response?.data?.msg || "Failed to add");
          setTimeout(() => setAddedMsg(""), 2000);
        },
      }
    );
  };

  const handleWishlist = () => {
    const token = localStorage.getItem("userAccessToken");
    if (!token) { router.push("/login"); return; }
    if (isInWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square rounded-2xl bg-gray-100" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-8 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        Product not found
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image size={32} className="text-gray-300" />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-gray-900"
                      : "border-gray-100 hover:border-gray-300"
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
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-xs text-gray-400 font-medium">
              {typeof product.category === "object"
                ? product.category.name
                : ""}{" "}
              ·{" "}
              {typeof product.brand === "object" ? product.brand.name : ""}
            </p>
            <h1 className="text-xl font-semibold text-gray-900 mt-1">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ₹
              {selectedVariant
                ? selectedVariant.price.toLocaleString()
                : product.basePrice.toLocaleString()}
            </p>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            {product.description}
          </p>

          {/* Size Variants */}
          {product.options?.includes("size") && getSizeVariants().length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
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
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        selectedAttrs.size === size
                          ? "bg-gray-900 text-white border-gray-900"
                          : outOfStock
                          ? "text-gray-300 border-gray-100 cursor-not-allowed line-through"
                          : "text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Age Group Variants */}
          {product.options?.includes("ageGroup") && getAgeVariants().length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
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
                      onClick={() =>
                        !outOfStock && handleAttrSelect("ageGroup", age)
                      }
                      disabled={outOfStock}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        selectedAttrs.ageGroup === age
                          ? "bg-gray-900 text-white border-gray-900"
                          : outOfStock
                          ? "text-gray-300 border-gray-100 cursor-not-allowed line-through"
                          : "text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {age}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Variants */}
          {product.options?.includes("color") && getColorVariants().length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {getColorVariants().map((color: string) => (
                  <button
                    key={color}
                    onClick={() => handleAttrSelect("color", color)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      selectedAttrs.color === color
                        ? "bg-gray-900 text-white border-gray-900"
                        : "text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock info */}
          {selectedVariant && (
            <p
              className={`text-xs font-medium ${
                selectedVariant.stock === 0
                  ? "text-red-500"
                  : selectedVariant.stock < 5
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {selectedVariant.stock === 0
                ? "Out of stock"
                : selectedVariant.stock < 5
                ? `Only ${selectedVariant.stock} left`
                : "In stock"}
            </p>
          )}

          {/* Quantity */}
          {selectedVariant && selectedVariant.stock > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg leading-none"
                >
                  −
                </button>
                <span className="text-sm font-medium text-gray-900 w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(selectedVariant.stock, q + 1)
                    )
                  }
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg leading-none"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              <ShoppingCart size={16} />
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleWishlist}
              className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-colors ${
                isInWishlist
                  ? "border-red-200 text-red-500 bg-red-50"
                  : "border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400"
              }`}
            >
              <Heart
                size={18}
                fill={isInWishlist ? "currentColor" : "none"}
              />
            </button>
          </div>

          {addedMsg && (
            <p
              className={`text-xs font-medium ${
                addedMsg.includes("Added")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {addedMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}