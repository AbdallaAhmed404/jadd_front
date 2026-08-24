"use client";

import React, { useState, useEffect } from "react";
import { Camera, Video, Loader2, MapPin, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: {
    ar: string;
    en: string;
  };
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    latitude: "",
    longitude: ""
  });

  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("jadd-lang") as "en" | "ar";
    if (savedLang) setLang(savedLang);

    const handleLanguageChange = () => {
      const currentLang = localStorage.getItem("jadd-lang") as "en" | "ar";
      if (currentLang && (currentLang === "en" || currentLang === "ar")) {
        setLang(currentLang);
      }
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  const t = {
    en: {
      uploadText: "Upload up to 7 photos & 1 video",
      titlePlaceholder: "Ad Title",
      descPlaceholder: "Product Description...",
      pricePlaceholder: "Price (OMR)",
      selectCategory: "Select Category",
      condition: "Condition",
      new: "New",
      likeNew: "Like New",
      usedClean: "Used - Clean",
      usedFair: "Used - Fair",
      getLocation: "Detect My Location (GPS)",
      locationCaptured: "Location Captured Successfully!",
      locationRequired: "Please detect your location using GPS",
      publish: "Publish Listing",
      successMsg: "Listing published successfully!",
      errorMsg: "Something went wrong. Please try again."
    },
    ar: {
      uploadText: "ارفع حتى 7 صور وفيديو واحد",
      titlePlaceholder: "عنوان الإعلان",
      descPlaceholder: "وصف المنتج...",
      pricePlaceholder: "السعر (رع)",
      selectCategory: "اختر القسم",
      condition: "الحالة",
      new: "جديد",
      likeNew: "كأنه جديد",
      usedClean: "مستعمل نظيف",
      usedFair: "مستعمل مقبول",
      getLocation: "تحديد موقعي الحالي (GPS)",
      locationCaptured: "تم تحديث الموقع بنجاح!",
      locationRequired: "يرجى تحديد موقعك الجغرافي عبر الـ GPS",
      publish: "نشر الإعلان",
      successMsg: "تم نشر الإعلان بنجاح!",
      errorMsg: "حدث خطأ ما. يرجى المحاولة مرة أخرى."
    }
  };

  const currentText = t[lang];

  useEffect(() => {
    fetch("https://jadd-production-275a.up.railway.app/user/categories")
      .then((res) => res.json())
      .then((data) => {
        const cats = data.data || (Array.isArray(data) ? data : []);
        setCategories(cats);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // دالة التقاط الموقع الجغرافي للبائع
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        setLocating(false);
        toast.success(currentText.locationCaptured);
      },
      (error) => {
        setLocating(false);
        toast.error("Unable to retrieve your location. Please allow location access.");
        console.error(error);
      }
    );
  };

  const handleMixedFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      const newImages = filesArray.filter(file => file.type.startsWith("image/"));
      const newVideo = filesArray.find(file => file.type.startsWith("video/"));

      if (newImages.length > 0) {
        setImageFiles((prev) => [...prev, ...newImages].slice(0, 7));
      }

      if (newVideo) {
        setVideoFile(newVideo);
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      toast.error(currentText.locationRequired);
      return;
    }

    setLoading(true);

    try {
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const res = await fetch("https://jadd-production-275a.up.railway.app/user/get-upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folder: "products", filename: file.name, contentType: file.type }),
          });
          const { signedUrl, publicUrl } = await res.json();
          await fetch(signedUrl, { method: "PUT", body: file });
          return publicUrl;
        })
      );

      let videoUrl = "";
      if (videoFile) {
        const res = await fetch("https://jadd-production-275a.up.railway.app/user/get-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: "products", filename: videoFile.name, contentType: videoFile.type }),
        });
        const { signedUrl, publicUrl } = await res.json();
        await fetch(signedUrl, { method: "PUT", body: videoFile });
        videoUrl = publicUrl;
      }

      const response = await fetch("https://jadd-production-275a.up.railway.app/user/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jadd-token")}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          condition: formData.condition,
          images: imageUrls,
          video: videoUrl,
          location: {
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude)
          }
        }),
      });

      if (!response.ok) throw new Error("Failed to save product");

      toast.success(currentText.successMsg);
      router.push("/");
    } catch (error) {
      toast.error(currentText.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const hasMedia = imageFiles.length > 0 || videoFile !== null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-zinc-950 p-6 md:p-12" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {hasMedia && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-2">
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {videoFile && (
                  <div className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                    <video
                      src={URL.createObjectURL(videoFile)}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {(imageFiles.length < 7 || !videoFile) && (
              <label className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-8 flex flex-col items-center justify-center text-zinc-400 hover:border-[#D6C88A] transition-colors cursor-pointer bg-white dark:bg-zinc-900">
                
                <span className="text-xs font-bold text-center">
                  {currentText.uploadText}
                </span>
                <input type="file" multiple accept="image/*,video/*" onChange={handleMixedFilesChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="grid gap-4">
            <input name="title"  onChange={handleChange} value={formData.title} placeholder={currentText.titlePlaceholder} className="w-full h-12 px-4 rounded-xl border bg-white dark:bg-zinc-900 text-sm font-semibold focus:border-[#D6C88A] outline-none" />
            <textarea name="description"  onChange={handleChange} value={formData.description} placeholder={currentText.descPlaceholder} className="w-full h-32 p-4 rounded-xl border bg-white dark:bg-zinc-900 text-sm font-semibold focus:border-[#D6C88A] outline-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="price" type="number"  onChange={handleChange} value={formData.price} placeholder={currentText.pricePlaceholder} className="w-full h-12 px-4 rounded-xl border bg-white dark:bg-zinc-900 text-sm font-semibold focus:border-[#D6C88A] outline-none" />

              <select name="category"  onChange={handleChange} value={formData.category} className="w-full h-12 px-4 rounded-xl border bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-500 focus:border-[#D6C88A] outline-none">
                <option value="">{currentText.selectCategory}</option>
                {categories.map((cat) => {
                  const categoryName = lang === "ar" ? cat.name.ar : cat.name.en;
                  return (
                    <option key={cat._id} value={cat._id}>
                      {categoryName}
                    </option>
                  );
                })}
              </select>
            </div>

            <select name="condition"  onChange={handleChange} value={formData.condition} className="w-full h-12 px-4 rounded-xl border bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-500 focus:border-[#D6C88A] outline-none">
              <option value="">{currentText.condition}</option>
              <option value="New">{currentText.new}</option>
              <option value="Like New">{currentText.likeNew}</option>
              <option value="Used - Clean">{currentText.usedClean}</option>
              <option value="Used - Fair">{currentText.usedFair}</option>
            </select>

            {/* زر تحديد الموقع الجغرافي */}
            <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border rounded-xl p-4">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="flex items-center gap-2 bg-[#1F1547] text-white dark:bg-[#D6C88A] dark:text-[#1F1547] px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
              >
                {locating ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
                {currentText.getLocation}
              </button>
              {formData.latitude && formData.longitude ? (
                <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                  <CheckCircle2 size={16} />
                  <span>{currentText.locationCaptured}</span>
                </div>
              ) : (
                <span className="text-xs text-zinc-400">
                  {lang === "ar" ? "مطلوب لتفعيل الفلترة والترتيب بالأقرب للمشترين" : "Required for distance sorting"}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-[#1F1547] font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : currentText.publish}
          </button>
        </form>
      </div>
    </div>
  );
}