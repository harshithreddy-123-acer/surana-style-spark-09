
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Save, Download, Share, Image, Wand, Palette } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getRunwareService, GeneratedImage } from './RunwareService';

interface Room {
  id: string;
  name: string;
}

interface Style {
  id: string;
  name: string;
}

const rooms: Room[] = [
  { id: 'living-room', name: 'Living Room' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'bathroom', name: 'Bathroom' },
  { id: 'dining-room', name: 'Dining Room' },
  { id: 'office', name: 'Home Office' },
  { id: 'outdoor', name: 'Outdoor Space' },
];

const styles: Style[] = [
  { id: 'modern', name: 'Modern' },
  { id: 'traditional', name: 'Traditional' },
  { id: 'scandinavian', name: 'Scandinavian' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'bohemian', name: 'Bohemian' },
  { id: 'mid-century', name: 'Mid-Century Modern' },
  { id: 'farmhouse', name: 'Farmhouse' },
  { id: 'coastal', name: 'Coastal' },
  { id: 'contemporary', name: 'Contemporary' },
];

const DesignGenerator = () => {
  const location = useLocation();
  const [room, setRoom] = useState('living-room');
  const [style, setStyle] = useState('modern');
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('runwareApiKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('runwareApiKey'));
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [savedImages, setSavedImages] = useState<GeneratedImage[]>([]);
  
  // Optional settings
  const [colorScheme, setColorScheme] = useState('');
  const [budget, setBudget] = useState([50]); // Mid-range by default (0-100 scale)
  
  useEffect(() => {
    // If we have style preference from the quiz, use it
    if (location.state?.styleProfile?.dominantStyle) {
      const quizStyle = location.state.styleProfile.dominantStyle;
      const matchedStyle = styles.find(s => s.id === quizStyle);
      if (matchedStyle) {
        setStyle(matchedStyle.id);
      }
    }
    
    // Load saved images from localStorage
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
    // Generate initial prompt when room or style changes
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
    
    const basePrompt = `A photorealistic interior design for a ${styleName} ${roomName}, ${budgetDesc} ${colorDesc}. The space should have great lighting, feature realistic furniture, decor, and textures. 8k, detailed render, interior design photography`;
    
    setPrompt(basePrompt);
  };
  
  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error('Please enter your Runware API key first.');
      setShowApiKeyInput(true);
      return;
    }
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for the design.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const runwareService = getRunwareService(apiKey);
      
      const generatedImage = await runwareService.generateImage({
        positivePrompt: prompt,
        width: 1024,
        height: 768
      });
      
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
    
    // Also store for the gallery
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
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(imageUrl);
      toast.success('Image URL copied to clipboard!');
    }
  };
  
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('runwareApiKey', apiKey);
      setShowApiKeyInput(false);
      toast.success('API key saved!');
    } else {
      toast.error('Please enter a valid API key');
    }
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
              <Button onClick={saveApiKey} className="w-full">Save API Key</Button>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Your API key is stored locally on your device and not sent to Surana AI servers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
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
                    <Select value={room} onValueChange={setRoom}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((roomOption) => (
                          <SelectItem key={roomOption.id} value={roomOption.id}>
                            {roomOption.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="style" className="text-base font-medium">Design Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((styleOption) => (
                          <SelectItem key={styleOption.id} value={styleOption.id}>
                            {styleOption.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="colorScheme" className="text-base font-medium">Color Scheme (Optional)</Label>
                    <Select value={colorScheme} onValueChange={setColorScheme}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select colors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any colors</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="warm">Warm</SelectItem>
                        <SelectItem value="cool">Cool</SelectItem>
                        <SelectItem value="monochromatic">Monochromatic</SelectItem>
                        <SelectItem value="bold">Bold & Colorful</SelectItem>
                        <SelectItem value="pastel">Pastel</SelectItem>
                        <SelectItem value="earth tone">Earth Tones</SelectItem>
                      </SelectContent>
                    </Select>
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
                  
                  <p className="text-xs text-center text-muted-foreground">
                    <Button
                      variant="link"
                      className="text-xs p-0 h-auto"
                      onClick={() => setShowApiKeyInput(true)}
                    >
                      Update API Key
                    </Button>
                  </p>
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
