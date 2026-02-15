import React, { useState } from 'react';
import { Plus, Trash2, UploadCloud, Loader2 } from 'lucide-react'; 
import { toast } from 'react-toastify'; 
// axios ki jagah apna api instance use kiya
import api from '../../utils/api.js'; 

const AddProduct = () => {
  // --- 1: FORM STATES ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]); 
  const [features, setFeatures] = useState([""]); 
  const [loading, setLoading] = useState(false); 

  // --- 2: HANDLERS ---
  const addFeatureField = () => {
    const nayaArray = [...features, ""];
    setFeatures(nayaArray);
  };

  const removeFeatureField = (index) => {
    const nayaArray = features.filter((_, i) => i !== index);
    setFeatures(nayaArray);
  };

  const handleFeatureChange = (index, value) => {
    const nayaArray = features.map((feat, i) => (i === index ? value : feat));
    setFeatures(nayaArray);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    toast.info(files.length + " Images selected!");
  };

  // --- 3: SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please select at least one image!");
      return;
    }

    setLoading(true); 

    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("price", price);
    myForm.append("description", description);
    myForm.append("stock", stock);
    myForm.append("category", category);

    features.forEach((feat) => myForm.append("features", feat));
    images.forEach((img) => myForm.append("images", img));

    try {
      const loadingToast = toast.loading("Uploading Product to Server...");

      // axios.post ko api.post se badal diya aur localhost khatam
      const response = await api.post(
        "/api/product/admin/product/new", 
        myForm, 
        {
          headers: { "Content-Type": "multipart/form-data" }
          // withCredentials nikaal diya kyunke api instance mein set hy
        }
      );

      if (response.data.success) {
        toast.update(loadingToast, { 
          render: "Product Uploaded Successfully!", 
          type: "success", 
          isLoading: false, 
          autoClose: 3000 
        });

        // Form reset
        setName(""); setPrice(""); setDescription(""); setStock(""); 
        setCategory(""); setImages([]); setFeatures([""]);
      }

    } catch (error) {
      toast.dismiss(); 
      toast.error(error.response?.data?.message || "Internal Server Error");
      console.log(error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 p-4">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[#020617] text-3xl font-black uppercase italic tracking-tighter">
          Admin <span className="text-[#F59E0B]">Inventory</span>
        </h1>
        <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-widest mt-1">Push New Items to Live Store</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Info Card */}
        <div className="bg-white p-8 rounded-[35px] border border-[#94A3B8]/20 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Product Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" 
                className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-[#F59E0B] p-4 rounded-2xl outline-none font-semibold transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Price (PKR)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" 
                className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-[#F59E0B] p-4 rounded-2xl outline-none font-semibold transition-all" required />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Description</label>
            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write details..." 
              className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-[#F59E0B] p-4 rounded-2xl outline-none font-semibold transition-all resize-none" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Qty" 
                className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-[#F59E0B] p-4 rounded-2xl outline-none font-semibold transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} 
                className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-[#F59E0B] p-4 rounded-2xl outline-none font-semibold transition-all cursor-pointer" required>
                <option value="">Choose</option>
                <option value="Mobile Phones">Mobile Phones</option>
                <option value="Computers and Laptop">Computers & Laptops</option>
                <option value="Power & Charging">Power & Charging</option>
                <option value="Audio">Audio & Headphones</option>
                <option value="Wearables">Wearable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media Card */}
        <div className="bg-white p-8 rounded-[35px] border border-[#94A3B8]/20 shadow-sm">
          <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest block mb-4">Media</label>
          <div className="relative border-4 border-dotted border-[#F8FAFC] hover:border-[#F59E0B]/50 rounded-[30px] p-10 flex flex-col items-center bg-[#F8FAFC] transition-all">
            <UploadCloud size={35} className="text-[#94A3B8] mb-2" />
            <p className="text-sm font-bold text-[#94A3B8]">Tap to select photos</p>
            <input type="file" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          {images.length > 0 && <p className="mt-3 text-xs font-black text-[#10B981]">{images.length} files attached</p>}
        </div>

        {/* Features Card */}
        <div className="bg-white p-8 rounded-[35px] border border-[#94A3B8]/20 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Features</label>
            <button type="button" onClick={addFeatureField} className="bg-[#0F172A] text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 shadow-lg shadow-[#0F172A]/20">
              <Plus size={12} /> Add More
            </button>
          </div>
          
          <div className="space-y-4">
            {features.map((feat, index) => (
              <div key={index} className="flex gap-3">
                <input type="text" value={feat} onChange={(e) => handleFeatureChange(index, e.target.value)} placeholder="Feature details..." 
                  className="flex-1 bg-[#F8FAFC] p-4 rounded-xl outline-none border-2 border-transparent focus:border-[#0F172A] text-sm font-medium" />
                {features.length > 1 && (
                  <button type="button" onClick={() => removeFeatureField(index)} className="p-4 text-[#EF4444] bg-[#EF4444]/5 rounded-xl hover:bg-[#EF4444] hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button with Loading */}
        <button 
          disabled={loading}
          type="submit" 
          className={`w-full text-white py-6 rounded-[30px] font-black uppercase tracking-[5px] text-sm transition-all duration-500 shadow-xl active:scale-95 flex items-center justify-center gap-3
            ${loading ? 'bg-[#94A3B8] cursor-not-allowed' : 'bg-[#0F172A] hover:bg-[#F59E0B]'}`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            "Upload Product"
          )}
        </button>

      </form>
    </div>
  );
};

export default AddProduct;