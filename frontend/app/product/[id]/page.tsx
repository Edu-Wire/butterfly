'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Star, Minus, Plus, ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';

interface Product {
    id: string; // Changed from number to string to match MongoDB ObjectId
    name: string;
    price: number;
    category: string;
    subCategory?: string;
    color: string;
    colors?: string[];
    gender?: 'Male' | 'Female' | 'Unisex';
    size: string[];
    sizes?: string[];
    rating: number;
    reviews: number;
    reviewsCount?: number;
    image: string;
    imageGradient?: string;
    imageUrl?: string;
    images?: string[];
    inStock: boolean;
    stock?: number;
    onSale?: boolean;
    salePrice?: number;
    isNew?: boolean;
    description?: string;
    fabricComposition?: string;
    fit?: string;
    closure?: string;
    sleeveType?: string;
    washCare?: string;
    countryOfManufacture?: string;
    modelSize?: string;
    modelHeight?: string;
    shippingTime?: string;
    isActive?: boolean;
    brand?: string;
    updatedAt?: string;
    isCustomizable?: boolean;
    videoUrl?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { addToCart } = useCart();
    const { toast } = useToast();
    const { user } = useAuth();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState<Product | null>(null);
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);
    const [showWishlistPrompt, setShowWishlistPrompt] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [showMeasurementModal, setShowMeasurementModal] = useState(false);
    const [customSize, setCustomSize] = useState({
        chest: '',
        waist: '',
        shoulder: '',
        sleeveLength: '',
        length: '',
        fit: 'Regular',
        notes: '',
        unit: 'inch'
    });



    useEffect(() => {
        if (id) {
            fetchProductData();
            fetchRecommendedProducts();
        }
    }, [id]);

    const fetchRecommendedProducts = async () => {
        try {
            const response = await fetch(`/api/products/recommended?productId=${id}`);
            const data = await response.json();
            if (data.success) {
                setRecommendedProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch recommended products:', error);
        }
    };

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const allImages = product ? (product.images || [product.imageUrl, product.image].filter(Boolean)) : [];
    const allMedia = product ? [
        ...allImages.map(url => ({ type: 'image', url })),
        ...(product.videoUrl ? [{ type: 'video', url: product.videoUrl }] : [])
    ] : [];

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && selectedImageIndex < (allMedia.length - 1)) {
            setSelectedImageIndex(prev => prev + 1);
        }
        if (isRightSwipe && selectedImageIndex > 0) {
            setSelectedImageIndex(prev => prev - 1);
        }
    };

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const [productRes, inventoryRes] = await Promise.all([
                fetch(`/api/products/${id}`),
                fetch(`/api/inventory?productId=${id}`)
            ]);

            const productData = await productRes.json();
            const invData = await inventoryRes.json();

            if (productData.success && productData.data) {
                setProduct(productData.data);
                setInventory(invData || []);

                // Set initial size (first one that is in stock)
                const sizes = productData.data.sizes || productData.data.size || [];
                const inStockSize = sizes.find((s: string) => {
                    const inv = invData.find((i: any) =>
                        (i.size === s || i.size === 'N/A') &&
                        (i.color === productData.data.color || i.color === 'N/A')
                    );
                    return inv ? (inv.totalStock - inv.reservedStock) > 0 : true;
                });
                setSelectedSize(inStockSize || sizes[0] || '');
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isSizeAvailable = (size: string) => {
        if (size === 'Custom') return true; // Custom size always available
        if (!inventory.length) return true;

        let inv = inventory.find(i =>
            i.size === size && (i.color === product?.color || i.color === 'N/A')
        );

        if (!inv) {
            const hasAnySpecificSizeRecord = inventory.some(i => i.size !== 'N/A');
            if (!hasAnySpecificSizeRecord) {
                inv = inventory.find(i => i.size === 'N/A' && i.color === 'N/A');
            }
        }

        if (!inv) return false;
        return (inv.totalStock - (inv.reservedStock || 0)) > 0;
    };

    const getStockInfo = (size: string) => {
        if (size === 'Custom') return null;
        if (!inventory.length) return null;

        let inv = inventory.find(i =>
            i.size === size && (i.color === product?.color || i.color === 'N/A')
        );

        if (!inv) {
            const hasAnySpecificSizeRecord = inventory.some(i => i.size !== 'N/A');
            if (!hasAnySpecificSizeRecord) {
                inv = inventory.find(i => i.size === 'N/A' && i.color === 'N/A');
            }
        }

        if (!inv) return null;

        const availableStock = inv.totalStock - (inv.reservedStock || 0);
        const lowStockThreshold = inv.lowStockThreshold || 5;
        const isLowStock = availableStock > 0 && availableStock <= lowStockThreshold;

        return {
            available: availableStock,
            threshold: lowStockThreshold,
            isLow: isLowStock
        };
    };

    const toggleWishlist = async () => {
        if (!user) {
            setShowWishlistPrompt(true);
            return;
        }

        if (!product) return;

        try {
            if (isInWishlist(product.id)) {
                const response = await fetch('/api/wishlist');
                if (response.ok) {
                    const data = await response.json();
                    const wishlistItem = data.data.find((item: any) => item.product._id === product.id);
                    if (wishlistItem) {
                        await removeFromWishlist(wishlistItem._id);
                    }
                }
            } else {
                await addToWishlist(product.id);
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            const { toast } = useToast();
            toast({
                title: 'Error',
                description: 'Failed to update wishlist. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const isCustomSizeEmpty = () => {
        return !customSize.chest || !customSize.waist || !customSize.shoulder || !customSize.sleeveLength || !customSize.length;
    };

    const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (['chest', 'waist', 'shoulder', 'sleeveLength', 'length'].includes(name)) {
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setCustomSize(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setCustomSize(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;

        if (!selectedSize) {
            setCartError('Please select a size');
            return;
        }

        if (selectedSize === 'Custom' && isCustomSizeEmpty()) {
            setCartError('Please enter your custom measurements');
            setShowMeasurementModal(true);
            return;
        }

        if (selectedSize !== 'Custom' && !product.inStock) {
            setCartError('Product is out of stock');
            return;
        }

        try {
            setAddingToCart(true);
            setCartError(null);

            const result = await addToCart(
                String(product.id),
                quantity,
                selectedSize,
                product.color || '',
                product.name,
                product.salePrice || product.price,
                product.images?.[0] || product.imageUrl || product.image,
                selectedSize === 'Custom' ? customSize : undefined
            );

            if (result.success) {
                toast({
                    title: "Added to Cart",
                    description: `${product.name} has been added to your cart.`,
                });
            } else {
                throw new Error(result.error || 'Failed to add to cart');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
            setCartError(errorMessage);
            console.error('[Product] Add to cart error:', error);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <main className="w-full bg-white min-h-screen">
                <div className="max-w-[1400px] mx-auto px-6 pt-24">
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-pulse">
                            <p className="text-gray-500">Loading product details...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="w-full bg-white min-h-screen">
                <div className="max-w-[1400px] mx-auto px-6 pt-24">
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-gray-600 text-lg mb-4">Product not found</p>
                        <Link href="/catalog" className="text-primary hover:underline">
                            Back to Catalog
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const displayColors = product.colors && product.colors.length > 0
        ? product.colors.join(', ')
        : product.color || 'N/A';
    const reviewCount = product.reviewsCount !== undefined ? product.reviewsCount : (product.reviews || 0);

    return (
        <main className="w-full bg-white min-h-screen">
            <div className="max-w-[1400px] mx-auto px-6 pt-24">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Images */}
                    <div className="lg:w-1/2">
                        {/* Mobile Carousel */}
                        <div className="lg:hidden">
                            <div
                                className="relative aspect-[3/4] bg-gray-100 overflow-hidden"
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                            >
                                {allMedia[selectedImageIndex] ? (
                                    allMedia[selectedImageIndex].type === 'image' ? (
                                        <img
                                            src={allMedia[selectedImageIndex].url}
                                            alt={`${product.name} ${selectedImageIndex + 1}`}
                                            className="w-full h-full object-cover object-top"
                                        />
                                    ) : (
                                        <video
                                            src={allMedia[selectedImageIndex].url}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full h-full object-cover object-top"
                                        />
                                    )
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
                                )}

                                {selectedImageIndex === 0 && (product.isNew || product.onSale) && (
                                    <div className="absolute top-4 left-4 z-10">
                                        {product.isNew && <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 mb-2 uppercase">NEW</div>}
                                        {product.onSale && <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase">SALE</div>}
                                    </div>
                                )}

                                {allMedia.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                        {allMedia.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${index === selectedImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Images */}
                        <div className="hidden lg:block space-y-0">
                            {allMedia.map((media, index) => (
                                <div key={index} className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                                    {media.type === 'image' ? (
                                        <img src={media.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover object-top" />
                                    ) : (
                                        <video
                                            src={media.url}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full h-full object-cover object-top"
                                        />
                                    )}
                                    {index === 0 && (product.isNew || product.onSale) && (
                                        <div className="absolute top-4 left-4 z-10">
                                            {product.isNew && <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 mb-2 uppercase">NEW</div>}
                                            {product.onSale && <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase">SALE</div>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>


                    </div>

                    {/* Right: Specifications */}
                    <div className="lg:w-1/2">
                        <div className="lg:sticky lg:top-8 space-y-8 pr-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    {product.brand && <p className="text-gray-500 text-xs tracking-widest mb-1 uppercase">{product.brand}</p>}
                                    <h1 className="font-serif text-2xl text-black mb-1">{product.name}</h1>
                                    <p className="text-gray-600 text-sm">{product.gender}</p>
                                </div>
                                <button onClick={toggleWishlist} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <Heart size={18} className={isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-400"} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-2xl font-bold text-black">INR {(product.salePrice || product.price).toLocaleString()}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.inStock ? '✓ In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            {selectedSize && (() => {
                                const stockInfo = getStockInfo(selectedSize);
                                if (stockInfo && stockInfo.isLow) {
                                    return (
                                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                                            <span className="text-sm font-medium text-orange-800">Only {stockInfo.available} left in stock!</span>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="flex items-center gap-1">
                                    <span className="text-lg font-bold">{Number(product.rating || 0).toFixed(1)}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className={i < Math.round(product.rating) ? "fill-gray-400 text-gray-400" : "text-gray-300"} />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
                            </div>

                            <div className="space-y-4 text-gray-600">
                                {product.description && <p className="text-sm leading-relaxed">{product.description}</p>}
                                {(product.modelSize || product.modelHeight) && (
                                    <ul className="text-sm list-disc pl-4 space-y-1">
                                        {product.modelSize && <li>Model wears a size: {product.modelSize}</li>}
                                        {product.modelHeight && <li>Model Height: {product.modelHeight}</li>}
                                    </ul>
                                )}
                            </div>

                            {/* Size Selection */}
                            <div>
                                <h3 className="font-semibold text-black mb-3 text-xs uppercase tracking-widest">Select Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {(product.sizes || product.size || ['N/A']).map((size) => {
                                        const available = isSizeAvailable(size);
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => available && setSelectedSize(size)}
                                                disabled={!available}
                                                className={`relative min-w-[4rem] h-12 px-4 flex items-center justify-center border transition-all text-xs font-bold tracking-widest overflow-hidden group
                                                    ${selectedSize === size
                                                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                                                        : available
                                                            ? 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
                                                            : 'border-gray-100 text-gray-200 cursor-not-allowed bg-gray-50'
                                                    }`}
                                            >
                                                {size.toUpperCase()}
                                                {!available && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <div className="w-[140%] h-[1.5px] bg-black/40 -rotate-45 transform"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                    {/* Always show CUSTOM size option */}
                                    <button
                                        onClick={() => {
                                            setSelectedSize('Custom');
                                            setShowMeasurementModal(true);
                                        }}
                                        className={`relative min-w-[4rem] h-12 px-4 flex items-center justify-center border transition-all text-xs font-bold tracking-widest overflow-hidden group
                                            ${selectedSize === 'Custom' ? 'bg-black text-white border-black shadow-lg' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                                    >
                                        CUSTOM
                                    </button>
                                </div>
                                {selectedSize === 'Custom' && !isCustomSizeEmpty() && (
                                    <div className="mt-2 text-xs text-green-600">
                                        Custom: {customSize.chest}-{customSize.waist}-{customSize.shoulder} ({customSize.fit})
                                        <button onClick={() => setShowMeasurementModal(true)} className="ml-2 underline text-black">Edit</button>
                                    </div>
                                )}
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="space-y-4">
                                {cartError && (
                                    <div className="bg-red-50 border border-red-200 rounded p-3">
                                        <p className="text-red-700 text-sm">{cartError}</p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-black mb-3">Quantity</h3>
                                    <div className="flex gap-4">
                                        <div className="flex items-center border-2 border-gray-300 rounded w-32 justify-between px-4 py-3">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-1 hover:text-black transition-colors"
                                                disabled={addingToCart}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-semibold">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="p-1 hover:text-black transition-colors"
                                                disabled={addingToCart}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleAddToCart}
                                            disabled={addingToCart}
                                            className="flex-1 bg-black text-white font-bold uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed rounded"
                                        >
                                            {addingToCart ? 'Adding...' : 'ADD TO CART'}
                                            {!addingToCart && <ShoppingCart size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            {product.shippingTime && (
                                <div className="text-sm border-t border-b border-gray-100 py-3">
                                    <strong>Shipping Time: </strong> {product.shippingTime}
                                </div>
                            )}

                            {/* Product Specifications */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-black border-b border-black inline-block pb-1 mb-2">Product Specifications</h3>

                                <div className="text-sm space-y-2 text-gray-700">
                                    <p><strong>Color:</strong> {displayColors}</p>
                                    <p><strong>Fabric Composition:</strong> {product.fabricComposition || 'N/A'}</p>
                                    <p><strong>Fit:</strong> {product.fit || 'N/A'}</p>
                                    <p><strong>Closure:</strong> {product.closure || 'N/A'}</p>
                                    <p><strong>Sleeve Type:</strong> {product.sleeveType || 'N/A'}</p>
                                    <p><strong>Wash Care:</strong> {product.washCare || 'N/A'}</p>
                                    <p><strong>Country of Manufacture:</strong> {product.countryOfManufacture || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Login Prompt Modal */}
                            {showWishlistPrompt && (
                                <div className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-[10001] h-screen">
                                    <div className="bg-white rounded-lg p-6 max-sm mx-4 space-y-4 shadow-xl border border-gray-200">
                                        <h3 className="text-lg font-bold text-black">Login Required</h3>
                                        <p className="text-gray-600">Please login to add items to your wishlist.</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowWishlistPrompt(false)}
                                                className="flex-1 px-4 py-2 border-2 border-gray-300 text-black rounded font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <Link
                                                href="/login"
                                                onClick={() => setShowWishlistPrompt(false)}
                                                className="flex-1 px-4 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors text-center"
                                            >
                                                Login
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recommended Products Section */}
                {recommendedProducts.length > 0 && (
                    <div className="mt-16 mb-16 pt-12 border-t border-gray-200">
                        <h2 className="font-sans text-2xl text-black mb-8 text-center uppercase tracking-widest">Recommendations</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {recommendedProducts.map((recProduct) => (
                                <Link
                                    key={recProduct.id}
                                    href={`/product/${recProduct.id}`}
                                    className="group"
                                >
                                    <div className="space-y-3">
                                        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                                            {recProduct.images?.[0] || recProduct.imageUrl || recProduct.image ? (
                                                <img
                                                    src={recProduct.images?.[0] || recProduct.imageUrl || recProduct.image}
                                                    alt={recProduct.name}
                                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-sans text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                                                {recProduct.name}
                                            </h3>
                                            <p className="font-sans text-sm font-bold text-black">
                                                INR {(recProduct.salePrice || recProduct.price).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Size Modal */}
            {showMeasurementModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10001] p-4">
                    <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-widest">Custom Measurement Form</h3>

                        <div className="flex gap-4 mb-6 border-b pb-4">
                            <button
                                onClick={() => setCustomSize(prev => ({ ...prev, unit: 'inch' }))}
                                className={`px-4 py-2 text-xs font-bold tracking-widest border ${customSize.unit === 'inch' ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-400'}`}
                            >
                                INCH
                            </button>
                            <button
                                onClick={() => setCustomSize(prev => ({ ...prev, unit: 'cm' }))}
                                className={`px-4 py-2 text-xs font-bold tracking-widest border ${customSize.unit === 'cm' ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-400'}`}
                            >
                                CM
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                            {[
                                { id: 'chest', label: 'Chest' },
                                { id: 'waist', label: 'Waist' },
                                { id: 'shoulder', label: 'Shoulder' },
                                { id: 'sleeveLength', label: 'Sleeve Length' },
                                { id: 'length', label: 'Length' }
                            ].map((field) => (
                                <div key={field.id}>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1">{field.label} ({customSize.unit})</label>
                                    <input
                                        type="text"
                                        name={field.id}
                                        value={(customSize as any)[field.id]}
                                        onChange={handleCustomSizeChange}
                                        className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        placeholder="0.0"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1">Fit Type</label>
                                <select
                                    name="fit"
                                    value={customSize.fit}
                                    onChange={handleCustomSizeChange}
                                    className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                                >
                                    <option value="Slim">Slim Fit</option>
                                    <option value="Regular">Regular Fit</option>
                                    <option value="Loose">Loose Fit</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1">Additional Notes</label>
                            <textarea
                                name="notes"
                                value={customSize.notes}
                                onChange={handleCustomSizeChange}
                                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors min-h-[100px] resize-none"
                                placeholder="e.g. Keep loose at waist, specific requirements, etc."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowMeasurementModal(false);
                                    if (isCustomSizeEmpty()) setSelectedSize('');
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (isCustomSizeEmpty()) {
                                        const { toast } = useToast();
                                        toast({
                                            title: 'Validation Error',
                                            description: 'Please fill all mandatory fields (Chest, Waist, Shoulder, Sleeve, Length)',
                                            variant: 'destructive',
                                        });
                                        return;
                                    }
                                    setShowMeasurementModal(false);
                                }}
                                className="flex-1 px-4 py-3 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Save Custom Size
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
