"use client";
import React, { useState, useEffect } from "react";
import { PencilIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function MyAccountSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

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
      connErrorMsg: "Error connecting to server"
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
      connErrorMsg: "خطأ في الاتصال بالخادم"
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

  // دالة رفع الصورة الجديدة
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

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

    // 3. تحديث الرابط في الـ state
    setUserData({ ...userData, profileImage: publicUrl });
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
          <h2 className="text-xl font-bold pb-2 dark:border-zinc-800">{currentText.personalInfo}</h2>
          
          <div className="flex justify-center mb-8">
            <label className="relative cursor-pointer">
              <div className="w-45 h-45 md:w-60 md:h-60 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-4xl text-zinc-400 overflow-hidden hover:opacity-80 transition">
                {userData.profileImage ? (
                    <img src={userData.profileImage} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                    userData.fullName?.charAt(0) || "JD"
                )}
              </div>
              {/* مدخل الملف المخفي */}
              <input type="file" className="hidden" onChange={handleImageUpload} disabled={!isEditing} />
              
              
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
              <InputField label={currentText.oldPassword} type="password" placeholder="••••••••" value={passwords.oldPassword} onChange={(v:any) => setPasswords({...passwords, oldPassword: v})} disabled={!isEditing} />
              <InputField label={currentText.newPassword} type="password" placeholder="••••••••" value={passwords.newPassword} onChange={(v:any) => setPasswords({...passwords, newPassword: v})} disabled={!isEditing} />
            </div>
          </div>
        </section>

        {/* زر التحكم */}
        <div className={`flex ${lang === "ar" ? "justify-start" : "justify-end"} pt-6`}>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-6 py-2 md:px-8 md:py-3 bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition"
          >
            {isEditing ? currentText.saveChanges : currentText.editProfile}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, disabled, type = "text", placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-zinc-500 flex items-center gap-2">{label}</label>
      <input 
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full p-4 rounded-xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 outline-none focus:ring-2 ring-[#D6C88A] disabled:opacity-70 transition-all"
      />
    </div>
  );
}