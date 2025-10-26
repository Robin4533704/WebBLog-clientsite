import React, { useState, useRef, useEffect } from "react";
import useAuth from "../hook/UseAuth";
import { toast } from "react-hot-toast";
import useUserAxios from "../hook/useUserAxios";
import { motion } from "framer-motion";

const categories = ["Tech", "Lifestyle", "Travel", "Food", "Health", "Freelancer", "Business", "Education"];
const allTags = ["React", "JavaScript", "CSS", "HTML", "Node", "Express", "MongoDB", "Design", "Python", "UI/UX"];

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
  const [newTag, setNewTag] = useState("");

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

  const toggleTag = (tag) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter((t) => t !== tag) 
        : [...prev, tag]
    );
  };

  const toggleCategory = (cat) => {
    setCategory(prev =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const addNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const removeCategory = (catToRemove) => {
    setCategory(prev => prev.filter(cat => cat !== catToRemove));
  };

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
      author: { 
        email: user.email, 
        fullName: user.displayName || user.name || "Anonymous",
        photoURL: user.photoURL || ""
      },
      status: "approved",
      likes: 0,
      likedUsers: [],
      reviews: [],
      createdAt: new Date()
    };

    try {
      setLoading(true);
      await axiosIntals("/blogs", { method: "POST", data: blogData });
      toast.success("✅ Blog added successfully!");
      
      // Reset form
      setTitle(""); 
      setImage(""); 
      setContent(""); 
      setTags([]); 
      setCategory([]); 
      setPrice(""); 
      setCatSearch(""); 
      setTagSearch("");
      setNewTag("");
    } catch (err) {
      console.error("Failed to add blog", err);
      toast.error("❌ Failed to add blog. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) => 
    cat.toLowerCase().includes(catSearch.toLowerCase())
  );
  
  const filteredTags = allTags.filter((tag) => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto p-4 md:p-6 bg-gradient-to-br from-amber-50 to-orange-50 shadow-2xl rounded-2xl mt-6 md:mt-10 mb-8"
    >
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-center text-gray-800 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"
      >
        Create New Blog Post
      </motion.h2>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Image Upload Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4 lg:w-2/5"
        >
          <label className="font-semibold text-gray-900 text-lg">Featured Image</label>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-3 border-dashed border-amber-300 rounded-2xl p-4 md:p-6 text-center cursor-pointer bg-white hover:border-amber-500 transition-all duration-300 shadow-lg"
            onClick={() => document.getElementById("fileInput").click()}
          >
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-48 md:h-64 object-cover rounded-xl shadow-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="py-8 md:py-12">
                <div className="text-4xl md:text-6xl text-amber-400 mb-3">📷</div>
                <p className="text-gray-600 font-medium">Click to upload image</p>
                <p className="text-gray-400 text-sm mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
          </motion.div>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              
              // File size check (5MB)
              if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
              }
              
              const reader = new FileReader();
              reader.onloadend = () => setImage(reader.result);
              reader.readAsDataURL(file);
            }}
            className="hidden"
          />

          {/* Selected Categories Display */}
          {category.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <label className="font-semibold text-gray-900 mb-2 block">Selected Categories:</label>
              <div className="flex flex-wrap gap-2">
                {category.map((cat, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => removeCategory(cat)}
                      className="hover:text-amber-200 text-xs"
                    >
                      ✕
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Selected Tags Display */}
          {tags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <label className="font-semibold text-gray-900 mb-2 block">Selected Tags:</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-orange-200 text-xs"
                    >
                      ✕
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Form Section */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-5 md:gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Title */}
          <div>
            <label className="font-semibold text-gray-900 text-lg mb-2 block">Blog Title</label>
            <motion.input
              whileFocus={{ scale: 1.02, borderColor: "#f59e0b" }}
              type="text"
              placeholder="Enter captivating title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input input-bordered w-full bg-white border-2 border-gray-200 rounded-xl h-12 text-lg focus:border-amber-500 transition"
            />
          </div>

          {/* Content */}
          <div>
            <label className="font-semibold text-gray-900 text-lg mb-2 block">Blog Content</label>
            <motion.textarea
              whileFocus={{ scale: 1.02, borderColor: "#f59e0b" }}
              placeholder="Write your amazing content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="textarea textarea-bordered w-full bg-white border-2 border-gray-200 rounded-xl min-h-[150px] md:min-h-[200px] text-lg focus:border-amber-500 transition resize-vertical"
              rows={8}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Category Search */}
            <div ref={catRef} className="relative">
              <label className="font-semibold text-gray-900 text-lg mb-2 block">Categories</label>
              <input
                type="text"
                placeholder="Search categories..."
                value={catSearch}
                onChange={(e) => { 
                  setCatSearch(e.target.value); 
                  setShowCatDropdown(true); 
                }}
                onFocus={() => setShowCatDropdown(true)}
                className="input input-bordered w-full bg-white border-2 border-gray-200 rounded-xl h-12 focus:border-amber-500 transition"
              />
              {showCatDropdown && filteredCategories.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 bg-white border-2 border-amber-200 rounded-xl mt-2 max-h-48 overflow-y-auto w-full shadow-xl"
                >
                  {filteredCategories.map((cat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`px-4 py-3 cursor-pointer border-b border-amber-50 last:border-b-0 transition ${
                        category.includes(cat) 
                          ? "bg-amber-500 text-white font-medium" 
                          : "hover:bg-amber-50 text-gray-700"
                      }`}
                      onClick={() => {
                        toggleCategory(cat);
                        setCatSearch("");
                        setShowCatDropdown(false);
                      }}
                    >
                      {cat}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Tags Search */}
            <div ref={tagRef} className="relative">
              <label className="font-semibold text-gray-900 text-lg mb-2 block">Tags</label>
              <input
                type="text"
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => { 
                  setTagSearch(e.target.value); 
                  setShowTagDropdown(true); 
                }}
                onFocus={() => setShowTagDropdown(true)}
                className="input input-bordered w-full bg-white border-2 border-gray-200 rounded-xl h-12 focus:border-orange-500 transition"
              />
              {showTagDropdown && filteredTags.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 bg-white border-2 border-orange-200 rounded-xl mt-2 max-h-48 overflow-y-auto w-full shadow-xl"
                >
                  {filteredTags.map((tag, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`px-4 py-3 cursor-pointer border-b border-orange-50 last:border-b-0 transition ${
                        tags.includes(tag) 
                          ? "bg-orange-500 text-white font-medium" 
                          : "hover:bg-orange-50 text-gray-700"
                      }`}
                      onClick={() => {
                        toggleTag(tag);
                        setTagSearch("");
                        setShowTagDropdown(false);
                      }}
                    >
                      {tag}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Add Custom Tag */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewTag())}
              className="input input-bordered flex-1 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 transition"
            />
            <motion.button
              type="button"
              onClick={addNewTag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn bg-orange-500 text-white border-none hover:bg-orange-600 rounded-xl px-6"
            >
              Add Tag
            </motion.button>
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold text-gray-900 text-lg mb-2 block">Price (Optional)</label>
            <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 focus-within:border-amber-500 transition">
              <span className="text-2xl text-amber-600 font-bold">$</span>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input input-ghost w-full py-3 text-lg border-none focus:outline-none"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="btn bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold py-4 mt-4 rounded-xl shadow-lg hover:shadow-xl transition-all border-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="loading loading-spinner loading-sm"></div>
                Publishing...
              </span>
            ) : (
              "📝 Publish Blog"
            )}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default AddBlog;