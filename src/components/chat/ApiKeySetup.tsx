
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ApiKeySetupProps {
  apiKey: string;
  geminiApiKey: string;
  setApiKey: (key: string) => void;
  setGeminiApiKey: (key: string) => void;
  saveApiKey: () => void;
  saveGeminiApiKey: () => void;
}

const ApiKeySetup = ({
  apiKey,
  geminiApiKey,
  setApiKey,
  setGeminiApiKey,
  saveApiKey,
  saveGeminiApiKey
}: ApiKeySetupProps) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <Bot className="h-12 w-12 mx-auto text-accent mb-4" />
            <h2 className="text-3xl font-serif font-bold">AI Design Assistant</h2>
            <p className="text-muted-foreground mt-2">
              Set up your AI credentials to get started
            </p>
          </div>
          
          <div className="max-w-md mx-auto space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Enter your Runware AI API Key</h3>
              <p className="text-muted-foreground text-sm">
                Get your API key from{" "}
                <a href="https://runware.ai" target="_blank" rel="noreferrer" className="text-accent underline">
                  runware.ai
                </a>
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Runware API key"
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button onClick={saveApiKey} className="w-full">Save Runware API Key</Button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Enter your Gemini AI API Key</h3>
              <p className="text-muted-foreground text-sm">
                Get your API key from{" "}
                <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-accent underline">
                  Google AI Studio
                </a>
              </p>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Enter Gemini API key"
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button onClick={saveGeminiApiKey} className="w-full">Save Gemini API Key</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySetup;
