
import { useState } from 'react';
import { toast } from 'sonner';

export const useApiKeyManagement = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('runwareApiKey') || '');
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('geminiApiKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('runwareApiKey'));
  const [showGeminiApiKeyInput, setShowGeminiApiKeyInput] = useState(!localStorage.getItem('geminiApiKey'));

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('runwareApiKey', apiKey);
      setShowApiKeyInput(false);
      toast.success('Runware API key saved!');
    } else {
      toast.error('Please enter a valid Runware API key');
    }
  };

  const saveGeminiApiKey = () => {
    if (geminiApiKey.trim()) {
      localStorage.setItem('geminiApiKey', geminiApiKey);
      setShowGeminiApiKeyInput(false);
      toast.success('Gemini API key saved!');
    } else {
      toast.error('Please enter a valid Gemini API key');
    }
  };

  return {
    apiKey,
    geminiApiKey,
    showApiKeyInput,
    showGeminiApiKeyInput,
    setApiKey,
    setGeminiApiKey,
    saveApiKey,
    saveGeminiApiKey,
    setShowApiKeyInput,
    setShowGeminiApiKeyInput
  };
};
