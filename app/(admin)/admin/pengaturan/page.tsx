"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  MessageCircle,
  Store,
  Share2,
  Loader2,
  Save,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TabType = "whatsapp" | "store" | "social";

export default function AdminPengaturanPage() {
  const [activeTab, setActiveTab] = useState<TabType>("whatsapp");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [whatsapp, setWhatsapp] = useState({ number: "", display: "" });
  const [storeInfo, setStoreInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    hours: "",
  });
  const [social, setSocial] = useState({
    instagram: "",
    facebook: "",
    tiktok: "",
  });

  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("settings").select("*");
        if (error) throw error;

        data.forEach((item) => {
          if (item.key === "whatsapp_number") setWhatsapp(item.value as any);
          if (item.key === "store_info") setStoreInfo(item.value as any);
          if (item.key === "social_media") setSocial(item.value as any);
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (key: string, value: any) => {
    setIsSubmitting(true);
    setSuccessMsg(null);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ key, value }, { onConflict: "key" });
      if (error) throw error;
      setSuccessMsg("Pengaturan berhasil disimpan!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="size-8 animate-spin text-blue-600 mb-2" />
        <p className="text-gray-500 text-sm">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="size-6 text-blue-600" />
          Pengaturan Toko
        </h1>
        <p className="text-gray-500 mt-1">
          Kelola informasi kontak dan profil toko Anda.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
          { id: "store", label: "Info Toko", icon: Store },
          { id: "social", label: "Media Sosial", icon: Share2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-50 text-green-700 border border-green-100 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="size-5" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* Active Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {activeTab === "whatsapp" && (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave("whatsapp_number", whatsapp);
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nomor WhatsApp (API Format)
                </label>
                <Input
                  value={whatsapp.number}
                  onChange={(e) =>
                    setWhatsapp({ ...whatsapp, number: e.target.value })
                  }
                  placeholder="628123456789 (Tanpa +, spasi, atau -)"
                />
                <p className="text-xs text-gray-500">
                  Gunakan format internasional tanpa simbol (contoh: 62812...)
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Display Label
                </label>
                <Input
                  value={whatsapp.display}
                  onChange={(e) =>
                    setWhatsapp({ ...whatsapp, display: e.target.value })
                  }
                  placeholder="0812-3456-7890"
                />
              </div>
            </div>
            <Button
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 rounded-xl font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin size-4 mr-2" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Simpan Perubahan
            </Button>
          </form>
        )}

        {activeTab === "store" && (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave("store_info", storeInfo);
            }}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nama Toko
                </label>
                <Input
                  value={storeInfo.name}
                  onChange={(e) =>
                    setStoreInfo({ ...storeInfo, name: e.target.value })
                  }
                  placeholder="Toko Baju Sablon"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  value={storeInfo.email}
                  onChange={(e) =>
                    setStoreInfo({ ...storeInfo, email: e.target.value })
                  }
                  placeholder="info@tokobaju.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>
                <Input
                  value={storeInfo.phone}
                  onChange={(e) =>
                    setStoreInfo({ ...storeInfo, phone: e.target.value })
                  }
                  placeholder="0812-3456-7890"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Jam Operasional
                </label>
                <Input
                  value={storeInfo.hours}
                  onChange={(e) =>
                    setStoreInfo({ ...storeInfo, hours: e.target.value })
                  }
                  placeholder="Senin - Sabtu: 09:00 - 17:00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Alamat Lengkap
              </label>
              <textarea
                className="w-full min-h-[100px] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm shadow-sm"
                value={storeInfo.address}
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, address: e.target.value })
                }
                placeholder="Jl. Contoh No. 123, Kelurahan..."
              />
            </div>
            <Button
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 rounded-xl font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin size-4 mr-2" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Simpan Perubahan
            </Button>
          </form>
        )}

        {activeTab === "social" && (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave("social_media", social);
            }}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Instagram URL
                </label>
                <Input
                  value={social.instagram}
                  onChange={(e) =>
                    setSocial({ ...social, instagram: e.target.value })
                  }
                  placeholder="https://instagram.com/tokobaju"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Facebook URL
                </label>
                <Input
                  value={social.facebook}
                  onChange={(e) =>
                    setSocial({ ...social, facebook: e.target.value })
                  }
                  placeholder="https://facebook.com/tokobaju"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  TikTok URL
                </label>
                <Input
                  value={social.tiktok}
                  onChange={(e) =>
                    setSocial({ ...social, tiktok: e.target.value })
                  }
                  placeholder="https://tiktok.com/@tokobaju"
                />
              </div>
            </div>
            <Button
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 rounded-xl font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin size-4 mr-2" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Simpan Perubahan
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
