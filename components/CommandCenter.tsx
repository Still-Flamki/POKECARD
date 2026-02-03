
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Realm } from '../types';

interface CommandCenterProps {
  activeRealm: Realm;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ activeRealm }) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
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
        
        const combined = (finalTranscript || interimTranscript).trim();
        if (combined) setInputText(combined);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInputText('');
      setResponse(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setResponse(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a high-tech terminal AI analyzing a Pokemon specimen.
      Current Specimen: ${activeRealm.toUpperCase()}
      Command received: "${inputText}"
      
      Provide a brief, technical, "in-universe" analysis (max 2 sentences). 
      Use futuristic terminology like "neural sync", "elemental flux", "biometric signature".
      Format as a concise technical log entry.`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      setResponse(result.text || "NO DATA RETURNED FROM CORE.");
    } catch (error) {
      setResponse("ERROR: NEURAL LINK INTERRUPTED.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-20 duration-1000">
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[30px] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Response Bubble */}
        { (response || isProcessing) && (
          <div className="px-6 py-4 border-b border-white/5 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Core Processor Output</span>
            </div>
            <div className="text-[11px] font-bold text-white/80 leading-relaxed italic">
              {isProcessing ? (
                <span className="animate-pulse">DECRYPTING INPUT STREAM...</span>
              ) : (
                `> ${response}`
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 p-1 relative">
          <button 
            onClick={toggleListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative group ${isListening ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
          >
            {isListening && (
              <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-30" />
            )}
            <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'} text-sm ${isListening ? 'text-white' : 'text-emerald-500'}`}></i>
          </button>

          <div className="flex-1 relative group">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
              placeholder={isListening ? "Listening..." : "Neural command..."}
              className={`w-full h-12 bg-white/5 border border-white/10 rounded-full px-6 text-xs font-bold tracking-wider placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all ${isListening ? 'text-emerald-400 placeholder:text-emerald-500/20' : 'text-white'}`}
            />
          </div>

          <button 
            onClick={handleProcess}
            disabled={!inputText.trim() || isProcessing}
            className="h-12 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:grayscale transition-all flex items-center gap-2"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Process</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
