import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File, imageData: ImageData) => void;
  isProcessing: boolean;
}

export default function ImageUploader({ onImageUpload, isProcessing }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const processImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Scale down large images for performance
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height);
          width *= scale;
          height *= scale;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        
        onImageUpload(file, imageData);
        setPreviewUrl(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) processImage(files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) processImage(files[0]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-3 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-purple-400 bg-purple-50'
            : 'border-gray-300 hover:border-purple-300 hover:bg-purple-5'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {previewUrl && !isProcessing ? (
          <div className="space-y-4">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-40 mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600">Click to upload a different image</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              {isProcessing ? (
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-300 border-t-purple-600"></div>
              ) : (
                <div className="p-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {isProcessing ? 'Processing your image...' : 'Upload an Image'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Drag & drop or click to select • PNG, JPG, GIF supported
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}