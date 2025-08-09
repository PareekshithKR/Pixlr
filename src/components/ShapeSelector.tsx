import React from 'react';
import { Circle, Square, Zap, Smile, ArrowDown, Triangle, Star, Shuffle } from 'lucide-react';

interface ShapeSelectorProps {
  selectedShape: string;
  onShapeChange: (shape: string) => void;
  unlockedShapes: string[];
  score: number;
}

const shapes = [
  { id: 'circle', name: 'Circle', icon: Circle, requiredScore: 0 },
  { id: 'rectangle', name: 'Rectangle', icon: Square, requiredScore: 1 },
  { id: 'spiral', name: 'Spiral', icon: Zap, requiredScore: 2 },
  { id: 'arc', name: 'Arc', icon: ArrowDown, requiredScore: 3 },
  { id: 'triangle', name: 'Triangle', icon: Triangle, requiredScore: 4 },
  { id: 'star', name: 'Star', icon: Star, requiredScore: 5 },
  { id: 'banana', name: 'Banana Mode', icon: Smile, requiredScore: 6 },
  { id: 'surprise', name: 'Surprise Me!', icon: Shuffle, requiredScore: 7 }
];

export default function ShapeSelector({ selectedShape, onShapeChange, unlockedShapes, score }: ShapeSelectorProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Choose Your Shape</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {shapes.map((shape) => {
          const isUnlocked = unlockedShapes.includes(shape.id);
          const Icon = shape.icon;
          
          return (
            <button
              key={shape.id}
              onClick={() => isUnlocked && onShapeChange(shape.id)}
              disabled={!isUnlocked}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedShape === shape.id
                  ? 'border-purple-400 bg-purple-50'
                  : isUnlocked
                  ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-5'
                  : 'border-gray-100 bg-gray-50 opacity-50'
              }`}
            >
              <div className="text-center">
                <Icon className={`h-8 w-8 mx-auto mb-2 ${
                  isUnlocked ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <div className="text-sm font-medium text-gray-700">
                  {shape.name}
                </div>
                {!isUnlocked && (
                  <div className="text-xs text-gray-500 mt-1">
                    Score {shape.requiredScore} to unlock
                  </div>
                )}
              </div>
              
              {!isUnlocked && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                    🔒
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Current Score: <span className="font-bold text-purple-600">{score}</span> • 
        {unlockedShapes.length}/{shapes.length} shapes unlocked
      </div>
    </div>
  );
}