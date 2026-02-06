"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Save, Loader2 } from "lucide-react";

interface SettingValue {
  [key: string]: any;
}

export default function AdminPengaturanPage() {
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State untuk masing-masing tab
  const [whatsappSettings, setWhatsappSettings] = useState({
    number: "",
    display: "",
  });
  
  const [storeInfo, setStoreInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    hours: "",
  });
  
  const [socialMedia, setSocialMedia] = useState({
    instagram: "",
    facebook: "",
    tiktok: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Load semua pengaturan sekaligus
      const { data: settings, error } = await supabase
        .from("settings")
        .select("key, value");

      if (error) throw error;

      // Proses data pengaturan
      const settingsMap: { [key: string]: any } = {};
      settings?.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });

      // Set state berdasarkan key
      if (settingsMap.whatsapp_number) {
        setWhatsappSettings(settingsMap.whatsapp_number);
      }
      
      if (settingsMap.store_info) {
        setStoreInfo(settingsMap.store_info);
      }
      
      if (settingsMap.social_media) {
        setSocialMedia(settingsMap.social_media);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat pengaturan");
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (key: string, value: SettingValue) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const supabase = createClient();
      const { error } = await supabase
        .from("settings")
        .upsert(
          {
            key,
            value,
          },
          { onConflict: "key" }
        );

      if (error) throw error;

      setSuccess("Pengaturan berhasil disimpan!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan pengaturan");
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWhatsapp = async () => {
    await saveSettings("whatsapp_number", whatsappSettings);
  };

  const handleSaveStoreInfo = async () => {
    await saveSettings("store_info", storeInfo);
  };

  const handleSaveSocialMedia = async () => {
    await saveSettings("social_media", socialMedia);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 bg-gray-100 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Toko</h1>
        <p className="text-gray-600 mt-2">Atur informasi dan pengaturan toko Anda</p>
      </div>

      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
          {success}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whatsapp">Nomor WhatsApp</TabsTrigger>
          <TabsTrigger value="info">Informasi Toko</TabsTrigger>
          <TabsTrigger value="social">Media Sosial</TabsTrigger>
        </TabsList>

        {/* Tab Nomor WhatsApp */}
        <TabsContent value="whatsapp" className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nomor WhatsApp</h2>
            <p className="text-gray-600 mb-6">Nomor WhatsApp untuk kontak pelanggan</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="whatsapp-number" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor WhatsApp (Format Internasional)
                </label>
                <Input
                  id="whatsapp-number"
                  value={whatsappSettings.number}
                  onChange={(e) => setWhatsappSettings({...whatsappSettings, number: e.target.value})}
                  placeholder="Contoh: 6281234567890"
                />
                <p className="mt-1 text-xs text-gray-500">Gunakan format internasional tanpa tanda +</p>
              </div>
              
              <div>
                <label htmlFor="whatsapp-display" className="block text-sm font-medium text-gray-700 mb-1">
                  Tampilan Nomor (untuk ditampilkan)
                </label>
                <Input
                  id="whatsapp-display"
                  value={whatsappSettings.display}
                  onChange={(e) => setWhatsappSettings({...whatsappSettings, display: e.target.value})}
                  placeholder="Contoh: 0812-3456-7890"
                />
                <p className="mt-1 text-xs text-gray-500">Format nomor yang akan ditampilkan di website</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleSaveWhatsapp} 
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Pengaturan</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab Informasi Toko */}
        <TabsContent value="info" className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Toko</h2>
            <p className="text-gray-600 mb-6">Detail informasi toko Anda</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Toko
                </label>
                <Input
                  id="store-name"
                  value={storeInfo.name}
                  onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})}
                  placeholder="Nama toko Anda"
                />
              </div>
              
              <div>
                <label htmlFor="store-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Toko
                </label>
                <Textarea
                  id="store-address"
                  value={storeInfo.address}
                  onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})}
                  placeholder="Alamat toko Anda"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="store-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <Input
                  id="store-phone"
                  value={storeInfo.phone}
                  onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})}
                  placeholder="Nomor telepon toko"
                />
              </div>
              
              <div>
                <label htmlFor="store-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="store-email"
                  type="email"
                  value={storeInfo.email}
                  onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})}
                  placeholder="Email toko"
                />
              </div>
              
              <div>
                <label htmlFor="store-hours" className="block text-sm font-medium text-gray-700 mb-1">
                  Jam Operasional
                </label>
                <Input
                  id="store-hours"
                  value={storeInfo.hours}
                  onChange={(e) => setStoreInfo({...storeInfo, hours: e.target.value})}
                  placeholder="Jam operasional toko"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleSaveStoreInfo} 
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Pengaturan</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab Media Sosial */}
        <TabsContent value="social" className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Media Sosial</h2>
            <p className="text-gray-600 mb-6">Tautan akun media sosial toko Anda</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="social-instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <Input
                  id="social-instagram"
                  value={socialMedia.instagram}
                  onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
                  placeholder="https://instagram.com/nama_akun"
                />
              </div>
              
              <div>
                <label htmlFor="social-facebook" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <Input
                  id="social-facebook"
                  value={socialMedia.facebook}
                  onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
                  placeholder="https://facebook.com/nama_akun"
                />
              </div>
              
              <div>
                <label htmlFor="social-tiktok" className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok
                </label>
                <Input
                  id="social-tiktok"
                  value={socialMedia.tiktok}
                  onChange={(e) => setSocialMedia({...socialMedia, tiktok: e.target.value})}
                  placeholder="https://tiktok.com/@nama_akun"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleSaveSocialMedia} 
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Pengaturan</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}