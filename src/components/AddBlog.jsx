import React, { useState, useRef, useEffect } from "react";
import useAuth from "../hook/UseAuth";
import { toast } from "react-hot-toast";
import useUserAxios from "../hook/useUserAxios";
import { motion } from "framer-motion";

const categories = ["Tech", "Lifestyle", "Travel", "Food", "Health", "Freelancer"];
const allTags = ["React", "JavaScript", "CSS", "HTML", "Node", "Express", "MongoDB", "Design"];

const AddBlog = () => {
  const { axiosIntals } = useUserAxios();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const [catSearch, setCatSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const catRef = useRef();
  const tagRef = useRef();
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setShowCatDropdown(false);
      if (tagRef.current && !tagRef.current.contains(e.target)) setShowTagDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTag = (tag) => setTags(tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]);
  const toggleCategory = (cat) =>
    setCategory(category.includes(cat) ? category.filter((c) => c !== cat) : [...category, cat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return toast.error("❌ You must be logged in to add a blog");

    const blogData = {
      title,
      image,
      content,
      category,
      price: parseFloat(price) || 0,
      tags,
      author: { email: user.email, fullName: user.displayName || user.name || "Anonymous" },
      status: "approved",
      likes: 0,
      likedUsers: [],
      reviews: [],
    };

    try {
      setLoading(true);
      await axiosIntals("/blogs", { method: "POST", data: blogData });
      toast.success("✅ Blog added successfully!");
      setTitle(""); setImage(""); setContent(""); setTags([]); setCategory([]); setPrice(""); setCatSearch(""); setTagSearch("");
    } catch (err) {
      console.error("Failed to add blog", err);
      toast.error("❌ Failed to add blog. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) => cat.toLowerCase().includes(catSearch.toLowerCase()));
  const filteredTags = allTags.filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto p-6 bg-[#f8f1cf] shadow-2xl rounded-2xl mt-10"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Add New Blog</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Upload */}
        <div className="flex flex-col gap-4 lg:w-1/2">
          <label className="font-semibold text-gray-900">Select Image</label>
          <div
            className="border-2 border-dashed border-gray-400 rounded-xl p-4 text-center cursor-pointer hover:border-yellow-500 transition"
            onClick={() => document.getElementById("fileInput").click()}
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
            ) : (
              <p className="text-gray-500">Click or drag image here</p>
            )}
          </div>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => setImage(reader.result);
              reader.readAsDataURL(file);
            }}
            className="hidden"
          />
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: "#f59e0b" }}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input input-bordered w-full bg-white border-gray-300 rounded-xl"
          />

          <motion.textarea
            whileFocus={{ scale: 1.02, borderColor: "#f59e0b" }}
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="textarea textarea-bordered w-full bg-white border-gray-300 rounded-xl"
            rows={6}
          />

          {/* Category */}
          <div ref={catRef} className="relative">
            <label className="font-semibold text-gray-900">Categories</label>
            <input
              type="text"
              placeholder="Search category..."
              value={catSearch}
              onChange={(e) => { setCatSearch(e.target.value); setShowCatDropdown(true); }}
              onFocus={() => setShowCatDropdown(true)}
              className="input input-bordered w-full mt-2 rounded-xl"
            />
            {showCatDropdown && filteredCategories.length > 0 && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded-xl mt-1 max-h-40 overflow-y-auto w-full shadow-lg">
                {filteredCategories.map((cat, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 cursor-pointer hover:bg-yellow-200 ${category.includes(cat) ? "bg-yellow-500 text-white" : ""}`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div ref={tagRef} className="relative">
            <label className="font-semibold text-gray-900">Tags</label>
            <input
              type="text"
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(e) => { setTagSearch(e.target.value); setShowTagDropdown(true); }}
              onFocus={() => setShowTagDropdown(true)}
              className="input input-bordered w-full mt-2 rounded-xl"
            />
            {showTagDropdown && filteredTags.length > 0 && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded-xl mt-1 max-h-40 overflow-y-auto w-full shadow-lg">
                {filteredTags.map((tag, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 cursor-pointer hover:bg-yellow-200 ${tags.includes(tag) ? "bg-yellow-500 text-white" : ""}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-lg">$</span>
            <motion.input
              whileFocus={{ scale: 1.02, borderColor: "#f59e0b" }}
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input input-bordered w-full bg-white border-gray-300 rounded-xl"
              min="0"
              step="0.01"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn bg-yellow-500 text-gray-900 hover:bg-yellow-600 py-3 mt-2 text-lg font-semibold rounded-xl"
          >
            {loading ? "Adding..." : "Add Blog"}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default AddBlog;
