# Integrasi Model AI di Aplikasi Toko Baju

## Pendahuluan
Dokumen ini menjelaskan cara mengintegrasikan dan mengganti model AI di aplikasi Next.js Anda. Meskipun aplikasi saat ini tidak memiliki integrasi AI, dokumen ini memberikan panduan untuk menambahkan fitur tersebut.

## Opsi Model AI yang Tersedia

### 1. OpenAI GPT
```bash
npm install openai
```

### 2. Anthropic Claude
```bash
npm install @anthropic-ai/sdk
```

### 3. Google Gemini
```bash
npm install @google/generative-ai
```

### 4. Hugging Face Models
```bash
npm install @huggingface/inference
```

## Konfigurasi Model AI

### 1. Buat file konfigurasi AI
```typescript
// lib/ai-config.ts
export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'huggingface';
  apiKey: string;
  model: string;
}

export const getAIConfig = (): AIConfig => {
  const provider = process.env.AI_PROVIDER || 'openai';
  
  switch(provider) {
    case 'openai':
      return {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY!,
        model: process.env.OPENAI_MODEL || 'gpt-4'
      };
    case 'anthropic':
      return {
        provider: 'anthropic',
        apiKey: process.env.ANTHROPIC_API_KEY!,
        model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229'
      };
    case 'gemini':
      return {
        provider: 'gemini',
        apiKey: process.env.GEMINI_API_KEY!,
        model: process.env.GEMINI_MODEL || 'gemini-pro'
      };
    case 'huggingface':
      return {
        provider: 'huggingface',
        apiKey: process.env.HUGGINGFACE_API_KEY!,
        model: process.env.HUGGINGFACE_MODEL || 'gpt2'
      };
    default:
      throw new Error('Provider AI tidak dikenal');
  }
};
```

### 2. Buat layanan AI abstrak
```typescript
// lib/ai-service.ts
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';
import { getAIConfig } from './ai-config';

export abstract class AIService {
  abstract generateText(prompt: string): Promise<string>;
  abstract generateImage(prompt: string): Promise<string>;
}

export class OpenAIService extends AIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    super();
    this.client = new OpenAI({ apiKey });
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });
    
    return response.choices[0].message.content || '';
  }

  async generateImage(prompt: string): Promise<string> {
    const response = await this.client.images.generate({
      model: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });
    
    return response.data[0].url;
  }
}

export class GeminiService extends AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string, modelName: string) {
    super();
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async generateText(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    const response = result.response;
    return response.text();
  }

  async generateImage(prompt: string): Promise<string> {
    // Gemini tidak mendukung generasi gambar langsung
    throw new Error('Gemini tidak mendukung generasi gambar');
  }
}

export class HuggingFaceService extends AIService {
  private client: HfInference;

  constructor(apiKey: string, modelName: string) {
    super();
    this.client = new HfInference(apiKey);
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.client.textGeneration({
      model: process.env.HUGGINGFACE_MODEL || 'gpt2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
      },
    });
    
    return response.generated_text;
  }

  async generateImage(prompt: string): Promise<string> {
    const response = await this.client.textToImage({
      model: process.env.HUGGINGFACE_IMAGE_MODEL || 'stabilityai/stable-diffusion-2-1',
      inputs: prompt,
    });
    
    // Convert blob to URL
    const imageUrl = URL.createObjectURL(response);
    return imageUrl;
  }
}

export const createAIService = (): AIService => {
  const config = getAIConfig();
  
  switch(config.provider) {
    case 'openai':
      return new OpenAIService(config.apiKey);
    case 'gemini':
      return new GeminiService(config.apiKey, config.model);
    case 'huggingface':
      return new HuggingFaceService(config.apiKey, config.model);
    default:
      throw new Error(`Provider ${config.provider} belum diimplementasikan`);
  }
};
```

### 3. Tambahkan variabel lingkungan
Tambahkan ke `.env.local`:
```env
# Pilih salah satu provider
AI_PROVIDER=openai  # atau anthropic, gemini, huggingface

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4
OPENAI_IMAGE_MODEL=dall-e-3

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-pro

# Hugging Face
HUGGINGFACE_API_KEY=your-huggingface-api-key
HUGGINGFACE_MODEL=gpt2
HUGGINGFACE_IMAGE_MODEL=stabilityai/stable-diffusion-2-1
```

### 4. Gunakan dalam komponen
```typescript
// components/AIAssistant.tsx
'use client';

import { useState } from 'react';
import { createAIService } from '@/lib/ai-service';

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const aiService = createAIService();
      const result = await aiService.generateText(input);
      setResponse(result);
    } catch (error) {
      console.error('Error calling AI service:', error);
      setResponse('Terjadi kesalahan saat memanggil layanan AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Asisten AI</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan sesuatu..."
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Kirim'}
        </button>
      </form>
      
      {response && (
        <div className="mt-4 p-3 bg-white rounded border">
          <h4 className="font-medium mb-2">Respons:</h4>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
```

## Cara Mengganti Model

Untuk mengganti model AI, cukup ubah nilai variabel lingkungan:

1. Ubah `AI_PROVIDER` ke provider yang diinginkan
2. Sesuaikan `*_MODEL` dengan nama model yang ingin digunakan
3. Pastikan API key untuk provider tersebut telah diset

Contoh untuk mengganti dari OpenAI ke Gemini:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-pro-latest
```

## Contoh Kasus Penggunaan di Toko Baju

1. **Deskripsi Produk Otomatis**: Gunakan AI untuk membuat deskripsi produk yang menarik
2. **Rekomendasi Produk**: Berdasarkan preferensi pengguna
3. **Chatbot Layanan Pelanggan**: Jawab pertanyaan umum pelanggan
4. **Desain Kustom**: Bantu pengguna membuat desain baju kustom
5. **Optimasi SEO**: Generate meta description dan judul produk

## Kesimpulan

Dengan arsitektur yang fleksibel seperti ini, Anda dapat dengan mudah mengganti model AI tanpa harus mengubah banyak kode. Cukup ubah konfigurasi dan provider akan otomatis berubah.