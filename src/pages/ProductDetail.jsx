import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import {
    Star, Minus, Plus, ShoppingCart, MessageSquare, Package,
    Truck, Shield, ChevronRight, X, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';

const ProductDetail = () => {
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { id } = useParams();
    const product = products.find((p) => p.id === id);

    if (!product) {
        return <p className="p-6 text-red-500">Product not found.</p>;
    }

    // ✅ Handle both new (images[]) and old (image1–4) structures
    const images =
        product.images && product.images.length > 0
            ? product.images
            : [product.image1, product.image2, product.image3, product.image4].filter(Boolean);

    // Remove duplicates just in case
    const uniqueImages = [...new Set(images)];

    // Keyboard navigation for modal
    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsModalOpen(false);
            else if (e.key === 'ArrowLeft') goToPrevious();
            else if (e.key === 'ArrowRight') goToNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, selectedImageIndex]);

    const goToNext = () => {
        setSelectedImageIndex((prev) => (prev + 1) % uniqueImages.length);
    };

    const goToPrevious = () => {
        setSelectedImageIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
    };

    const parseMinOrder = (minOrder) => {
        if (!minOrder) return { value: 1, unit: "" };
        const m = minOrder.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z%]*)/);
        if (!m) return { value: 1, unit: minOrder };
        const value = parseFloat(m[1]);
        const unit = m[2] || "";
        return { value: isNaN(value) ? 1 : value, unit };
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const similarProducts = products
        .filter((p) => p.id !== id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    const parsedMin = parseMinOrder(product.minOrder);
    const minUnitValue = parsedMin.value;
    const unitLabel = parsedMin.unit;
    const isInStock = (product.stockStatus || "").toLowerCase().includes("in stock");
    const totalWeight = minUnitValue * quantity;
    const totalPrice = product.currentPrice * quantity;
    const discount = product.oldPrice
        ? Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100)
        : 0;

    const increment = () => setQuantity((q) => q + 1);
    const decrement = () => setQuantity((q) => Math.max(1, q - 1));
    const onQuantityChange = (e) => {
        const v = parseInt(e.target.value || "1", 10);
        if (!isNaN(v) && v > 0) setQuantity(v);
    };

    const handleAddToCart = () => {
        if (!isInStock) {
            setMessage("This product is currently out of stock.");
            setTimeout(() => setMessage(""), 3000);
            return;
        }
        setMessage("Item added to your quote request!");
        setTimeout(() => setMessage(""), 3000);
    };

    const features = [
        { icon: Package, text: `Minimum order: ${product.minOrder}` },
        { icon: Truck, text: "Fast delivery available" },
        { icon: Shield, text: "Quality guaranteed" }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <a href="/" className="hover:text-green-600 transition-colors">Home</a>
                    <ChevronRight className="w-4 h-4" />
                    <a href="/products" className="hover:text-green-600 transition-colors">Products</a>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
                        {/* Main Image - Clickable */}
                        <div
                            className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden cursor-pointer group"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <img
                                src={uniqueImages[selectedImageIndex]}
                                alt={product.name}
                                className="w-full h-[500px] object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                                    Click to enlarge
                                </span>
                            </div>
                            {discount > 0 && (
                                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
                                    {discount}% OFF
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg ${isInStock ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                                    {product.stockStatus}
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {uniqueImages.length > 1 && (
                            <div className="flex gap-3">
                                {uniqueImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`flex-1 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx
                                            ? "border-green-600 ring-2 ring-green-200 dark:ring-green-800"
                                            : "border-gray-200 dark:border-gray-700 hover:border-green-400"
                                            }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-24 object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                            Click image to view fullscreen • Use arrow keys to navigate
                        </p>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {product.name}
                        </h1>
                        {product.sku && product.sku.trim() && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                        )}

                        {/* Rating */}
                        <div className="flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.reviews) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {product.reviews.toFixed(1)} rating
                            </span>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-green-600 dark:text-green-500">
                                    {formatCurrency(product.currentPrice)}
                                </span>
                                {product.oldPrice && (
                                    <span className="text-xl text-gray-400 line-through">
                                        {formatCurrency(product.oldPrice)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Per unit of {minUnitValue}{unitLabel}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {features.map((feature, idx) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <IconComponent className="w-5 h-5 text-green-600 dark:text-green-500" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2 flex-wrap">
                            {product.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Quantity & Total */}
                        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                                    <button type="button" onClick={decrement} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                        <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                    </button>
                                    <input
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={onQuantityChange}
                                        className="w-20 text-center outline-none py-3 bg-transparent text-gray-900 dark:text-white font-semibold"
                                    />
                                    <button type="button" onClick={increment} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                        <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total weight</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {totalWeight}{unitLabel}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Total Price</span>
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(totalPrice)}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={!isInStock}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold shadow-sm transition-all ${!isInStock
                                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                        : "bg-green-600 hover:bg-green-700 text-white"
                                        }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {isInStock ? "Request Quote" : "Out of Stock"}
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-4 border-2 border-green-600 text-green-600 dark:text-green-500 dark:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg font-semibold transition-all flex items-center gap-2"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Contact
                                </button>
                            </div>

                            {message && (
                                <div
                                    className={`${message.includes("out of stock")
                                        ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                                        : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                                        } border p-3 rounded-lg text-sm font-medium text-center`}
                                >
                                    {message}
                                </div>
                            )}
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">Category:</span>
                                <span className="ml-2 text-gray-900 dark:text-white font-medium">{product.category}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">Availability:</span>
                                <span className="ml-2 text-gray-900 dark:text-white font-medium">{product.availability}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div className="mt-12 max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarProducts.map((sp) => (
                            <ProductCard key={sp.id} product={sp} />
                        ))}
                    </div>
                </div>
            )}

            {/* Fullscreen Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white hover:text-gray-300">
                        <X className="w-8 h-8" />
                    </button>
                    {uniqueImages.length > 1 && (
                        <>
                            <button onClick={goToPrevious} className="absolute left-4 text-white hover:text-gray-300">
                                <ChevronLeft className="w-12 h-12" />
                            </button>
                            <button onClick={goToNext} className="absolute right-4 text-white hover:text-gray-300">
                                <ChevronRightIcon className="w-12 h-12" />
                            </button>
                        </>
                    )}
                    <img
                        src={uniqueImages[selectedImageIndex]}
                        alt={`${product.name} - View ${selectedImageIndex + 1}`}
                        className="max-w-full max-h-[90vh] object-contain"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                        {selectedImageIndex + 1} / {uniqueImages.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
