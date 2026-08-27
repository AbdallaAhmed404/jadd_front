"use client";
import React, { useState, useEffect, useRef } from "react";
import { PencilIcon, EyeIcon, EyeOffIcon, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// دالة مساعدة لقص الصورة واستخراجها كـ Blob لرفعها
function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/jpeg", 1);
  });
}

export default function MyAccountSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  // حالات خاصة بقص الصورة
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // نظام اللغات المتزامن مع النافبار
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("jadd-lang") as "en" | "ar";
    if (savedLang) {
      setLang(savedLang);
    }
    
    const handleLanguageChange = () => {
      const currentLang = localStorage.getItem("jadd-lang") as "en" | "ar";
      if (currentLang && (currentLang === "en" || currentLang === "ar")) {
        setLang(currentLang);
      }
    };
    
    window.addEventListener("languageChanged", handleLanguageChange);
    
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  const t = {
    en: {
      personalInfo: "Personal Information",
      bio: "Bio",
      fullName: "Full Name",
      location: "Location",
      accountSecurity: "Account & Security",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number",
      oldPassword: "Old Password",
      newPassword: "New Password",
      saveChanges: "Save Changes",
      editProfile: "Edit Profile",
      successMsg: "Profile Updated Successfully",
      errorMsg: "Failed to update profile",
      connErrorMsg: "Error connecting to server",
      cropTitle: "Crop Profile Picture",
      cropButton: "Crop & Upload",
      cancelButton: "Cancel"
    },
    ar: {
      personalInfo: "المعلومات الشخصية",
      bio: "نبذة تعريفية",
      fullName: "الاسم الكامل",
      location: "الموقع",
      accountSecurity: "الحساب والأمان",
      emailAddress: "البريد الإلكتروني",
      phoneNumber: "رقم الهاتف",
      oldPassword: "كلمة المرور القديمة",
      newPassword: "كلمة المرور الجديدة",
      saveChanges: "حفظ التغييرات",
      editProfile: "تعديل الملف الشخصي",
      successMsg: "تم تحديث الملف الشخصي بنجاح",
      errorMsg: "فشل تحديث الملف الشخصي",
      connErrorMsg: "خطأ في الاتصال بالخادم",
      cropTitle: "قص الصورة الشخصية",
      cropButton: "قص ورفع",
      cancelButton: "إلغاء"
    }
  };

  const currentText = t[lang];

  // 1. جلب البيانات
  useEffect(() => {
    const token = localStorage.getItem("jadd-token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setUserData(data));
  }, []);

  // اختيار الصورة وفتح نافذة القص
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
      reader.readAsDataURL(e.target.files[0]);
      setShowCropModal(true);
    }
  };

  // تهيئة الإطار الافتراضي للقص بنسبة 1:1 (مربع)
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = 80;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: cropWidthInPercent,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  // دالة الرفع بعد اتمام القص
  const handleCropAndUpload = async () => {
    if (!imgRef.current || !completedCrop) return;

    try {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });

      const token = localStorage.getItem("jadd-token");

      // 1. طلب الـ Signed URL من الباك إند
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/get-upload-url`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ folder: "profiles", filename: file.name, contentType: file.type })
      });
      const { signedUrl, publicUrl } = await res.json();

      // 2. الرفع المباشر لـ Cloudflare R2
      await fetch(signedUrl, { method: "PUT", body: file });

      // 3. تحديث الرابط في الـ state وإغلاق نافذة القص
      setUserData({ ...userData, profileImage: publicUrl });
      setShowCropModal(false);
    } catch (error) {
      toast.error(currentText.errorMsg);
    }
  };

  // 2. دالة الحفظ
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jadd-token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ ...userData, ...passwords })
      });
      
      if (response.ok) {
        setIsEditing(false);
        setPasswords({ oldPassword: "", newPassword: "" });
        toast.success(currentText.successMsg);
      } else {
        // إذا فشل الـ Request لأسباب منطقية (مثل خطأ في كلمة المرور القديمة)
        toast.error(currentText.errorMsg);
      }
    } catch (error) {
      toast.error(currentText.connErrorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors p-6 md:p-12 text-zinc-900 dark:text-zinc-100" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* القسم الأول: المعلومات الشخصية */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b dark:border-zinc-800">
            <h2 className="text-xl font-bold">{currentText.personalInfo}</h2>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black font-semibold text-sm rounded-xl hover:opacity-90 transition"
            >
              {isEditing ? currentText.saveChanges : currentText.editProfile}
            </button>
          </div>
          
          <div className="flex justify-center mb-8">
            <label className={`relative ${isEditing ? "cursor-pointer" : "cursor-default"}`}>
              <div className="w-45 h-45 md:w-60 md:h-60 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-4xl text-zinc-400 overflow-hidden hover:opacity-80 transition">
                {userData.profileImage ? (
                    <img src={userData.profileImage} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                    userData.fullName?.charAt(0) || "JD"
                )}
              </div>
              {/* مدخل الملف المخفي */}
              {isEditing && (
                <input type="file" accept="image/*" className="hidden" onChange={onSelectFile} />
              )}
            </label>
          </div>

          <div className="grid gap-6">
            <InputField label={currentText.fullName} value={userData.fullName} onChange={(v:any) => setUserData({...userData, fullName: v})} disabled={!isEditing} />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-500 flex items-center gap-2"> {currentText.bio}</label>
              <textarea disabled={!isEditing} className="w-full p-4 rounded-xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 outline-none focus:ring-2 ring-[#D6C88A]" rows={3} value={userData.bio || ""} onChange={(e) => setUserData({...userData, bio: e.target.value})} />
            </div>
          </div>
        </section>

        {/* القسم الثاني: الحساب والأمان */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold pb-2 dark:border-zinc-800">{currentText.accountSecurity}</h2>
          
          <div className="grid gap-6">
            <InputField label={currentText.emailAddress} value={userData.email} disabled={true} />
            <InputField label={currentText.phoneNumber} value={userData.phone} onChange={(v:any) => setUserData({...userData, phone: v})} disabled={!isEditing} />
            
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t dark:border-zinc-800">
              <InputField label={currentText.oldPassword} type="password" placeholder="••••••••" value={passwords.oldPassword} onChange={(v:any) => setPasswords({...passwords, oldPassword: v})} disabled={!isEditing} isPassword={true} />
              <InputField label={currentText.newPassword} type="password" placeholder="••••••••" value={passwords.newPassword} onChange={(v:any) => setPasswords({...passwords, newPassword: v})} disabled={!isEditing} isPassword={true} />
            </div>
          </div>
        </section>
      </div>

      {/* نافذة (Modal) قص وتحديد الصورة */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border dark:border-zinc-800">
            <div className="flex items-center justify-between border-b dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold">{currentText.cropTitle}</h3>
              <button 
                onClick={() => setShowCropModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center max-h-[60vh] overflow-auto">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Crop Source"
                    onLoad={onImageLoad}
                    style={{ maxHeight: "50vh" }}
                  />
                </ReactCrop>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:opacity-80 transition"
              >
                {currentText.cancelButton}
              </button>
              <button
                type="button"
                onClick={handleCropAndUpload}
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black hover:opacity-90 transition"
              >
                {currentText.cropButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, disabled, type = "text", placeholder, isPassword = false }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const showEyeIcon = isPassword && !disabled;
  const inputType = showEyeIcon ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-zinc-500 flex items-center gap-2">{label}</label>
      <div className="relative">
        <input 
          type={inputType}
          disabled={disabled}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full p-4 rounded-xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 outline-none focus:ring-2 ring-[#D6C88A] disabled:opacity-70 transition-all ${showEyeIcon ? "pr-12" : ""}`}
        />
        {showEyeIcon && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-4 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}