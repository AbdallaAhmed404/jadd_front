
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Send, Paperclip, Loader2, MapPin, Trash2 } from "lucide-react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import dynamic from "next/dynamic";

// استيراد الخريطة ديناميكياً لمنع أخطاء الـ SSR و window is not defined
const MapWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading Map...</div>
});

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeChatId: string | null;
}

export default function ChatDrawer({ isOpen, onClose, activeChatId }: ChatDrawerProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [activeChat, setActiveChat] = useState<string | null>(activeChatId);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [showMapModal, setShowMapModal] = useState(false);
  // جعل الإحداثيات الافتراضية مسقط، عُمان
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([23.5880, 58.3829]);
  const [isSendingLocation, setIsSendingLocation] = useState(false);

  const [lang, setLang] = useState<"en" | "ar">("en");
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);

  useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden"; // قفل سكرول الخلفية
      } else {
        document.body.style.overflow = "unset";  // إعادة السكرول عند الغلق
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isOpen]);

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
      messages: "Messages",
      product: "Product",
      user: "User",
      productName: "Product Name",
      noMessages: "No messages",
      noConversations: "No conversations yet",
      typeMessage: "Type a message...",
      currentLocation: "Selected Location (Google Maps)",
      sendLocation: "Send Location",
      cancel: "Cancel",
      chooseLocation: "Choose Location from Map"
    },
    ar: {
      messages: "الرسائل",
      product: "منتج",
      user: "مستخدم",
      productName: "اسم المنتج",
      noMessages: "لا توجد رسائل",
      noConversations: "لا توجد محادثات بعد",
      typeMessage: "اكتب رسالة...",
      currentLocation: "الموقع المحدد (خرائط جوجل)",
      sendLocation: "إرسال الموقع",
      cancel: "إلغاء",
      chooseLocation: "اختر الموقع من الخريطة"
    }
  };

  const currentText = t[lang];
  const token = typeof window !== "undefined" ? localStorage.getItem("jadd-token") : null;
  const myUserId = useMemo(() => (token ? (jwtDecode(token) as any)?.id : null), [token]);

  const socket = useMemo(() => {
    if (!myUserId) return null;
    return io(`${process.env.NEXT_PUBLIC_API_URL}`, { auth: { userId: myUserId } });
  }, [myUserId]);

  useEffect(() => {
    if (isOpen && !activeChat && token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/conversations`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setConversations(data));
    }
  }, [isOpen, activeChat, token]);

  useEffect(() => {
    setActiveChat(activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (msg: any) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv._id === msg.conversationId) {
            return {
              ...conv,
              lastMessage: msg.text,
              unreadCount: activeChat !== msg.conversationId ? (conv.unreadCount || 0) + 1 : 0
            };
          }
          return conv;
        })
      );

      if (activeChat === msg.conversationId) {
        setMessages((prev) => [...prev, msg]);
        if (msg.senderId !== myUserId) {
          socket.emit("mark_as_read", { conversationId: activeChat });
        }
      }
    });

    socket.on("messages_read", ({ conversationId }) => {
      setConversations((prev) =>
        prev.map(c => c._id === conversationId ? { ...c, unreadCount: 0 } : c)
      );

      if (activeChat === conversationId) {
        setMessages((prev) =>
          prev.map(m => m.senderId === myUserId ? { ...m, isRead: true } : m)
        );
      }
    });

    socket.on("message_deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.off("receive_message");
      socket.off("messages_read");
      socket.off("message_deleted");
    };
  }, [activeChat, socket, myUserId]);

  useEffect(() => {
    if (activeChat && token) {
      socket?.emit("join_chat", activeChat);
      socket?.emit("mark_as_read", { conversationId: activeChat });

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${activeChat}/messages`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setMessages(data));
    }
  }, [activeChat, token, socket]);

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/deleteMessage/${messageId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete message");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !activeChat) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ conversationId: activeChat, text })
    });
    if (res.ok) setText("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;

    setIsUploading(true);
    setUploadingFileName(file.name); // حفظ اسم الملف الجاري رفعه لعرضه في التخطيط
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/get-upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          folder: "chat-files",
          filename: file.name,
          contentType: file.type
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to get upload URL");

      const uploadRes = await fetch(data.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file to R2");

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: activeChat,
          text: data.publicUrl
        })
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadingFileName(null); // مسح الاسم عند الانتهاء
      e.target.value = "";
    }
  };

  const handleConfirmLocation = async () => {
    if (!activeChat) return;
    setIsSendingLocation(true);
    const mapUrl = `https://www.google.com/maps?q=${selectedCoords[0]},${selectedCoords[1]}`;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: activeChat,
          text: mapUrl
        })
      });
      setShowMapModal(false);
    } catch (error) {
      console.error("Failed to send location:", error);
    } finally {
      setIsSendingLocation(false);
    }
  };

  const currentConversation = conversations.find(c => c._id === activeChat);
  const otherUser = currentConversation?.participants.find((p: any) => p._id !== myUserId);
  const product = currentConversation?.productId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-[99]" />
          <motion.div
            initial={{ x: lang === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: lang === "ar" ? "-100%" : "100%" }}
            className={`fixed top-0 ${lang === "ar" ? "left-0" : "right-0"} z-[99999] h-full w-full md:w-[400px] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col`}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="h-16 border-b flex items-center px-4 justify-between">
              <div className="flex items-center gap-3">
                {activeChat ? (
                  <>
                    <button onClick={() => { setActiveChat(null); setMessages([]); }}>
                      <ArrowLeft size={20} className={lang === "ar" ? "rotate-180" : ""} />
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-zinc-200 overflow-hidden flex items-center justify-center font-bold shrink-0">
                        {product?.images?.[0] ? (
                          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                        ) : "📦"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-black dark:text-white line-clamp-1">
                          {product?.title || currentText.product}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {otherUser?.fullName || currentText.user}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="font-bold text-lg">{currentText.messages}</span>
                )}
              </div>

              {!activeChat && (
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!activeChat ? (
                conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-400 text-sm">
                    <p>{currentText.noConversations}</p>
                  </div>
                ) : (
                  conversations.map((conv: any) => {
                    const participant = conv.participants.find((p: any) => p._id !== myUserId);
                    const convProduct = conv.productId;

                    return (
                      <div
                        key={conv._id}
                        onClick={() => setActiveChat(conv._id)}
                        className="p-3 border-b hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer flex items-center justify-between rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-12 h-12 rounded-lg bg-zinc-200 overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                            {convProduct?.images?.[0] ? (
                              <img src={convProduct.images[0]} alt={convProduct.title} className="w-full h-full object-cover" />
                            ) : "📦"}
                          </div>

                          <div className="flex flex-col truncate">
                            <span className="text-xs text-zinc-500">{participant?.fullName || currentText.user}</span>
                            <p className="font-bold text-sm text-black dark:text-white truncate">{convProduct?.title || currentText.productName}</p>
                            <p className="text-xs text-zinc-400 truncate">{conv.lastMessage || currentText.noMessages}</p>
                          </div>
                        </div>

                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0 mx-2">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    );
                  })
                )
              ) : (
                <>
                  {messages.map((m, i) => {
                    const isVideo = /\.(mp4|mov|webm)$/i.test(m.text);
                    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(m.text) || (m.text.includes("chat-files") && !isVideo);
                    const isMapLocation = m.text.includes("google.com/maps");
                    const isLink = m.text.startsWith("http");

                    return (
                      <div key={i} className={`flex items-end gap-2 group relative ${m.senderId === myUserId ? "justify-end" : "justify-start"}`}>

                        {/* زر الحذف ظاهر دائماً لرسائلك */}
                        {m.senderId === myUserId && (
                          <button
                            onClick={() => handleDeleteMessage(m._id)}
                            className=" text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full shrink-0"
                          
                          >
                            <Trash2 size={15} />
                          </button>
                        )}

                        <div className={`p-2 pb-6 px-3 rounded-[10px] text-sm max-w-[80%] relative ${m.senderId === myUserId ? "bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800"}`}>

                          {isLink && isVideo ? (
                            <video src={m.text} controls className="max-w-full rounded-lg max-h-60 object-contain mt-1" />
                          ) : isLink && isImage ? (
                            <a href={m.text} target="_blank" rel="noopener noreferrer">
                              <img src={m.text} alt="attachment" className="max-w-full rounded-lg max-h-60 object-cover mt-1" />
                            </a>
                          ) : isMapLocation ? (
                            <a href={m.text} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline font-semibold py-1 px-2 bg-black/10 dark:bg-white/10 rounded-lg mt-1">
                              <MapPin size={16} />
                              <span>{currentText.currentLocation}</span>
                            </a>
                          ) : isLink ? (
                            <a href={m.text} target="_blank" rel="noopener noreferrer" className="underline break-all">{m.text}</a>
                          ) : (
                            <span>{m.text}</span>
                          )}

                          {m.senderId === myUserId && (
                            <span className={`text-[10px] absolute bottom-1 ${lang === "ar" ? "left-2" : "right-2"}`}>
                              {m.isRead ? "✓✓" : "✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* عرض الرسالة التخطيطية أثناء رفع الملف */}
                  {isUploading && (
                    <div className="flex justify-end">
                      <div className="p-3 rounded-[10px] text-sm max-w-[80%] bg-zinc-200 dark:bg-zinc-800 animate-pulse flex items-center gap-3">
                        <Loader2 size={18} className="animate-spin text-zinc-500 shrink-0" />
                        <div className="flex flex-col gap-1.5">
                          <div className="h-3 w-32 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">
                            جاري رفع: {uploadingFileName || "ملف..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {!activeChat && conversations.length === 0 ? null : <div ref={messagesEndRef} />}
            </div>

            {/* Footer Input */}
            {activeChat && (
              <div className="p-4 border-t flex items-center gap-2">
                <label className={`cursor-pointer p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
                  {isUploading ? <Loader2 size={20} className="animate-spin text-[#232152] dark:text-[#D6C88A]" /> : <Paperclip size={20} className="text-zinc-500" />}
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    // محاولة جلب مكان المستخدم الحالي قبل فتح الخريطة
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setSelectedCoords([position.coords.latitude, position.coords.longitude]);
                          setShowMapModal(true);
                        },
                        () => {
                          // لو المستخدم رفض إعطاء الصلاحية، تفتح الخريطة على المكان الافتراضي (القاهرة)
                          setShowMapModal(true);
                        }
                      );
                    } else {
                      setShowMapModal(true);
                    }
                  }}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title={currentText.chooseLocation}
                >
                  <MapPin size={20} className="text-zinc-500" />
                </button>

                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 h-10 px-3 rounded-full border bg-transparent text-base outline-none md:text-sm"
                  placeholder={currentText.typeMessage}
                />

                <button onClick={handleSend} className="bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black p-2 rounded-full">
                  <Send size={23} />
                </button>
              </div>
            )}
          </motion.div>

          {/* Modal اختيار الموقع */}
          {showMapModal && (
            <div className="fixed inset-0 z-[100000] bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[450px]">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-bold text-black dark:text-white">{currentText.chooseLocation}</h3>
                  <button onClick={() => setShowMapModal(false)} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 w-full relative z-0">
                  <MapWithNoSSR position={selectedCoords} setPosition={setSelectedCoords} />
                </div>

                <div className="p-4 border-t flex justify-end gap-2 bg-zinc-50 dark:bg-zinc-950">
                  <button
                    type="button"
                    onClick={() => setShowMapModal(false)}
                    className="px-4 py-2 rounded-lg border text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    {currentText.cancel}
                  </button>
                  <button
                    onClick={handleConfirmLocation}
                    disabled={isSendingLocation}
                    className="px-4 py-2 rounded-lg bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black text-sm font-semibold flex items-center gap-2"
                  >
                    {isSendingLocation && <Loader2 size={16} className="animate-spin" />}
                    {currentText.sendLocation}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

