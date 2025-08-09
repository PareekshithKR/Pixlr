import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { ColorData, getColorName } from '../utils/colorUtils';

interface ColorGuessGameProps {
  colors: ColorData[];
  onScoreUpdate: (score: number) => void;
  currentScore: number;
}

export default function ColorGuessGame({ colors, onScoreUpdate, currentScore }: ColorGuessGameProps) {
  const [gameColors, setGameColors] = useState<ColorData[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<ColorData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<ColorData | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (colors.length >= 2) {
      startNewRound();
    }
  }, [colors]);

  const startNewRound = () => {
    if (colors.length < 2) return;
    
    // Select 2-4 random colors for the game
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const gameOptions = shuffled.slice(0, Math.min(4, colors.length));
    
    // Find the one with highest percentage
    const correct = gameOptions.reduce((max, color) => 
      color.percentage > max.percentage ? color : max
    );
    
    setGameColors(gameOptions);
    setCorrectAnswer(correct);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleGuess = (guessedColor: ColorData) => {
    setSelectedAnswer(guessedColor);
    setShowResult(true);
    
    if (guessedColor === correctAnswer) {
      const newScore = currentScore + 1;
      onScoreUpdate(newScore);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const nextRound = () => {
    startNewRound();
  };

  if (colors.length < 2) {
    return (
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
        <Target className="h-12 w-12 text-white mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Color Guessing Game</h3>
        <p className="text-white/90">Upload an image with multiple colors to start playing!</p>
      </div>
    );
  }

  if (!correctAnswer) return null;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6" />
          Color Challenge
        </h3>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm font-medium">Score: {currentScore}</span>
          </div>
          {streak > 0 && (
            <div className="bg-yellow-400/20 rounded-lg px-3 py-1 flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium">{streak} streak</span>
            </div>
          )}
        </div>
      </div>

      {!showResult ? (
        <div>
          <p className="text-lg mb-4 text-center">
            Which color appears the most in this image?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {gameColors.map((color, index) => (
              <button
                key={index}
                onClick={() => handleGuess(color)}
                className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-all duration-200 transform hover:scale-105"
                style={{ borderLeft: `6px solid ${color.hex}` }}
              >
                <div className="text-left">
                  <div className="font-semibold">{getColorName(color.wavelength)}</div>
                  <div className="text-sm opacity-75">{color.hex.toUpperCase()}</div>
                  <div className="text-xs opacity-60">{color.wavelength.toFixed(0)}nm</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            {selectedAnswer === correctAnswer ? (
              <div className="space-y-2">
                <Trophy className="h-12 w-12 text-yellow-300 mx-auto" />
                <h4 className="text-xl font-bold text-green-200">Correct! 🎉</h4>
                <p>
                  {getColorName(correctAnswer.wavelength)} with {correctAnswer.percentage.toFixed(1)}% of pixels!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-12 w-12 bg-red-400 rounded-full mx-auto flex items-center justify-center text-2xl">
                  😅
                </div>
                <h4 className="text-xl font-bold text-red-200">Close, but...</h4>
                <p>
                  The answer was {getColorName(correctAnswer.wavelength)} with {correctAnswer.percentage.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={nextRound}
            className="bg-white/20 hover:bg-white/30 rounded-lg px-6 py-3 font-semibold transition-all duration-200"
          >
            Next Round →
          </button>
        </div>
      )}
    </div>
  );
}