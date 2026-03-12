import React, { useState } from "react";
import { createProduct } from "../../api/productApi";
import { toast } from "react-toastify";
import { PlusCircle, Trash2, Package, Tag, Layers, Database, Image as ImageIcon, FileText, IndianRupee, Save, Activity } from "lucide-react";

const SHOE_TYPES = [
    "Running",
    "Casual",
    "Formal",
    "Sports",
    "Sneakers",
    "Boots",
    "Loafers",
    "Sandals",
    "Flip Flops",
    "Hiking",
];

const AddProduct = ({ setActiveTab }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        category: "",
        type: "",
        price: "",
        images: [],        // array of File objects
        description: "",
    });

    const [sizes, setSizes] = useState([
        { size: "", stock: "" },
    ]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSizeChange = (index, e) => {
        const newSizes = [...sizes];
        newSizes[index][e.target.name] = e.target.value;
        setSizes(newSizes);
    };

    const addSizeField = () => {
        setSizes([...sizes, { size: "", stock: "" }]);
    };

    const removeSizeField = (index) => {
        const newSizes = sizes.filter((_, i) => i !== index);
        setSizes(newSizes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();

            data.append("name", formData.name);
            data.append("brand", formData.brand);
            data.append("category", formData.category);
            data.append("type", formData.type);
            data.append("price", formData.price);
            data.append("description", formData.description);

            // Append each image file with field name 'images'
            formData.images.forEach(file => data.append("images", file));

            data.append("sizes", JSON.stringify(sizes));

            await createProduct(data);

            toast.success("Product Added Successfully 👟", { position: "top-right", autoClose: 2000 });

            if (setActiveTab) {
                setActiveTab("products");
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error adding product ❌", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };
    const inputClass = "w-full bg-[#0a0f1a] border border-white/10 text-white text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full p-4 pl-12 transition-all placeholder-gray-500 shadow-[0_4px_10px_rgba(0,0,0,0.3)]";
    const selectClass = "w-full bg-[#0a0f1a] border border-white/10 text-white text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full p-4 pl-12 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.3)] appearance-none cursor-pointer";

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out] w-full max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Add New Product</h2>
                    <p className="text-gray-400 text-sm mt-1">Fill in the details to list a new shoe in your store.</p>
                </div>
                <button
                    onClick={() => setActiveTab && setActiveTab("products")}
                    className="bg-white/5 text-gray-300 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300 text-sm font-bold uppercase tracking-wider"
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Basic Details */}
                    <div className="lg:col-span-2 space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl">
                        <h3 className="text-lg font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-2">
                            <Package className="text-cyan-400" size={20} />
                            Basic Info
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name */}
                            <div className="relative col-span-1 md:col-span-2">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="name"
                                    placeholder="Product Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Brand */}
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="brand"
                                    placeholder="Brand Name"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Type */}
                            <div className="relative">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} />
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className={selectClass}
                                    required
                                >
                                    <option value="" disabled className="text-gray-500">Select Type</option>
                                    {SHOE_TYPES.map(t => (
                                        <option key={t} value={t} className="bg-[#0a0f1a]">{t}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category */}
                            <div className="relative">
                                <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={selectClass}
                                    required
                                >
                                    <option value="" disabled className="text-gray-500">Select Category</option>
                                    <option value="men" className="bg-[#0a0f1a]">Men</option>
                                    <option value="women" className="bg-[#0a0f1a]">Women</option>
                                    <option value="kids" className="bg-[#0a0f1a]">Kids</option>
                                </select>
                            </div>

                            {/* Price */}
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" size={18} />
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price in INR"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={inputClass}
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Images (multiple) */}
                            <div className="relative col-span-1 md:col-span-2">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    required
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files).slice(0, 5);
                                        setFormData({ ...formData, images: files });
                                    }}
                                    className={`${inputClass} !py-3.5 !pl-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20`}
                                />
                                <p className="text-[10px] text-gray-500 mt-1.5 pl-1">Select up to 5 images (first will be the main image)</p>

                                {/* Preview Grid */}
                                {formData.images.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        {formData.images.map((file, i) => (
                                            <div key={i} className="relative bg-[#0a0f1a] border border-white/5 rounded-xl overflow-hidden h-28">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${i + 1}`}
                                                    className="w-full h-full object-contain p-2 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                                                />
                                                {i === 0 && (
                                                    <span className="absolute top-1.5 left-1.5 text-[8px] font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">Main</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="relative col-span-1 md:col-span-2">
                                <FileText className="absolute left-4 top-6 text-gray-400" size={18} />
                                <textarea
                                    name="description"
                                    placeholder="Product Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className={`${inputClass} resize-none`}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sizes & Stock */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white tracking-widest uppercase flex items-center gap-2">
                                <Activity className="text-purple-400" size={20} />
                                Inventory
                            </h3>
                            <button
                                type="button"
                                onClick={addSizeField}
                                className="text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                            >
                                <PlusCircle size={14} /> Add
                            </button>
                        </div>

                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                            {sizes.map((s, index) => (
                                <div key={index} className="bg-[#0a0f1a] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 relative group transition-all hover:border-white/10">

                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">UK Size</label>
                                            <input
                                                type="number"
                                                name="size"
                                                placeholder="e.g. 7"
                                                value={s.size}
                                                onChange={(e) => handleSizeChange(index, e)}
                                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-cyan-500 text-center py-2 transition-all outline-none pl-0 p-0"
                                                required
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Stock</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                placeholder="Units"
                                                value={s.stock}
                                                onChange={(e) => handleSizeChange(index, e)}
                                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-cyan-500 text-center py-2 transition-all outline-none pl-0 p-0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {sizes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSizeField(index)}
                                            className="absolute -top-2 -right-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                                            title="Remove Size"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold uppercase tracking-[0.2em] py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98]'}`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding Product...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Publish Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;