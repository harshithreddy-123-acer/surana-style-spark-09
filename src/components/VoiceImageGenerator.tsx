
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mic, MicOff, Image as ImageIcon, Loader2, Save, Download, RefreshCw } from 'lucide-react';
import { getRunwareService, GeneratedImage } from './RunwareService';

const VoiceImageGenerator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('runwareApiKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('runwareApiKey'));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    // Initialize speech recognition if available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        stopRecording();
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.info("Listening... Speak to describe the design you want.");
      } else {
        toast.error("Speech recognition not supported by your browser.");
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check your permissions.');
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error('Please enter your Runware API key first.');
      setShowApiKeyInput(true);
      return;
    }
    
    if (!transcript.trim()) {
      toast.error('Please record or type a description first.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const runwareService = getRunwareService(apiKey);
      
      const prompt = `Interior design: ${transcript}`;
      const result = await runwareService.generateImage({
        positivePrompt: prompt,
        width: 1024,
        height: 768
      });
      
      setGeneratedImage(result);
      toast.success('Design generated successfully!');
      
      // Save to gallery
      const galleryImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
      localStorage.setItem('galleryImages', JSON.stringify([...galleryImages, result]));
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate design. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveImage = () => {
    if (!generatedImage) return;
    
    // Save to saved designs
    const savedImages = JSON.parse(localStorage.getItem('savedDesignImages') || '[]');
    localStorage.setItem('savedDesignImages', JSON.stringify([...savedImages, generatedImage]));
    
    toast.success('Design saved to My Gallery!');
  };
  
  const handleDownloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage.imageURL;
    link.download = `surana-voice-design-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Design downloaded!');
  };
  
  const handleReset = () => {
    setTranscript('');
    setGeneratedImage(null);
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
              <Mic className="h-12 w-12 mx-auto text-accent mb-4" />
              <h2 className="text-3xl font-serif font-bold">Voice to Design</h2>
              <p className="text-muted-foreground mt-2">
                Describe your ideal space with your voice and see it come to life
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-lg font-medium">Enter your Runware AI API Key</h3>
              <p className="text-muted-foreground text-sm">
                The voice-to-design generator requires a Runware AI API key. You can get one by signing up at{" "}
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h2 className="text-3xl font-serif font-bold mb-6">Voice to Design Generator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-center">
              <Button
                size="lg"
                className={`rounded-full w-16 h-16 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                onClick={toggleRecording}
                disabled={isGenerating}
              >
                {isRecording ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">
                {isRecording ? 'Listening...' : 'Press the button and speak'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRecording
                  ? 'Describe the interior design you want to create'
                  : 'Click the microphone and describe your ideal space'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="transcript">Your Description</Label>
              <Textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Your voice transcript will appear here, or type manually..."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleGenerate}
                disabled={isGenerating || !transcript.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Design
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
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
        
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {generatedImage ? (
              <div className="space-y-4">
                <div className="rounded-md overflow-hidden">
                  <img
                    src={generatedImage.imageURL}
                    alt="Generated design"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleSaveImage}>
                    <Save className="mr-2 h-4 w-4" /> Save to Gallery
                  </Button>
                  <Button variant="outline" onClick={handleDownloadImage}>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                <h3 className="text-xl font-medium text-muted-foreground">No design generated yet</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Use your voice to describe the interior design you'd like to see, then click "Generate Design" to create it.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceImageGenerator;
