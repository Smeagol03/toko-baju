"use client";

import { useState } from "react";
import { Plus, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [newUrl, setNewUrl] = useState("");

  const addImage = () => {
    if (newUrl.trim()) {
      onChange([...images, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group"
          >
            <img
              src={url}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/600x600?text=Invalid+Image";
              }}
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 bg-gray-50/50">
          <ImageIcon className="size-6 text-gray-400 mb-2" />
          <p className="text-[10px] text-center text-gray-500 uppercase font-semibold tracking-wider">
            Preview
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Masukkan URL gambar..."
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImage();
              }
            }}
          />
        </div>
        <Button
          type="button"
          onClick={addImage}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="size-4 mr-2" />
          Tambah
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        💡 Untuk MVP, gunakan URL gambar langsung. Gambar pertama akan menjadi
        thumbnail utama.
      </p>
    </div>
  );
}
