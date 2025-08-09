// Utility functions for color processing and wavelength conversion

export interface ColorData {
  rgb: [number, number, number];
  hex: string;
  count: number;
  percentage: number;
  wavelength: number;
}

export function rgbToWavelength(r: number, g: number, b: number): number {
  // Convert RGB to dominant wavelength using physics-based approximation
  // This uses a simplified model based on spectral sensitivity curves
  
  // Normalize RGB values
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  // Find dominant component
  const max = Math.max(rNorm, gNorm, bNorm);
  
  if (max === 0) return 400; // Black -> deep violet
  
  // Calculate weighted average based on RGB components
  // Red: 620-750nm, Green: 495-570nm, Blue: 450-495nm
  const redWeight = rNorm / max;
  const greenWeight = gNorm / max;
  const blueWeight = bNorm / max;
  
  // Weighted wavelength calculation
  const wavelength = (
    redWeight * 680 +      // Red center: 680nm
    greenWeight * 530 +    // Green center: 530nm
    blueWeight * 470       // Blue center: 470nm
  );
  
  // Adjust for secondary colors
  if (redWeight > 0.7 && greenWeight > 0.7) {
    // Yellow: 570-590nm
    return 580;
  } else if (redWeight > 0.7 && blueWeight > 0.7) {
    // Magenta: estimated as 420nm (violet-red)
    return 420;
  } else if (greenWeight > 0.7 && blueWeight > 0.7) {
    // Cyan: 480-500nm
    return 490;
  }
  
  // Clamp to visible spectrum
  return Math.max(380, Math.min(750, wavelength));
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

export function analyzeImageColors(imageData: ImageData): ColorData[] {
  const colorMap = new Map<string, { count: number; rgb: [number, number, number] }>();
  const data = imageData.data;
  
  // Process pixels (skip alpha channel)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${r},${g},${b}`;
    
    if (colorMap.has(key)) {
      colorMap.get(key)!.count++;
    } else {
      colorMap.set(key, { count: 1, rgb: [r, g, b] });
    }
  }
  
  const totalPixels = imageData.width * imageData.height;
  const colors: ColorData[] = [];
  
  colorMap.forEach(({ count, rgb }) => {
    const [r, g, b] = rgb;
    colors.push({
      rgb,
      hex: rgbToHex(r, g, b),
      count,
      percentage: (count / totalPixels) * 100,
      wavelength: rgbToWavelength(r, g, b)
    });
  });
  
  // Sort by wavelength (descending: red to violet)
  return colors.sort((a, b) => b.wavelength - a.wavelength);
}

export function getColorName(wavelength: number): string {
  if (wavelength >= 700) return 'Deep Red';
  if (wavelength >= 650) return 'Red';
  if (wavelength >= 590) return 'Orange';
  if (wavelength >= 570) return 'Yellow';
  if (wavelength >= 495) return 'Green';
  if (wavelength >= 450) return 'Blue';
  if (wavelength >= 380) return 'Violet';
  return 'Infrared';
}

export function getSassyCommentary(colors: ColorData[], totalColors: number): string {
  const comments = [
    "Behold, the majestic colors of your image… now in scientific formation! 🧬",
    "This is what happens when physics meets art! 🎨⚛️",
    "Your image has been wavelength-ified! Science is beautiful! ✨",
    "Converting chaos into organized spectrum magic! 🌈",
    "Pixel archaeology complete! These colors have stories to tell! 📸"
  ];
  
  const dominantColor = colors[0];
  const colorName = getColorName(dominantColor.wavelength);
  
  // Special cases
  if (dominantColor.percentage > 50) {
    return `This image is ${colorName.toLowerCase()} chic! ${dominantColor.percentage.toFixed(1)}% dominance detected! 👑`;
  }
  
  if (colors.length > 100) {
    return "You have discovered the mythical rainbow explosion! So many colors, so little time! 🌈💥";
  }
  
  if (totalColors < 10) {
    return "Minimalist vibes detected! Sometimes less is more... scientifically speaking! 🎯";
  }
  
  const randomComment = comments[Math.floor(Math.random() * comments.length)];
  return `${randomComment} Found ${totalColors} unique wavelengths ranging from ${colors[colors.length-1].wavelength.toFixed(0)}nm to ${colors[0].wavelength.toFixed(0)}nm!`;
}