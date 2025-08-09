import React, { useState } from 'react';
import { Download, Sparkles, Zap } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ColorGuessGame from './components/ColorGuessGame';
import ShapeSelector from './components/ShapeSelector';
import ShapeRenderer from './components/ShapeRenderer';
import ColorTable from './components/ColorTable';
import { ColorData, analyzeImageColors, getSassyCommentary } from './utils/colorUtils';

function App() {
  const [colors, setColors] = useState<ColorData[]>([]);
  const [commentary, setCommentary] = useState('');
  const [selectedShape, setSelectedShape] = useState('circle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [score, setScore] = useState(0);
  const [unlockedShapes, setUnlockedShapes] = useState(['circle']);
  const [originalImage, setOriginalImage] = useState<string>('');

  const handleImageUpload = async (file: File, imageData: ImageData) => {
    setIsProcessing(true);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target?.result as string);
    reader.readAsDataURL(file);
    
    try {
      // Analyze colors
      const colorData = analyzeImageColors(imageData);
      setColors(colorData);
      
      // Generate commentary
      const comment = getSassyCommentary(colorData, colorData.length);
      setCommentary(comment);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    
    // Unlock new shapes based on score
    const shapesToUnlock = ['circle', 'rectangle', 'spiral', 'arc', 'triangle', 'star', 'banana', 'surprise'];
    const newUnlocked = shapesToUnlock.slice(0, Math.min(newScore + 1, shapesToUnlock.length));
    setUnlockedShapes(newUnlocked);
  };

  const downloadVisualization = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `color-spectrum-${selectedShape}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const getRandomShape = () => {
    const availableShapes = unlockedShapes.filter(shape => shape !== 'surprise');
    if (availableShapes.length === 0) return 'circle';
    
    // Sometimes mix two shapes or create chaos
    if (Math.random() > 0.7 && availableShapes.length > 1) {
      const shape1 = availableShapes[Math.floor(Math.random() * availableShapes.length)];
      const shape2 = availableShapes[Math.floor(Math.random() * availableShapes.length)];
      return Math.random() > 0.5 ? shape1 : shape2;
    }
    
    return availableShapes[Math.floor(Math.random() * availableShapes.length)];
  };

  const actualShape = selectedShape === 'surprise' ? getRandomShape() : selectedShape;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Color Spectrum Analyzer</h1>
            <Zap className="h-10 w-10" />
          </div>
          <p className="text-xl opacity-90">
            Upload images, guess colors, unlock shapes, and explore the physics of light! 🌈⚛️
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Image Upload */}
        <div className="mb-8">
          <ImageUploader 
            onImageUpload={handleImageUpload}
            isProcessing={isProcessing}
          />
        </div>

        {/* Game and Shape Selection */}
        {colors.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <ColorGuessGame 
              colors={colors}
              onScoreUpdate={handleScoreUpdate}
              currentScore={score}
            />
            <ShapeSelector
              selectedShape={selectedShape}
              onShapeChange={setSelectedShape}
              unlockedShapes={unlockedShapes}
              score={score}
            />
          </div>
        )}

        {/* Visualization */}
        {colors.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Wavelength Visualization
                  {selectedShape === 'surprise' && <span className="ml-2">🎲</span>}
                </h3>
                <button
                  onClick={downloadVisualization}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {originalImage && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Original Image</h4>
                    <div className="flex justify-center">
                      <img 
                        src={originalImage} 
                        alt="Original" 
                        className="max-w-full max-h-80 rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    Spectrum Shape: {actualShape.charAt(0).toUpperCase() + actualShape.slice(1)}
                    {selectedShape === 'banana' && ' 🍌'}
                    {selectedShape === 'surprise' && ' ✨'}
                  </h4>
                  <ShapeRenderer 
                    colors={colors}
                    shape={actualShape}
                    width={400}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Color Analysis Table */}
        {colors.length > 0 && commentary && (
          <ColorTable colors={colors} commentary={commentary} />
        )}

        {/* Instructions */}
        {colors.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="font-bold text-blue-800 mb-2">1. Upload Image</h3>
                <p className="text-blue-700">Upload any image and we'll analyze every pixel to extract RGB color data.</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-purple-800 mb-2">2. Play & Unlock</h3>
                <p className="text-purple-700">Guess which colors appear most to earn points and unlock new visualization shapes!</p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg">
                <div className="text-3xl mb-3">⚛️</div>
                <h3 className="font-bold text-pink-800 mb-2">3. Explore Physics</h3>
                <p className="text-pink-700">See your colors converted to wavelengths (380-750nm) and visualized in beautiful shapes!</p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">
                <strong>Pro Tip:</strong> Try uploading colorful images like rainbows, flowers, or artwork for the best results! 🌈
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-300">
            Made with 💜 using React, TypeScript, and physics magic ⚛️
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;