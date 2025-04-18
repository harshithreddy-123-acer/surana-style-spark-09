
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Download, Share, Trash, Search, Filter, UserCircle, Download as DownloadIcon } from 'lucide-react';
import { GeneratedImage } from './RunwareService';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<GeneratedImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GeneratedImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    // Load gallery images from localStorage
    const loadedImages = localStorage.getItem('galleryImages');
    const designImages = localStorage.getItem('savedDesignImages');
    
    let allImages: GeneratedImage[] = [];
    
    if (loadedImages) {
      try {
        allImages = [...allImages, ...JSON.parse(loadedImages)];
      } catch (error) {
        console.error('Error parsing gallery images:', error);
      }
    }
    
    if (designImages) {
      try {
        const parsedDesignImages = JSON.parse(designImages);
        // Avoid duplicates
        const uniqueDesignImages = parsedDesignImages.filter((img: GeneratedImage) => 
          !allImages.some(existingImg => existingImg.imageURL === img.imageURL)
        );
        allImages = [...allImages, ...uniqueDesignImages];
      } catch (error) {
        console.error('Error parsing design images:', error);
      }
    }
    
    setGalleryImages(allImages);
    setFilteredImages(allImages);
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredImages(galleryImages);
    } else {
      const filtered = galleryImages.filter(image => 
        image.positivePrompt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  }, [searchQuery, galleryImages]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleDownloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `surana-design-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
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
  
  const openDeleteDialog = (imageUrl: string) => {
    setImageToDelete(imageUrl);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteImage = () => {
    if (!imageToDelete) return;
    
    const updatedImages = galleryImages.filter(image => image.imageURL !== imageToDelete);
    setGalleryImages(updatedImages);
    setFilteredImages(updatedImages);
    
    // Update localStorage
    localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
    
    // Also update savedDesignImages if present
    const savedDesigns = localStorage.getItem('savedDesignImages');
    if (savedDesigns) {
      try {
        const parsedDesigns = JSON.parse(savedDesigns);
        const updatedDesigns = parsedDesigns.filter((img: GeneratedImage) => img.imageURL !== imageToDelete);
        localStorage.setItem('savedDesignImages', JSON.stringify(updatedDesigns));
      } catch (error) {
        console.error('Error updating saved designs:', error);
      }
    }
    
    toast.success('Image deleted successfully');
    setIsDeleteDialogOpen(false);
    setImageToDelete(null);
  };
  
  const openImageDetail = (image: GeneratedImage) => {
    setSelectedImage(image);
  };
  
  const closeImageDetail = () => {
    setSelectedImage(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold">My Gallery</h2>
            <p className="text-muted-foreground">Your saved designs and inspirations</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {filteredImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <UserCircle className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                <h3 className="text-xl font-medium text-foreground">Your gallery is empty</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Generate designs in the designer section and save them to your gallery.
                </p>
                <Button className="mt-4" asChild>
                  <a href="/design-generator">Go to Designer</a>
                </Button>
              </div>
            ) : (
              <div className="image-grid">
                {filteredImages.map((image, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-md">
                    <img
                      src={image.imageURL}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover aspect-[4/3] cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => openImageDetail(image)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                        <div className="text-white text-sm truncate max-w-[60%]">
                          {image.positivePrompt ? image.positivePrompt.substring(0, 30) + '...' : `Design ${index + 1}`}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20"
                            onClick={() => handleDownloadImage(image.imageURL)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20"
                            onClick={() => handleShareImage(image.imageURL)}
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white hover:text-white hover:bg-destructive/20"
                            onClick={() => openDeleteDialog(image.imageURL)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Image detail dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={closeImageDetail}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Design Details</DialogTitle>
              <DialogDescription>
                {selectedImage.positivePrompt || 'No description available'}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 rounded-md overflow-hidden">
              <img 
                src={selectedImage.imageURL} 
                alt="Design" 
                className="w-full h-auto"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline"
                onClick={() => handleDownloadImage(selectedImage.imageURL)}
              >
                <DownloadIcon className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button
                onClick={() => handleShareImage(selectedImage.imageURL)}
              >
                <Share className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteImage}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
