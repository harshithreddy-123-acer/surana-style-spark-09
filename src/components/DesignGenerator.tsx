import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Loader2, Save, Download, Share, Image, Wand, 
  Palette, Home, BookOpen, PaintBucket, Upload
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getRunwareService, GeneratedImage } from './RunwareService';
import { ImageUpload } from '@/components/ui/image-upload';
import { RoomTypeSelector } from '@/components/design/RoomTypeSelector';
import { StyleSelector } from '@/components/design/StyleSelector';
import { ColorSchemeSelector } from '@/components/design/ColorSchemeSelector';
import { Room, Style, ColorScheme } from '@/types/design';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  getRandomMockDesign, 
  mockDesignToGeneratedImage 
} from '@/utils/mockDesigns';

const rooms: Room[] = [
  { id: 'living-room', name: 'Living Room', icon: <Home className="h-8 w-8" /> },
  { id: 'bedroom', name: 'Bedroom', icon: <BookOpen className="h-8 w-8" /> },
  { id: 'kitchen', name: 'Kitchen', icon: <PaintBucket className="h-8 w-8" /> },
  { id: 'bathroom', name: 'Bathroom', icon: <Palette className="h-8 w-8" /> },
  { id: 'dining-room', name: 'Dining Room', icon: <Image className="h-8 w-8" /> },
  { id: 'office', name: 'Home Office', icon: <Wand className="h-8 w-8" /> },
  { id: 'outdoor', name: 'Outdoor Space', icon: <Upload className="h-8 w-8" /> },
];

const styles: Style[] = [
  { id: 'modern', name: 'Modern', thumbnail: 'https://images.unsplash.com/photo-1617104551722-6988fc29a541?w=200&h=200&fit=crop' },
  { id: 'traditional', name: 'Traditional', thumbnail: 'https://images.unsplash.com/photo-1618221639244-c1a8502c0eb9?w=200&h=200&fit=crop' },
  { id: 'scandinavian', name: 'Scandinavian', thumbnail: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=200&h=200&fit=crop' },
  { id: 'industrial', name: 'Industrial', thumbnail: 'https://images.unsplash.com/photo-1634712282287-14ed57b9cc14?w=200&h=200&fit=crop' },
  { id: 'minimalist', name: 'Minimalist', thumbnail: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=200&h=200&fit=crop' },
  { id: 'bohemian', name: 'Bohemian', thumbnail: 'https://images.unsplash.com/photo-1617098600599-c2dfe9259814?w=200&h=200&fit=crop' },
  { id: 'mid-century', name: 'Mid-Century', thumbnail: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=200&h=200&fit=crop' },
  { id: 'farmhouse', name: 'Farmhouse', thumbnail: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&h=200&fit=crop' },
];

const colorSchemes: ColorScheme[] = [
  { id: '', name: 'Any Colors', colors: ['#FFFFFF', '#CCCCCC', '#999999', '#666666'] },
  { id: 'neutral', name: 'Neutral', colors: ['#F5F5F5', '#E0E0E0', '#BDBDBD', '#757575'] },
  { id: 'warm', name: 'Warm', colors: ['#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D'] },
  { id: 'cool', name: 'Cool', colors: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6'] },
  { id: 'monochromatic', name: 'Monochromatic', colors: ['#ECEFF1', '#CFD8DC', '#B0BEC5', '#90A4AE'] },
  { id: 'bold', name: 'Bold & Colorful', colors: ['#FF1744', '#F57C00', '#FFEB3B', '#00B0FF'] },
  { id: 'pastel', name: 'Pastel', colors: ['#F8BBD0', '#C5CAE9', '#B2DFDB', '#DCEDC8'] },
  { id: 'earth', name: 'Earth Tones', colors: ['#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8'] },
];

const DesignGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [room, setRoom] = useState('living-room');
  const [style, setStyle] = useState('modern');
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('runwareApiKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('runwareApiKey'));
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [savedImages, setSavedImages] = useState<GeneratedImage[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  
  const [colorScheme, setColorScheme] = useState('');
  const [budget, setBudget] = useState([50]);
  
  useEffect(() => {
    if (location.state?.styleProfile?.dominantStyle) {
      const quizStyle = location.state.styleProfile.dominantStyle;
      const matchedStyle = styles.find(s => s.id === quizStyle);
      if (matchedStyle) {
        setStyle(matchedStyle.id);
      }
    }
    
    const savedImagesFromStorage = localStorage.getItem('savedDesignImages');
    if (savedImagesFromStorage) {
      try {
        setSavedImages(JSON.parse(savedImagesFromStorage));
      } catch (error) {
        console.error('Error parsing saved images:', error);
      }
    }
  }, [location.state]);
  
  useEffect(() => {
    generatePrompt(room, style, colorScheme, budget[0]);
  }, [room, style, colorScheme, budget]);
  
  const generatePrompt = (
    selectedRoom: string,
    selectedStyle: string,
    selectedColorScheme: string,
    selectedBudget: number
  ) => {
    const roomName = rooms.find(r => r.id === selectedRoom)?.name || 'room';
    const styleName = styles.find(s => s.id === selectedStyle)?.name || 'style';
    
    let budgetDesc = '';
    if (selectedBudget < 30) {
      budgetDesc = 'budget-friendly, affordable';
    } else if (selectedBudget < 70) {
      budgetDesc = 'mid-range quality';
    } else {
      budgetDesc = 'luxury, high-end';
    }
    
    let colorDesc = selectedColorScheme 
      ? `with ${selectedColorScheme} color scheme` 
      : '';
    
    let referenceDesc = referenceImage 
      ? 'using the uploaded reference image for inspiration' 
      : '';
    
    const basePrompt = `A photorealistic interior design for a ${styleName} ${roomName}, ${budgetDesc} ${colorDesc} ${referenceDesc}. The space should have great lighting, feature realistic furniture, decor, and textures. 8k, detailed render, interior design photography`;
    
    setPrompt(basePrompt);
  };
  
  const handleGenerate = async () => {
    if (!apiKey && !demoMode) {
      toast.error('Please enter your Runware API key or use Demo Mode');
      setShowApiKeyInput(true);
      return;
    }
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for the design');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      let generatedImage;
      
      if (demoMode) {
        const mockDesign = getRandomMockDesign(room, style);
        generatedImage = mockDesignToGeneratedImage(mockDesign);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        const runwareService = getRunwareService(apiKey);
        
        generatedImage = await runwareService.generateImage({
          positivePrompt: prompt,
          width: 1024,
          height: 768
        });
      }
      
      setGeneratedImages(prev => [generatedImage, ...prev]);
      toast.success('Design generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate design. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const saveImage = (image: GeneratedImage) => {
    const updatedSavedImages = [...savedImages, image];
    setSavedImages(updatedSavedImages);
    localStorage.setItem('savedDesignImages', JSON.stringify(updatedSavedImages));
    
    const galleryImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    localStorage.setItem('galleryImages', JSON.stringify([...galleryImages, image]));
    
    toast.success('Design saved to My Gallery!');
  };
  
  const handleDownloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `surana-design-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Design downloaded!');
  };
  
  const handleShareImage = (imageUrl: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'My Surana AI Design',
        text: 'Check out this interior design I created with Surana AI!',
        url: imageUrl,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(imageUrl);
      toast.success('Image URL copied to clipboard!');
    }
  };
  
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('runwareApiKey', apiKey);
      setShowApiKeyInput(false);
      setDemoMode(false);
      toast.success('API key saved!');
    } else {
      toast.error('Please enter a valid API key or use Demo Mode');
    }
  };
  
  const enableDemoMode = () => {
    setDemoMode(true);
    setShowApiKeyInput(false);
    toast.success('Demo Mode enabled! You can now generate designs without an API key.');
  };
  
  const handleReferenceImage = (imageUrl: string) => {
    setReferenceImage(imageUrl);
    generatePrompt(room, style, colorScheme, budget[0]);
  };
  
  if (showApiKeyInput) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Wand className="h-12 w-12 mx-auto text-accent mb-4" />
              <h2 className="text-3xl font-serif font-bold">AI Design Generator</h2>
              <p className="text-muted-foreground mt-2">
                Transform your space with AI-powered interior design visualizations
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-lg font-medium">Enter your Runware AI API Key</h3>
              <p className="text-muted-foreground text-sm">
                The AI design generator requires a Runware AI API key. You can get one by signing up at{" "}
                <a href="https://runware.ai" target="_blank" rel="noreferrer" className="text-accent underline">
                  runware.ai
                </a>
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="flex gap-2">
                <Button onClick={saveApiKey} className="w-full">Save API Key</Button>
                <Button onClick={enableDemoMode} variant="outline" className="w-full">Use Demo Mode</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Your API key is stored locally on your device and not sent to Surana AI servers.
                Demo Mode uses pre-generated designs and doesn't require an API key.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/" className="text-accent hover:text-accent-foreground transition-colors">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/design-generator" className="text-foreground">Design Generator</Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue="generate" className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif font-bold">AI Design Generator</h2>
          <TabsList>
            <TabsTrigger value="generate" className="flex items-center gap-1">
              <Wand className="h-4 w-4" /> Generate
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-1">
              <Palette className="h-4 w-4" /> My Designs
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="shadow-lg h-full">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <Label htmlFor="room" className="text-base font-medium">Room Type</Label>
                    <div className="mt-2">
                      <RoomTypeSelector 
                        rooms={rooms} 
                        selectedRoom={room} 
                        onChange={setRoom} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="style" className="text-base font-medium">Design Style</Label>
                    <div className="mt-2">
                      <StyleSelector 
                        styles={styles} 
                        selectedStyle={style} 
                        onChange={setStyle} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="colorScheme" className="text-base font-medium">Color Scheme</Label>
                    <div className="mt-2">
                      <ColorSchemeSelector 
                        colorSchemes={colorSchemes} 
                        selectedColorScheme={colorScheme} 
                        onChange={setColorScheme} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Budget Level</Label>
                    <div className="mt-2 px-2">
                      <Slider
                        value={budget}
                        onValueChange={setBudget}
                        max={100}
                        step={1}
                        className="mt-6"
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>Budget</span>
                        <span>Mid-range</span>
                        <span>Luxury</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="reference" className="text-base font-medium">Reference Image (Optional)</Label>
                    <div className="mt-2">
                      <ImageUpload onImageUpload={handleReferenceImage} />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="prompt" className="text-base font-medium">Design Prompt</Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the design you want to generate..."
                      className="mt-2 h-24"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Edit the prompt to customize your design further.
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleGenerate}
                    className="w-full"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand className="mr-2 h-4 w-4" />
                        Generate Design
                      </>
                    )}
                  </Button>
                  
                  <div className="text-xs text-center text-muted-foreground">
                    {demoMode ? (
                      <span>Demo Mode Active - Using sample designs</span>
                    ) : (
                      <Button
                        variant="link"
                        className="text-xs p-0 h-auto"
                        onClick={() => setShowApiKeyInput(true)}
                      >
                        Update API Key
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="shadow-lg h-full">
                <CardContent className="p-6">
                  {generatedImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center p-6">
                      <Image className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                      <h3 className="text-xl font-medium text-muted-foreground">No designs generated yet</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        Configure your design preferences and click "Generate Design" to create your first interior design.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium">Your Generated Designs</h3>
                      <div className="grid grid-cols-1 gap-6">
                        {generatedImages.map((image, index) => (
                          <div key={index} className="relative overflow-hidden rounded-lg shadow-md">
                            <img
                              src={image.imageURL}
                              alt={`Generated design ${index + 1}`}
                              className="w-full h-auto object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 flex justify-between items-center">
                              <div className="text-white text-sm truncate max-w-[70%]">
                                Design {index + 1}
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-white hover:text-white hover:bg-white/20"
                                  onClick={() => saveImage(image)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-white hover:text-white hover:bg-white/20"
                                  onClick={() => handleDownloadImage(image.imageURL)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-white hover:text-white hover:bg-white/20"
                                  onClick={() => handleShareImage(image.imageURL)}
                                >
                                  <Share className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="gallery">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-6">Your Saved Designs</h3>
              
              {savedImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-center p-6">
                  <Palette className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                  <h3 className="text-xl font-medium text-muted-foreground">No saved designs yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Generate designs and save your favorites to view them here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedImages.map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg shadow-md">
                      <img
                        src={image.imageURL}
                        alt={`Saved design ${index + 1}`}
                        className="w-full h-auto aspect-[4/3] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 flex justify-between items-center">
                        <div className="text-white text-sm truncate max-w-[70%]">
                          Design {index + 1}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/20"
                            onClick={() => handleDownloadImage(image.imageURL)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/20"
                            onClick={() => handleShareImage(image.imageURL)}
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignGenerator;
