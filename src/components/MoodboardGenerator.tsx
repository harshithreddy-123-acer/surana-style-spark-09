
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Search, Plus, X, Download, Copy, Palette, BookImage, 
  Move, Trash, Save, Loader2, Share, Upload, FolderPlus, ImagePlus, Image
} from 'lucide-react';
import { getRunwareService, GeneratedImage } from './RunwareService';
import { ImageUpload } from '@/components/ui/image-upload';

interface MoodboardItem {
  id: string;
  type: 'image' | 'color' | 'text';
  content: string;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
}

const sampleImages = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505409628601-edc9af17fda6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1615529179035-e760f6a2dcee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1532372320572-cda25653a694?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
];

const sampleColors = [
  '#E8C4C4', '#F7EDE2', '#D8E2DC', '#FAD2E1', '#ECE4DB', 
  '#EDDCD2', '#D0F2EB', '#FDE2E4', '#99C1B9', '#E2CFC4',
  '#FFF1E6', '#F0EFEB', '#A2BDDA', '#FFC7C7', '#DCEAEB',
];

const MoodboardGenerator = () => {
  const [moodboardItems, setMoodboardItems] = useState<MoodboardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState('images');
  const [isSearching, setIsSearching] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('runwareApiKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('runwareApiKey'));
  const [savedMoodboards, setSavedMoodboards] = useState<{name: string, items: MoodboardItem[]}[]>([]);
  const [moodboardName, setMoodboardName] = useState('My Moodboard');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<MoodboardItem | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentZIndex, setCurrentZIndex] = useState(1);
  const [isDraggingExternalImage, setIsDraggingExternalImage] = useState(false);
  const [searchSource, setSearchSource] = useState<'generated' | 'unsplash'>('unsplash');
  
  const moodboardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load saved moodboards from localStorage
    const savedBoards = localStorage.getItem('savedMoodboards');
    if (savedBoards) {
      try {
        setSavedMoodboards(JSON.parse(savedBoards));
      } catch (error) {
        console.error('Error parsing saved moodboards:', error);
      }
    }
  }, []);
  
  // Handle dropping external images
  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      
      if (!moodboardRef.current) return;
      
      const rect = moodboardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Handle image URLs
      let imageUrl = e.dataTransfer?.getData('text/plain') || '';
      
      // Check if it's a valid image URL
      if (imageUrl && (imageUrl.match(/\.(jpeg|jpg|gif|png)$/) !== null || imageUrl.startsWith('http'))) {
        addItemAtPosition('image', imageUrl, x, y);
        setIsDraggingExternalImage(false);
        return;
      }
      
      // Handle dropped files (images)
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              addItemAtPosition('image', event.target.result.toString(), x, y);
            }
          };
          reader.readAsDataURL(file);
        }
      }
      
      setIsDraggingExternalImage(false);
    };
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingExternalImage(true);
    };
    
    const handleDragLeave = () => {
      setIsDraggingExternalImage(false);
    };
    
    const moodboardElement = moodboardRef.current;
    
    if (moodboardElement) {
      moodboardElement.addEventListener('drop', handleDrop);
      moodboardElement.addEventListener('dragover', handleDragOver);
      moodboardElement.addEventListener('dragleave', handleDragLeave);
    }
    
    return () => {
      if (moodboardElement) {
        moodboardElement.removeEventListener('drop', handleDrop);
        moodboardElement.removeEventListener('dragover', handleDragOver);
        moodboardElement.removeEventListener('dragleave', handleDragLeave);
      }
    };
  }, []);
  
  const addItemAtPosition = (type: 'image' | 'color' | 'text', content: string, x: number, y: number) => {
    const newItem: MoodboardItem = {
      id: `item-${Date.now()}`,
      type,
      content,
      width: type === 'image' ? 150 : type === 'color' ? 80 : 150,
      height: type === 'image' ? 150 : type === 'color' ? 80 : 30,
      x,
      y,
      zIndex: currentZIndex,
    };
    
    setMoodboardItems([...moodboardItems, newItem]);
    setCurrentZIndex(currentZIndex + 1);
  };
  
  const fetchUnsplashImages = async (query: string) => {
    const accessKey = 'pONUi13jbIKmsL5rYOEQSouC3E2-_DXlp954chQTkhw'; // Unsplash demo API key
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`, {
        headers: {
          'Authorization': `Client-ID ${accessKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch images from Unsplash');
      }
      
      const data = await response.json();
      return data.results.map((item: any) => item.urls.regular);
    } catch (error) {
      console.error('Error fetching Unsplash images:', error);
      toast.error('Failed to fetch images. Using sample images instead.');
      return sampleImages;
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    if (selectedTab === 'images') {
      try {
        if (searchSource === 'generated' && apiKey) {
          const runwareService = getRunwareService(apiKey);
          
          const generatedImage = await runwareService.generateImage({
            positivePrompt: `Interior design element: ${searchQuery}`,
            width: 512,
            height: 512
          });
          
          setSearchResults([generatedImage.imageURL, ...sampleImages]);
        } else {
          // Use Unsplash API
          const unsplashImages = await fetchUnsplashImages(searchQuery);
          setSearchResults(unsplashImages);
        }
      } catch (error) {
        console.error('Error generating/fetching images:', error);
        toast.error('Failed to get images. Using sample images instead.');
        setSearchResults(sampleImages);
      }
    } else {
      // Just set sample colors for now
      setSearchResults(sampleColors);
    }
    
    setIsSearching(false);
  };
  
  const handleAddItem = (content: string) => {
    const newItem: MoodboardItem = {
      id: `item-${Date.now()}`,
      type: selectedTab === 'images' ? 'image' : 'color',
      content,
      width: selectedTab === 'images' ? 150 : 80,
      height: selectedTab === 'images' ? 150 : 80,
      x: Math.random() * 200,
      y: Math.random() * 200,
      zIndex: currentZIndex,
    };
    
    setMoodboardItems([...moodboardItems, newItem]);
    setCurrentZIndex(currentZIndex + 1);
  };
  
  const handleAddText = () => {
    const newItem: MoodboardItem = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Edit this text',
      width: 150,
      height: 30,
      x: Math.random() * 200,
      y: Math.random() * 200,
      zIndex: currentZIndex,
    };
    
    setMoodboardItems([...moodboardItems, newItem]);
    setCurrentZIndex(currentZIndex + 1);
  };
  
  const handleRemoveItem = (id: string) => {
    setMoodboardItems(moodboardItems.filter(item => item.id !== id));
  };
  
  const handleMouseDown = (e: React.MouseEvent, item: MoodboardItem) => {
    if (!moodboardRef.current) return;
    
    const rect = moodboardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - item.x;
    const offsetY = e.clientY - rect.top - item.y;
    
    setIsDragging(true);
    setDraggedItem(item);
    setDragOffset({ x: offsetX, y: offsetY });
    
    // Bring to front
    const updatedItems = moodboardItems.map(i => 
      i.id === item.id ? { ...i, zIndex: currentZIndex } : i
    );
    setMoodboardItems(updatedItems);
    setCurrentZIndex(currentZIndex + 1);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedItem || !moodboardRef.current) return;
    
    const rect = moodboardRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left - dragOffset.x;
    let y = e.clientY - rect.top - dragOffset.y;
    
    // Ensure item stays within the moodboard boundaries
    x = Math.max(0, Math.min(x, rect.width - draggedItem.width));
    y = Math.max(0, Math.min(y, rect.height - draggedItem.height));
    
    const updatedItems = moodboardItems.map(item => 
      item.id === draggedItem.id ? { ...item, x, y } : item
    );
    
    setMoodboardItems(updatedItems);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };
  
  const handleContentEdit = (id: string, newContent: string) => {
    const updatedItems = moodboardItems.map(item => 
      item.id === id ? { ...item, content: newContent } : item
    );
    setMoodboardItems(updatedItems);
  };
  
  const handleUploadImage = (imageUrl: string) => {
    handleAddItem(imageUrl);
    toast.success('Image uploaded and added to your moodboard');
  };
  
  const handleSaveMoodboard = () => {
    if (moodboardItems.length === 0) {
      toast.error('Your moodboard is empty. Add some items before saving.');
      return;
    }
    
    const newMoodboard = {
      name: moodboardName,
      items: moodboardItems,
    };
    
    const updatedMoodboards = [...savedMoodboards, newMoodboard];
    setSavedMoodboards(updatedMoodboards);
    localStorage.setItem('savedMoodboards', JSON.stringify(updatedMoodboards));
    toast.success('Moodboard saved successfully!');
  };
  
  const handleLoadMoodboard = (index: number) => {
    if (savedMoodboards[index]) {
      setMoodboardItems(savedMoodboards[index].items);
      setMoodboardName(savedMoodboards[index].name);
      toast.success('Moodboard loaded successfully!');
    }
  };
  
  const handleDeleteMoodboard = (index: number) => {
    const updatedMoodboards = savedMoodboards.filter((_, i) => i !== index);
    setSavedMoodboards(updatedMoodboards);
    localStorage.setItem('savedMoodboards', JSON.stringify(updatedMoodboards));
    toast.success('Moodboard deleted successfully!');
  };
  
  const handleClearMoodboard = () => {
    if (moodboardItems.length > 0) {
      if (confirm('Are you sure you want to clear the current moodboard?')) {
        setMoodboardItems([]);
        toast.info('Moodboard cleared');
      }
    }
  };
  
  const handleExportMoodboard = () => {
    if (!moodboardRef.current) return;
    
    // Use html2canvas to capture the moodboard (would need to be added as dependency)
    toast.info('Export feature coming soon!');
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
              <BookImage className="h-12 w-12 mx-auto text-accent mb-4" />
              <h2 className="text-3xl font-serif font-bold">Moodboard Generator</h2>
              <p className="text-muted-foreground mt-2">
                Create beautiful interior design moodboards to visualize your ideas
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-lg font-medium">Enter your Runware AI API Key (Optional)</h3>
              <p className="text-muted-foreground text-sm">
                The AI moodboard generator can use Runware AI to create custom images. You can get a key by signing up at{" "}
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
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Or{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => setShowApiKeyInput(false)}
                >
                  continue without an API key
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="create" className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif font-bold">Moodboard Generator</h2>
          <TabsList>
            <TabsTrigger value="create" className="flex items-center gap-1">
              <Palette className="h-4 w-4" /> Create
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1">
              <BookImage className="h-4 w-4" /> Saved
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="create">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg">
                <CardContent className="p-4 space-y-4">
                  <h3 className="text-lg font-medium">Moodboard Elements</h3>
                  
                  <div>
                    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="images">Images</TabsTrigger>
                        <TabsTrigger value="colors">Colors</TabsTrigger>
                        <TabsTrigger value="uploads">Upload</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="images" className="space-y-4 pt-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex">
                            <Input
                              type="text"
                              placeholder="Search for images..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                              className="flex-1"
                            />
                            <Button 
                              variant="outline" 
                              onClick={handleSearch}
                              disabled={isSearching}
                              className="ml-2"
                            >
                              {isSearching ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Search className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Search source:</span>
                            <div className="flex gap-2">
                              <Button
                                variant={searchSource === 'unsplash' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSearchSource('unsplash')}
                                className="h-8"
                              >
                                <Image className="h-4 w-4 mr-1" /> Unsplash
                              </Button>
                              <Button
                                variant={searchSource === 'generated' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSearchSource('generated')}
                                className="h-8"
                                disabled={!apiKey}
                                title={!apiKey ? "Set API key to enable AI generated images" : ""}
                              >
                                <Palette className="h-4 w-4 mr-1" /> AI Generated
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {searchResults.length > 0 ? (
                            searchResults.map((image, index) => (
                              <div 
                                key={index} 
                                className="aspect-square rounded-md overflow-hidden cursor-pointer relative group"
                                draggable="true"
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', image);
                                }}
                              >
                                <img 
                                  src={image} 
                                  alt={`Search result ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button 
                                    size="sm"
                                    variant="ghost"
                                    className="text-white hover:text-white hover:bg-white/20"
                                    onClick={() => handleAddItem(image)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 h-32 flex items-center justify-center text-muted-foreground text-sm">
                              {isSearching ? 'Searching...' : 'Search for images or use sample images'}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Tip: You can drag images directly to the board!
                        </p>
                      </TabsContent>
                      
                      <TabsContent value="colors" className="space-y-4 pt-4">
                        <div className="flex">
                          <Input
                            type="text"
                            placeholder="Search for colors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="ml-2"
                          >
                            {isSearching ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Search className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2">
                          {sampleColors.map((color, index) => (
                            <div 
                              key={index} 
                              className="aspect-square rounded-md cursor-pointer relative group"
                              style={{ backgroundColor: color }}
                              onClick={() => handleAddItem(color)}
                              draggable="true"
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', color);
                              }}
                            >
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                <Plus className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="uploads" className="space-y-4 pt-4">
                        <div className="flex flex-col space-y-4">
                          <ImageUpload
                            onImageUpload={handleUploadImage}
                            className="w-full"
                          />
                          <p className="text-sm text-muted-foreground">
                            Upload your own images to add to the moodboard
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div>
                    <Button 
                      variant="outline" 
                      onClick={handleAddText}
                      className="w-full"
                    >
                      Add Text
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-4 space-y-4">
                  <h3 className="text-lg font-medium">Save & Export</h3>
                  
                  <div>
                    <Label htmlFor="moodboardName">Moodboard Name</Label>
                    <Input
                      id="moodboardName"
                      value={moodboardName}
                      onChange={(e) => setMoodboardName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button onClick={handleSaveMoodboard}>
                      <Save className="mr-2 h-4 w-4" /> Save Moodboard
                    </Button>
                    <Button variant="outline" onClick={handleExportMoodboard}>
                      <Download className="mr-2 h-4 w-4" /> Export as Image
                    </Button>
                    <Button variant="outline" onClick={handleClearMoodboard}>
                      <Trash className="mr-2 h-4 w-4" /> Clear Moodboard
                    </Button>
                  </div>
                  
                  <div className="text-xs text-center text-muted-foreground">
                    <Button
                      variant="link"
                      className="text-xs p-0 h-auto"
                      onClick={() => setShowApiKeyInput(true)}
                    >
                      Update API Key
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="shadow-lg h-full">
                <CardContent className="p-4">
                  <div 
                    ref={moodboardRef}
                    className={`bg-white border ${isDraggingExternalImage ? 'border-accent border-2' : 'border-dashed border-border'} rounded-md h-[600px] w-full relative overflow-hidden`}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ cursor: isDragging ? 'grabbing' : 'default' }}
                  >
                    {moodboardItems.map((item) => (
                      <div
                        key={item.id}
                        className="absolute cursor-grab active:cursor-grabbing"
                        style={{
                          left: `${item.x}px`,
                          top: `${item.y}px`,
                          width: `${item.width}px`,
                          height: `${item.height}px`,
                          zIndex: item.zIndex,
                        }}
                      >
                        {item.type === 'image' && (
                          <div className="relative h-full group">
                            <img
                              src={item.content}
                              alt=""
                              className="w-full h-full object-cover rounded-md"
                              onMouseDown={(e) => handleMouseDown(e, item)}
                            />
                            <button
                              className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        
                        {item.type === 'color' && (
                          <div
                            className="h-full rounded-md relative group"
                            style={{ backgroundColor: item.content }}
                            onMouseDown={(e) => handleMouseDown(e, item)}
                          >
                            <button
                              className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        
                        {item.type === 'text' && (
                          <div className="relative group">
                            <textarea
                              value={item.content}
                              onChange={(e) => handleContentEdit(item.id, e.target.value)}
                              className="w-full h-full p-2 bg-transparent border-none resize-none focus:outline-none"
                              style={{ cursor: 'text' }}
                              onMouseDown={(e) => e.stopPropagation()}
                            />
                            <div 
                              className="absolute -top-3 -left-3 right-0 h-4 w-4 bg-accent rounded-full opacity-0 group-hover:opacity-100 cursor-move"
                              onMouseDown={(e) => handleMouseDown(e, item)}
                            >
                              <Move className="h-4 w-4 text-white" />
                            </div>
                            <button
                              className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isDraggingExternalImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-accent/10 pointer-events-none">
                        <div className="bg-accent/20 rounded-lg p-6 border-2 border-dashed border-accent">
                          <Upload className="h-12 w-12 text-accent mx-auto mb-2" />
                          <p className="text-accent font-medium">Drop image here</p>
                        </div>
                      </div>
                    )}
                    
                    {moodboardItems.length === 0 && !isDraggingExternalImage && (
                      <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <BookImage className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                        <h3 className="text-xl font-medium text-muted-foreground">Your moodboard is empty</h3>
                        <p className="text-muted-foreground mt-2 max-w-md">
                          Add images, colors, and text elements from the left panel to create your perfect design inspiration board.
                        </p>
                        <p className="text-muted-foreground mt-2 text-sm">
                          Tip: You can also drag and drop images directly from the web!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-6">Your Saved Moodboards</h3>
              
              {savedMoodboards.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-center p-6">
                  <BookImage className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                  <h3 className="text-xl font-medium text-muted-foreground">No saved moodboards yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Create and save moodboards to view them here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedMoodboards.map((moodboard, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-40 bg-muted relative">
                        {/* This would ideally show a preview of the moodboard */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookImage className="h-12 w-12 text-muted-foreground opacity-50" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium truncate mb-2">{moodboard.name}</h4>
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm" onClick={() => handleLoadMoodboard(index)}>
                            Load
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteMoodboard(index)}>
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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

export default MoodboardGenerator;
