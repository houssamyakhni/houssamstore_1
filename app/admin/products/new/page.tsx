import { FastAverageColor } from 'fast-average-color';
import namer from 'color-namer';

// ... inside component ...

const onSuccess = async (res: any) => {
    console.log("Success", res);

    try {
        const fac = new FastAverageColor();
        // Enable crossOrigin for ImageKit if needed, but fac handles it if CORS headers are present.
        // If ImageKit doesn't serve CORS headers for random domains, this might fail on client.
        // Usually ImageKit public URLs are CORS friendly.
        const color = await fac.getColorAsync(res.url + "?tr=w-100"); // Resize to small for speed

        // Get Name
        const names = namer(color.hex);
        // Use HTML/CSS standard names so they work in 'backgroundColor' style without a custom map for everything
        // e.g. "midnightblue", "crimson"
        const autoColor = names.html[0]?.name || names.basic[0]?.name || color.hex;

        // Capitalize for display (optional, but nice)
        const formattedColor = autoColor.charAt(0).toUpperCase() + autoColor.slice(1);

        setImages(prev => [...prev, { color: formattedColor, image: res.url }]);
    } catch (error) {
        console.error("Color detection failed", error);
        // Fallback
        setImages(prev => [...prev, { color: `Variant ${prev.length + 1}`, image: res.url }]);
    }
};

// ... remove currentColor state and input ...

// Remove addImageColor function and the button that calls it

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (images.length === 0) {
        alert("Please add at least one image with color.");
        return;
    }
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        category: formData.get("category"),
        stock: Number(formData.get("stock")),
        images: images,
        colors: images.map(img => img.color)
    };

    try {
        const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            router.push("/admin/products");
            router.refresh();
        } else {
            alert("Failed to create product");
        }
    } catch (e) {
        alert("Error creating product");
    } finally {
        setLoading(false);
    }
}

return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Add New Product
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Create a new product with multiple color variants.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Card */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <h3 className="text-base font-semibold leading-7 text-gray-900 mb-6">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Product Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 transition-all"
                                        placeholder="e.g. Classic Denim Jacket"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                    Description
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        required
                                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 transition-all"
                                        placeholder="Detailed description of the product..."
                                    />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about the product.</p>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                                    Category
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option value="">Select a category</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="accessories">Accessories</option>
                                        <option value="home">Home</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                    <div className="px-4 py-6 sm:p-8">
                        <h3 className="text-base font-semibold leading-7 text-gray-900 mb-6">Pricing & Inventory</h3>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                                    Price
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        step="0.01"
                                        required
                                        className="block w-full rounded-md border-0 py-2.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">
                                    Stock
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name="stock"
                                        id="stock"
                                        required
                                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                        placeholder="Quantity available"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images & Colors */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                    <div className="px-4 py-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-base font-semibold leading-7 text-gray-900">Images & Variants</h3>
                                <p className="mt-1 text-sm text-gray-500">Upload images for each color variant.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 border border-dashed border-gray-300">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 items-end">
                                <div className="sm:col-span-full">
                                    <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                        Upload Image (Auto-detects Color)
                                    </label>
                                    <div className="mt-2 text-xs text-gray-500 mb-4">
                                        System will analyze the image and automatically assign a color name (e.g., "Midnight Blue", "Crimson").
                                    </div>

                                    <ImageKitProvider
                                        publicKey={publicKey}
                                        urlEndpoint={urlEndpoint}
                                        authenticator={authenticator}
                                    >
                                        <IKUpload
                                            fileName="product-image.png"
                                            onError={onError}
                                            onSuccess={onSuccess}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 transition-colors cursor-pointer"
                                        />
                                    </ImageKitProvider>
                                </div>
                            </div>
                        </div>

                        {/* Variants Grid */}
                        {images.length > 0 && (
                            <div className="mt-8">
                                <h4 className="text-sm font-medium text-gray-900 mb-4">Active Variants</h4>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 lg:aspect-none h-48 relative">
                                                <Image
                                                    src={img.image}
                                                    alt={img.color}
                                                    fill
                                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImageColor(idx)}
                                                        className="rounded-full bg-white/90 p-2 text-red-600 shadow-sm hover:bg-white transition-all"
                                                    >
                                                        <FiTrash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                                    {img.color}
                                                </h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-4 px-4 sm:px-0">
                    <button type="button" onClick={() => router.back()} className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-black px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-70 disabled:cursor-wait transition-all"
                    >
                        {loading ? "Creating Product..." : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    </div>
);
}
