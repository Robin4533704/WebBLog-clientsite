// src/utils/uploadImage.js
export const uploadImageToImgbb = async (file) => {
  const key = import.meta.env.VITE_IMGBB_KEY;
  if (!key) throw new Error("Imgbb API key missing!");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error("Image upload failed!");
  return data.data.display_url;
};
export default uploadImageToImgbb;