
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceRecordingButtonProps {
  isRecording: boolean;
  toggleRecording: () => void;
  isLoading: boolean;
}

const VoiceRecordingButton = ({ 
  isRecording, 
  toggleRecording, 
  isLoading 
}: VoiceRecordingButtonProps) => {
  return (
    <Button
      onClick={toggleRecording}
      variant="outline"
      size="icon"
      className={isRecording ? 'bg-red-100' : ''}
      disabled={isLoading}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceRecordingButton;
