import React, { useRef, useEffect } from 'react';
import { ColorData } from '../utils/colorUtils';

interface ShapeRendererProps {
  colors: ColorData[];
  shape: string;
  width?: number;
  height?: number;
}

export default function ShapeRenderer({ colors, shape, width = 400, height = 400 }: ShapeRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!colors.length) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    
    drawShape(ctx, colors, shape, width, height);
  }, [colors, shape, width, height]);

  const drawShape = (ctx: CanvasRenderingContext2D, colors: ColorData[], shape: string, w: number, h: number) => {
    const centerX = w / 2;
    const centerY = h / 2;
    
    switch (shape) {
      case 'circle':
        drawCircle(ctx, colors, centerX, centerY, Math.min(w, h) * 0.4);
        break;
      case 'rectangle':
        drawRectangle(ctx, colors, w * 0.1, h * 0.1, w * 0.8, h * 0.8);
        break;
      case 'spiral':
        drawSpiral(ctx, colors, centerX, centerY, Math.min(w, h) * 0.3);
        break;
      case 'arc':
        drawArc(ctx, colors, centerX, centerY, Math.min(w, h) * 0.3);
        break;
      case 'banana':
        drawBanana(ctx, colors, centerX, centerY, Math.min(w, h) * 0.3);
        break;
      case 'triangle':
        drawTriangle(ctx, colors, centerX, centerY, Math.min(w, h) * 0.3);
        break;
      case 'star':
        drawStar(ctx, colors, centerX, centerY, Math.min(w, h) * 0.3);
        break;
      default:
        drawCircle(ctx, colors, centerX, centerY, Math.min(w, h) * 0.4);
    }
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, colors: ColorData[], centerX: number, centerY: number, radius: number) => {
    let currentRadius = 0;
    const totalPercentage = colors.reduce((sum, color) => sum + color.percentage, 0);
    
    colors.forEach((color) => {
      const bandWidth = (color.percentage / totalPercentage) * radius;
      const nextRadius = currentRadius + bandWidth;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, nextRadius, 0, 2 * Math.PI);
      ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI, true);
      ctx.fillStyle = color.hex;
      ctx.fill();
      
      currentRadius = nextRadius;
    });
  };

  const drawRectangle = (ctx: CanvasRenderingContext2D, colors: ColorData[], x: number, y: number, w: number, h: number) => {
    let currentY = y;
    const totalPercentage = colors.reduce((sum, color) => sum + color.percentage, 0);
    
    colors.forEach((color) => {
      const bandHeight = (color.percentage / totalPercentage) * h;
      
      ctx.fillStyle = color.hex;
      ctx.fillRect(x, currentY, w, bandHeight);
      
      currentY += bandHeight;
    });
  };

  const drawSpiral = (ctx: CanvasRenderingContext2D, colors: ColorData[], centerX: number, centerY: number, maxRadius: number) => {
    const totalPercentage = colors.reduce((sum, color) => sum + color.percentage, 0);
    let angle = 0;
    let radius = 0;
    const spiralTightness = 0.5;
    
    colors.forEach((color, index) => {
      const segments = Math.max(10, Math.floor((color.percentage / totalPercentage) * 360));
      
      ctx.strokeStyle = color.hex;
      ctx.lineWidth = 8;
      
      for (let i = 0; i < segments; i++) {
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        
        angle += Math.PI / 30;
        radius += spiralTightness;
        
        const x2 = centerX + Math.cos(angle) * radius;
        const y2 = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    });
  };

  const drawArc = (ctx: CanvasRenderingContext2D, colors: ColorData[], centerX: number, centerY: number, radius: number) => {
    const totalPercentage = colors.reduce((sum, color) => sum + color.percentage, 0);
    let currentAngle = Math.PI;
    
    colors.forEach((color) => {
      const arcLength = (color.percentage / totalPercentage) * Math.PI;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + arcLength);
      ctx.lineWidth = 20;
      ctx.strokeStyle = color.hex;
      ctx.stroke();
      
      currentAngle += arcLength;
    });
  };

  const drawBanana = (ctx: CanvasRenderingContext2D, colors: ColorData[], centerX: number, centerY: number, size: number) => {
    // Create banana shape path
    const bananaPath = new Path2D();
    const scale = size / 100;
    
    bananaPath.moveTo(centerX - 80 * scale, centerY + 40 * scale);
    bananaPath.quadraticCurveTo(centerX - 60 * scale, centerY - 60 * scale, centerX, centerY - 80 * scale);
    bananaPath.quadraticCurveTo(centerX + 60 * scale, centerY - 60 * scale, centerX + 80 * scale, centerY + 20 * scale);
    bananaPath.quadraticCurveTo(centerX + 60 * scale, centerY + 60 * scale, centerX + 20 * scale, centerY + 80 * scale);
    bananaPath.quadraticCurveTo(centerX - 40 * scale, centerY + 60 * scale, centerX - 80 * scale, centerY + 40 * scale);
    
    // Fill with color bands
    const totalPercentage = colors.reduce((sum, color) => sum + color.percentage, 0);
    let currentOffset = 0;
    
    ctx.save();
    ctx.clip(bananaPath);
    
    colors.forEach((color) => {
      const bandHeight = (color.percentage / totalPercentage) * size * 2;
      
      ctx.fillStyle = color.hex;
      ctx.fillRect(centerX - size, centerY - size + currentOffset, size * 2, bandHeight);
      
      currentOffset += bandHeight;
    });
    
    ctx.restore();
    
    // Draw banana outline
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.stroke(bananaPath);
  };

  const drawTriangle = (ctx: CanvasRenderingContext2D, colors: ColorData[], centerX: number, centerY: number, size: number) => {
    const totalPercentage = colors.reduce((sum, color) => sum + color.percentage, 0);
    let currentHeight = 0;
    
    colors.forEach((color) => {
      const bandHeight = (color.percentage / totalPercentage) * size * 1.5;
      const y = centerY + size * 0.75 - currentHeight - bandHeight;
      const bottomWidth = (size * 1.5) * ((currentHeight + bandHeight) / (size * 1.5));
      const topWidth = (size * 1.5) * (currentHeight / (size * 1.5));
      
      ctx.beginPath();
      ctx.moveTo(centerX - bottomWidth / 2, centerY + size * 0.75);
      ctx.lineTo(centerX + bottomWidth / 2, centerY + size * 0.75);
      ctx.lineTo(centerX + topWidth / 2, y);
      ctx.lineTo(centerX - topWidth / 2, y);
      ctx.closePath();
      
      ctx.fillStyle = color.hex;
      ctx.fill();
      
      currentHeight += bandHeight;
    });
  };

  const drawStar = (ctx: CanvasRenderingContext2D, colors: ColorData[], centerX: number, centerY: number, size: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    // Create star path
    const starPath = new Path2D();
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;
    
    starPath.moveTo(centerX, centerY - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      const x = centerX + Math.cos(rot) * outerRadius;
      const y = centerY + Math.sin(rot) * outerRadius;
      starPath.lineTo(x, y);
      rot += step;
      
      const x2 = centerX + Math.cos(rot) * innerRadius;
      const y2 = centerY + Math.sin(rot) * innerRadius;
      starPath.lineTo(x2, y2);
      rot += step;
    }
    
    starPath.lineTo(centerX, centerY - outerRadius);
    starPath.closePath();
    
    // Fill with color bands
    const totalPercentage = colors.reduce((sum, color) => sum + color.percentage, 0);
    let currentRadius = 0;
    
    colors.forEach((color) => {
      const bandWidth = (color.percentage / totalPercentage) * outerRadius;
      const nextRadius = currentRadius + bandWidth;
      
      ctx.save();
      ctx.clip(starPath);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, nextRadius, 0, 2 * Math.PI);
      ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI, true);
      ctx.fillStyle = color.hex;
      ctx.fill();
      
      ctx.restore();
      
      currentRadius = nextRadius;
    });
    
    // Draw star outline
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.stroke(starPath);
  };

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-2 border-gray-200 rounded-lg shadow-lg bg-white"
      />
    </div>
  );
}