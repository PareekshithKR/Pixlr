import React from 'react';
import { ColorData, getColorName } from '../utils/colorUtils';
import { Palette, Gavel as Wavelength } from 'lucide-react';

interface ColorTableProps {
  colors: ColorData[];
  commentary: string;
}

export default function ColorTable({ colors, commentary }: ColorTableProps) {
  if (!colors.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Palette className="h-6 w-6" />
          Color Analysis Results
        </h3>
      </div>
      
      <div className="p-6">
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium text-center">{commentary}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Color</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">RGB</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hex</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Wavelength</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pixels</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {colors.slice(0, 20).map((color, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    ></div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {getColorName(color.wavelength)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    rgb({color.rgb.join(', ')})
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-800">
                    {color.hex.toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-sm text-purple-600 font-medium">
                    {color.wavelength.toFixed(0)}nm
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {color.count.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-200 rounded-full h-2 w-16">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            backgroundColor: color.hex,
                            width: `${Math.min(100, color.percentage * 2)}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-purple-600 font-bold">
                        {color.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {colors.length > 20 && (
            <div className="text-center py-4 text-gray-500">
              Showing top 20 colors • {colors.length} total unique colors found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}