import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUserAxios from "../hook/useUserAxios";
import Swal from "sweetalert2";
import Loading from "./Loading";
import { getAuth } from "firebase/auth";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axiosIntals, loading } = useUserAxios();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ title: "", image: "", content: "", category: "", tags: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      Swal.fire("Login Required", "Please login to edit a blog", "warning");
      navigate("/login");
    } else setUser(auth.currentUser);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosIntals(`/blogs/${id}`);
        setForm({
          title: res.title,
          image: res.image,
          content: res.content,
          category: res.category,
          tags: res.tags?.join(", ") || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load blog");
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosIntals(`/blogs/${id}`, { method: "PUT", data: { ...form, tags: form.tags.split(",").map(t => t.trim()) } });
      Swal.fire("Success!", "Blog updated successfully", "success");
      navigate("/dashboard/myblogs");
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to update blog", "error");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-5 bg-white shadow rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-5">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input name="image" value={form.image} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <textarea name="content" value={form.content} onChange={handleChange} rows={6} required className="w-full border px-3 py-2 rounded" />
        <input name="tags" value={form.tags} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="category" value={form.category} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <button type="submit" className="w-full bg-amber-500 text-white px-6 py-2 rounded">Update Blog</button>
      </form>
    </div>
  );
};

export default EditBlog;
