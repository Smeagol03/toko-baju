"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(
    images[0] || "https://picsum.photos/seed/detail/800/800",
  );

  return (
    <div className="mb-10 lg:mb-0">
      {/* Main Image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border shadow-sm transition-all duration-300">
        <img
          src={activeImage}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`aspect-square rounded-lg overflow-hidden border bg-gray-50 cursor-pointer hover:opacity-75 transition-all ${
                activeImage === img
                  ? "ring-2 ring-blue-600 border-transparent"
                  : "border-gray-200"
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${idx}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
