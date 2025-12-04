import { useState } from "react";
import { motion } from "framer-motion";
import { db, storage } from "../../services/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { Loader2 } from "lucide-react";

const ProductCreate = () => {
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    currentPrice: "",
    oldPrice: "",
    unit: "",
    availability: "",
    minOrder: "",
    tags: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageUpload = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.currentPrice || images.length === 0) {
      return setError("Please fill in all required fields and add images.");
    }

    setLoading(true);

    try {
      // 1️⃣ Upload all images
      const imageUrls = [];
      for (const file of images) {
        const imgRef = ref(
          storage,
          `productImages/${currentUser.uid}/${Date.now()}-${file.name}`
        );
        await uploadBytes(imgRef, file);
        const downloadUrl = await getDownloadURL(imgRef);
        imageUrls.push(downloadUrl);
      }

      // 2️⃣ Save product to Firestore
      await addDoc(collection(db, "products"), {
        ...form,
        currentPrice: Number(form.currentPrice),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        ownerId: currentUser.uid,
        ownerName: currentUser.name,
        images: imageUrls,
        stockStatus: "In stock",
        restockHistory: [],
        reviews: 0,
        createdAt: serverTimestamp(),
      });

      alert("Product created successfully!");
      setForm({
        name: "",
        description: "",
        category: "",
        currentPrice: "",
        oldPrice: "",
        unit: "",
        availability: "",
        minOrder: "",
        tags: "",
      });
      setImages([]);
    } catch (err) {
      console.error(err);
      setError("Product creation failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-5 text-gray-800 dark:text-white"
      >
        Add New Product
      </motion.h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Input label="Product Name *" name="name" value={form.name} onChange={handleChange} />
        <Input label="Category" name="category" value={form.category} onChange={handleChange} />

        <Input label="Current Price (₦) *" type="number" name="currentPrice" value={form.currentPrice} onChange={handleChange} />
        <Input label="Old Price (₦)" type="number" name="oldPrice" value={form.oldPrice} onChange={handleChange} />

        <Input label="Unit (kg, bags, litres…)" name="unit" value={form.unit} onChange={handleChange} />
        <Input label="Availability (e.g., Year-round)" name="availability" value={form.availability} onChange={handleChange} />

        <Input label="Minimum Order (e.g., 25kg)" name="minOrder" value={form.minOrder} onChange={handleChange} />

        <Input
          label="Tags (comma separated)"
          name="tags"
          placeholder="fresh, organic, bulk"
          value={form.tags}
          onChange={handleChange}
          full
        />
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white"
        ></textarea>
      </div>

      {/* Images */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Product Images *</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 mt-6 rounded-lg flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Product"}
      </button>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text", placeholder = "", full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white"
    />
  </div>
);

export default ProductCreate;
