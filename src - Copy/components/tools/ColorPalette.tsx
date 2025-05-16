
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Copy, Shuffle, Save, Download, Plus, Trash, RefreshCw } from 'lucide-react';

// Color harmony types
type ColorHarmonyType = 'analogous' | 'monochromatic' | 'triad' | 'complementary' | 'split-complementary' | 'random';

// Color format types
type ColorFormatType = 'hex' | 'rgb' | 'hsl';

// Saved palette interface
interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: Date;
}

// Generate a random hex color
const getRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

// Convert hex to HSL
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  // Find min and max values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate lightness
  const l = (max + min) / 2;
  
  let h = 0;
  let s = 0;

  if (max !== min) {
    // Calculate saturation
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    
    // Calculate hue
    if (max === r) {
      h = ((g - b) / (max - min)) % 6;
    } else if (max === g) {
      h = (b - r) / (max - min) + 2;
    } else {
      h = (r - g) / (max - min) + 4;
    }
    
    h *= 60;
    if (h < 0) h += 360;
  }
  
  return { h, s, l };
};

// Convert HSL to hex
const hslToHex = (h: number, s: number, l: number): string => {
  // Make sure h is within 0-360
  h = h % 360;
  if (h < 0) h += 360;
  
  // Convert to decimal (0-1)
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));

  function hueToRGB(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  const r = Math.round(hueToRGB(p, q, (h / 360) + 1/3) * 255);
  const g = Math.round(hueToRGB(p, q, h / 360) * 255);
  const b = Math.round(hueToRGB(p, q, (h / 360) - 1/3) * 255);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Generate a color harmony based on a base color
const generateColorHarmony = (baseColor: string, harmonyType: ColorHarmonyType, count: number = 5): string[] => {
  const baseHSL = hexToHSL(baseColor);
  const colors: string[] = [baseColor];
  
  switch (harmonyType) {
    case 'analogous': {
      // Generate colors with similar hues
      const hueStep = 30;
      for (let i = 1; i < count; i++) {
        const newHue = (baseHSL.h + hueStep * i) % 360;
        colors.push(hslToHex(newHue, baseHSL.s, baseHSL.l));
      }
      break;
    }
    case 'monochromatic': {
      // Generate same hue with different lightness
      const lightnessStep = 0.15;
      const saturationStep = 0.1;
      
      for (let i = 1; i < count; i++) {
        let newLightness = baseHSL.l + (i % 2 === 0 ? 1 : -1) * lightnessStep * Math.ceil(i / 2);
        newLightness = Math.max(0.1, Math.min(0.9, newLightness));
        
        let newSaturation = baseHSL.s + (i % 3 === 0 ? -0.1 : 0.05);
        newSaturation = Math.max(0.1, Math.min(0.9, newSaturation));
        
        colors.push(hslToHex(baseHSL.h, newSaturation, newLightness));
      }
      break;
    }
    case 'triad': {
      // Generate colors with hues 120° apart
      colors.push(hslToHex((baseHSL.h + 120) % 360, baseHSL.s, baseHSL.l));
      colors.push(hslToHex((baseHSL.h + 240) % 360, baseHSL.s, baseHSL.l));
      
      // Add variations if more colors needed
      if (count > 3) {
        colors.push(hslToHex(baseHSL.h, Math.min(baseHSL.s + 0.2, 1), Math.min(baseHSL.l + 0.1, 1)));
        colors.push(hslToHex(baseHSL.h, Math.max(baseHSL.s - 0.2, 0), Math.max(baseHSL.l - 0.1, 0)));
      }
      break;
    }
    case 'complementary': {
      // Generate colors with opposite hues
      colors.push(hslToHex((baseHSL.h + 180) % 360, baseHSL.s, baseHSL.l));
      
      // Add variations if more colors needed
      if (count > 2) {
        colors.push(hslToHex(baseHSL.h, Math.min(baseHSL.s + 0.1, 1), Math.min(baseHSL.l + 0.15, 1)));
        colors.push(hslToHex((baseHSL.h + 180) % 360, Math.min(baseHSL.s + 0.1, 1), Math.min(baseHSL.l + 0.15, 1)));
        colors.push(hslToHex(baseHSL.h, Math.max(baseHSL.s - 0.1, 0), Math.max(baseHSL.l - 0.15, 0)));
      }
      break;
    }
    case 'split-complementary': {
      // Generate colors with hues 150° and 210° from the base
      colors.push(hslToHex((baseHSL.h + 150) % 360, baseHSL.s, baseHSL.l));
      colors.push(hslToHex((baseHSL.h + 210) % 360, baseHSL.s, baseHSL.l));
      
      // Add variations if more colors needed
      if (count > 3) {
        colors.push(hslToHex(baseHSL.h, Math.min(baseHSL.s + 0.1, 1), Math.min(baseHSL.l + 0.15, 1)));
        colors.push(hslToHex(baseHSL.h, Math.max(baseHSL.s - 0.1, 0), Math.max(baseHSL.l - 0.15, 0)));
      }
      break;
    }
    case 'random': {
      // Generate completely random colors
      for (let i = 1; i < count; i++) {
        colors.push(getRandomColor());
      }
      break;
    }
  }
  
  // Ensure we have the requested number of colors
  while (colors.length < count) {
    colors.push(getRandomColor());
  }
  
  return colors.slice(0, count);
};

// Format color in different formats
const formatColor = (color: string, format: ColorFormatType): string => {
  // Already in hex format
  if (format === 'hex') {
    return color;
  }
  
  // Convert hex to rgb
  if (format === 'rgb') {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Convert hex to hsl
  if (format === 'hsl') {
    const { h, s, l } = hexToHSL(color);
    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }
  
  return color;
};

// Generate an ID for saved palettes
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState<string>(getRandomColor());
  const [harmonyType, setHarmonyType] = useState<ColorHarmonyType>('analogous');
  const [colorCount, setColorCount] = useState<number>(5);
  const [lockBaseColor, setLockBaseColor] = useState<boolean>(false);
  const [colorFormat, setColorFormat] = useState<ColorFormatType>('hex');
  const [palette, setPalette] = useState<string[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(() => {
    const saved = localStorage.getItem('savedColorPalettes');
    return saved 
      ? JSON.parse(saved).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt)
        })) 
      : [];
  });
  const [newPaletteName, setNewPaletteName] = useState<string>('');
  const { toast } = useToast();

  // Generate palette on component mount and when parameters change
  useEffect(() => {
    generatePalette();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseColor, harmonyType, colorCount]);

  // Save palettes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('savedColorPalettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  // Generate a new color palette
  const generatePalette = () => {
    setPalette(generateColorHarmony(baseColor, harmonyType, colorCount));
  };

  // Generate a completely new palette
  const generateNewPalette = () => {
    if (!lockBaseColor) {
      const newBaseColor = getRandomColor();
      setBaseColor(newBaseColor);
    } else {
      generatePalette();
    }
  };

  // Copy a color to clipboard
  const copyColor = (color: string) => {
    navigator.clipboard.writeText(formatColor(color, colorFormat));
    toast({
      title: "Color copied",
      description: `${formatColor(color, colorFormat)} copied to clipboard`,
    });
  };

  // Save current palette
  const savePalette = () => {
    if (!newPaletteName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your palette",
        variant: "destructive",
      });
      return;
    }
    
    const newPalette: SavedPalette = {
      id: generateId(),
      name: newPaletteName,
      colors: palette,
      createdAt: new Date()
    };
    
    setSavedPalettes(prev => [newPalette, ...prev]);
    setNewPaletteName('');
    
    toast({
      title: "Palette saved",
      description: `"${newPaletteName}" has been saved to your collection`,
    });
  };

  // Remove a saved palette
  const removePalette = (id: string) => {
    setSavedPalettes(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Palette removed",
      description: "Palette has been removed from your collection",
    });
  };

  // Load a saved palette
  const loadPalette = (savedPalette: SavedPalette) => {
    setPalette(savedPalette.colors);
    setBaseColor(savedPalette.colors[0]);
    setColorCount(savedPalette.colors.length);
    
    toast({
      title: "Palette loaded",
      description: `Palette "${savedPalette.name}" has been loaded`,
    });
  };

  // Export palette as an image
  const exportPalette = () => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas dimensions
    canvas.width = palette.length * 100;
    canvas.height = 100;
    
    // Draw each color as a rectangle
    palette.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(index * 100, 0, 100, 100);
      
      // Add color code
      ctx.fillStyle = getContrastYIQ(color);
      ctx.font = '12px Arial';
      ctx.fillText(formatColor(color, 'hex'), index * 100 + 10, 50);
    });
    
    // Convert canvas to image and trigger download
    const link = document.createElement('a');
    link.download = 'color-palette.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast({
      title: "Palette exported",
      description: "Color palette has been exported as PNG image",
    });
  };

  // Determine if text should be black or white based on background color
  const getContrastYIQ = (hexcolor: string): string => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Color Palette Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="baseColor" className="block mb-2">Base Color</Label>
                  <div className="flex gap-2 items-center">
                    <div 
                      className="h-10 w-10 rounded-md border" 
                      style={{ backgroundColor: baseColor }}
                    />
                    <Input
                      id="baseColor"
                      type="text"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="harmonyType" className="block mb-2">Color Harmony</Label>
                  <Select value={harmonyType} onValueChange={(value: ColorHarmonyType) => setHarmonyType(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select harmony type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analogous">Analogous</SelectItem>
                      <SelectItem value="monochromatic">Monochromatic</SelectItem>
                      <SelectItem value="triad">Triadic</SelectItem>
                      <SelectItem value="complementary">Complementary</SelectItem>
                      <SelectItem value="split-complementary">Split Complementary</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="colorCount" className="block mb-2">
                  Number of Colors: {colorCount}
                </Label>
                <Slider
                  id="colorCount"
                  min={3}
                  max={8}
                  step={1}
                  value={[colorCount]}
                  onValueChange={(values) => setColorCount(values[0])}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="lockBaseColor"
                  checked={lockBaseColor}
                  onCheckedChange={setLockBaseColor}
                />
                <Label htmlFor="lockBaseColor">Lock Base Color</Label>
              </div>
              
              <div className="flex justify-between mt-6">
                <div className="space-x-2">
                  <Button onClick={generateNewPalette}>
                    <RefreshCw size={16} className="mr-1" />
                    Generate New Palette
                  </Button>
                  <Button variant="outline" onClick={() => setBaseColor(getRandomColor())}>
                    <Shuffle size={16} className="mr-1" />
                    Random Base Color
                  </Button>
                </div>
                
                <Select value={colorFormat} onValueChange={(value: ColorFormatType) => setColorFormat(value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hex">HEX</SelectItem>
                    <SelectItem value="rgb">RGB</SelectItem>
                    <SelectItem value="hsl">HSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Generated Palette</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {palette.map((color, index) => (
                  <div 
                    key={index}
                    className="rounded-md overflow-hidden border"
                  >
                    <div 
                      className="h-24 flex items-center justify-center cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => copyColor(color)}
                      title="Click to copy"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 hover:opacity-100 transition-opacity bg-black/20 text-white"
                        onClick={() => copyColor(color)}
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                    <div className="p-2 bg-muted/50 text-center">
                      <code className="text-sm font-mono">
                        {formatColor(color, colorFormat)}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter palette name..." 
                  value={newPaletteName}
                  onChange={(e) => setNewPaletteName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={savePalette} disabled={!newPaletteName.trim()}>
                  <Save size={16} className="mr-1" />
                  Save
                </Button>
                <Button variant="outline" onClick={exportPalette}>
                  <Download size={16} className="mr-1" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Saved Palettes</h2>
              
              {savedPalettes.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {savedPalettes.map((saved) => (
                    <div key={saved.id} className="border rounded-md overflow-hidden">
                      <div className="p-2 bg-muted/50 flex justify-between items-center">
                        <h3 className="font-medium">{saved.name}</h3>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removePalette(saved.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                      
                      <div className="flex h-10">
                        {saved.colors.map((color, i) => (
                          <div 
                            key={i}
                            className="flex-1 h-full cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => copyColor(color)}
                            title={formatColor(color, 'hex')}
                          />
                        ))}
                      </div>
                      
                      <button
                        className="w-full p-2 text-center text-sm hover:bg-muted transition-colors"
                        onClick={() => loadPalette(saved)}
                      >
                        Load Palette
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No saved palettes yet. 
                  <p className="mt-1">Save a palette to see it here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
