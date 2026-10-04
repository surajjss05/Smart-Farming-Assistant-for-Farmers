import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  User,
  Sprout,
  CloudSun,
  Bug,
  Coins,
  Droplets,
  Calendar,
  RefreshCw,
  Mic,
  MicOff,
  Globe,
  Radio,
  AlertCircle,
  Check,
  ExternalLink,
  Zap,
  BrainCircuit,
  RotateCcw,
  Search,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage, Language, FarmProfile, GroundingSource } from '../types/farm';
import { sendChatMessage } from '../services/api';
import { translations } from '../i18n/translations';

interface AIChatbotViewProps {
  farmProfile: FarmProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateToCropHealth: () => void;
}

export type ChatbotRole = 'agronomist' | 'market_analyst' | 'schemes_expert';
export type GeminiModelChoice = 'gemini-3.8-flash' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';

export const AIChatbotView: React.FC<AIChatbotViewProps> = ({
  farmProfile,
  language,
  onLanguageChange,
  onNavigateToCropHealth
}) => {
  const t = translations[language];

  // Selected Role and Model
  const [selectedRole, setSelectedRole] = useState<ChatbotRole>('agronomist');
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('gemini-3.5-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);

  const defaultMessagesByLang: Record<Language, ChatMessage[]> = {
    en: [
      {
        id: 'msg-init',
        sender: 'bot',
        text: `Hello ${farmProfile.farmerName}! I am KisanAI, your intelligent multi-turn agricultural assistant powered by Gemini.
I have access to live Google Search Grounding for real-time market rates and weather alerts.
How can I assist your ${farmProfile.currentCrop.name} crop in ${farmProfile.location} today?`,
        timestamp: 'Just now',
        roleTitle: 'Senior Agronomist & Crop Doctor',
        modelUsed: 'gemini-3.5-flash'
      }
    ],
    hi: [
      {
        id: 'msg-init',
        sender: 'bot',
        text: `नमस्ते ${farmProfile.farmerName} जी! मैं किसान AI, आपका जेमिनी-संचालित स्मार्ट कृषि सहायक हूँ।
मेरे पास ताज़ा मंडी भाव, मौसम और कीट नियंत्रण के लिए गूगल सर्च ग्राउंडिंग (Google Search) की सुविधा उपलब्ध है।
आज आपके ${farmProfile.location} स्थित खेत के लिए क्या सहायता करूँ?`,
        timestamp: 'अभी',
        roleTitle: 'वरिष्ठ कृषि वैज्ञानिक (Agronomist)',
        modelUsed: 'gemini-3.5-flash'
      }
    ],
    mr: [
      {
        id: 'msg-init',
        sender: 'bot',
        text: `नमस्कार ${farmProfile.farmerName} शेतकरी मित्र! मी आपला जेमिनी-सक्षम स्मार्ट कृषी सहाय्यक 'किसान AI' आहे.
माझ्याकडे ताज्या बाजारभावांसाठी आणि हवामानासाठी लाइव्ह गूगल सर्च डेटा (Google Search Grounding) उपलब्ध आहे.
आपल्या ${farmProfile.location} मधील ${farmProfile.currentCrop.name} पिकाबाबत आज मी कशी मदत करू?`,
        timestamp: 'आत्ताच',
        roleTitle: 'वरिष्ठ पीक सल्लागार (Agronomist)',
        modelUsed: 'gemini-3.5-flash'
      }
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessagesByLang[language]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Web Speech API - Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Detect speech recognition support on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Quick Action Prompt Chips per Role
  const quickActionsByRole: Record<ChatbotRole, { id: string; label: string; icon: React.ReactNode; promptText: Record<Language, string> }[]> = {
    agronomist: [
      {
        id: 'qa-disease',
        label: '🐛 Yellow Leaves & Spots',
        icon: <Bug className="w-3.5 h-3.5 text-rose-700" />,
        promptText: {
          en: 'My crop leaves are turning yellow with brown spots. What is the immediate treatment?',
          hi: 'मेरी फसल की पत्तियां पीली पड़ रही हैं और भूरे धब्बे हैं। तुरंत क्या उपाय करें?',
          mr: 'माझ्या पिकाची पाने पिवळी पडून तपकिरी डाग पडत आहेत, त्वरित कोणता उपाय करावा?'
        }
      },
      {
        id: 'qa-crop',
        label: '🌱 Best Sowing for Soil',
        icon: <Sprout className="w-3.5 h-3.5 text-emerald-700" />,
        promptText: {
          en: `What is the optimal rabi crop rotation for ${farmProfile.soilType} with pH ${farmProfile.soilData.ph}?`,
          hi: `${farmProfile.soilType} मिट्टी में सोयाबीन के बाद कौन सी रबी फसल सबसे उपयुक्त है?`,
          mr: `माझ्या ${farmProfile.soilType} जमिनीत रब्बी हंगामात कोणते पीक सर्वात फायदेशीर ठरेल?`
        }
      },
      {
        id: 'qa-weather',
        label: '🌦️ Rain & Spray Safety',
        icon: <CloudSun className="w-3.5 h-3.5 text-sky-700" />,
        promptText: {
          en: 'Is it safe to spray foliar nutrition today given current humidity and rain forecast?',
          hi: 'क्या आज के मौसम और बारिश के अनुमान को देखते हुए दवा छिड़काव सुरक्षित है?',
          mr: 'हवामानाचा अंदाज पाहता आज शेतात कीटकनाशक किंवा खतांची फवारणी करणे सुरक्षित आहे का?'
        }
      }
    ],
    market_analyst: [
      {
        id: 'qa-mandi-live',
        label: '💰 Live Mandi Price Search',
        icon: <Globe className="w-3.5 h-3.5 text-blue-700" />,
        promptText: {
          en: `Search latest live APMC mandi prices for ${farmProfile.currentCrop.name} in Maharashtra today.`,
          hi: `आज महाराष्ट्र में ${farmProfile.currentCrop.name} के ताज़ा मंडी भाव और आवक क्या हैं?`,
          mr: `आज महाराष्ट्रातील मुख्य बाजार समित्यांमध्ये ${farmProfile.currentCrop.name}चे ताजे बाजारभाव काय आहेत?`
        }
      },
      {
        id: 'qa-sell-hold',
        label: '⏳ Sell Now vs Hold',
        icon: <Coins className="w-3.5 h-3.5 text-amber-700" />,
        promptText: {
          en: `Considering recent price trends and storage costs, should I sell my harvest now or hold for 10 days?`,
          hi: 'बाजार भाव के रुझान को देखते हुए क्या फसल अभी बेचें या 10 दिन रोककर रखें?',
          mr: 'बाजारभावातील चढउतार पाहता माल आता विकावा की काही दिवस साठवून ठेवावा?'
        }
      },
      {
        id: 'qa-logistics-arbitrage',
        label: '🚚 Mandi Transport Profit',
        icon: <Coins className="w-3.5 h-3.5 text-emerald-700" />,
        promptText: {
          en: 'How much higher price in distant wholesale mandis covers transportation freight costs?',
          hi: 'दूर की बड़ी मंडी में ले जाने पर कितना अतिरिक्त दाम मिलने से भाड़ा वसूल हो जाता है?',
          mr: 'मोठ्या बाजारपेठेत माल नेल्यास वाहतूक खर्च वजा जाता किती निव्वळ नफा जास्त मिळू शकतो?'
        }
      }
    ],
    schemes_expert: [
      {
        id: 'qa-pm-kisan',
        label: '📋 PM-Kisan Status & E-KYC',
        icon: <Calendar className="w-3.5 h-3.5 text-teal-700" />,
        promptText: {
          en: 'What are the required documents and latest guidelines for PM-Kisan Samman Nidhi installment?',
          hi: 'पीएम-किसान सम्मान निधि की अगली किस्त के लिए ई-केवाईसी और आवश्यक नियम क्या हैं?',
          mr: 'पीएम-किसान योजनेच्या हप्त्यासाठी ई-केवायसी आणि आवश्यक कागदपत्रे कोणती आहेत?'
        }
      },
      {
        id: 'qa-crop-insurance',
        label: '🛡️ Fasal Bima Claim Steps',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700" />,
        promptText: {
          en: 'How to report localized crop damage under PM Fasal Bima Yojana within 72 hours?',
          hi: 'पीएम फसल बीमा योजना के तहत बेमौसम बारिश से नुकसान की सूचना 72 घंटे में कैसे दर्ज करें?',
          mr: 'अवेळी पावसामुळे पिकांचे नुकसान झाल्यास पीक विमा योजनेत ७२ तासांत तक्रार कशी नोंदवावी?'
        }
      },
      {
        id: 'qa-solar-subsidy',
        label: '☀️ Solar Pump Subsidy',
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
        promptText: {
          en: 'What is the government subsidy percentage for agricultural solar water pumps (PM-KUSUM)?',
          hi: 'पीएम-कुसुम योजना के तहत सोलर पंप पर किसानों को कितनी सब्सिडी मिलती है?',
          mr: 'पीएम-कुसुम योजनेअंतर्गत सौर कृषी पंपावर किती टक्के शासकीय अनुदान मिळते?'
        }
      }
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech API - Start/Stop Recognition
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    try {
      setSpeechError(null);
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      if (language === 'mr') {
        recognition.lang = 'mr-IN';
      } else if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setInputText(prev => (prev ? `${prev} ${final}`.trim() : final));
          setInterimTranscript('');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError(
            language === 'mr'
              ? 'मायक्रोफोन परवानगी नाकारली गेली आहे. कृपया ब्राऊझर सेटिंग्जमध्ये मायक्रोफोन सुरू करा.'
              : language === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन चालू करें।'
              : 'Microphone access denied. Please allow microphone permission in your browser.'
          );
        } else if (event.error !== 'no-speech') {
          setSpeechError(
            language === 'mr'
              ? 'आवाज ओळखण्यात अडचण आली. कृपया पुन्हा बोला.'
              : language === 'hi'
              ? 'आवाज स्पष्ट नहीं सुनाई दी। कृपया दोबारा बोलें।'
              : 'Could not capture speech. Please try speaking again.'
          );
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setInterimTranscript('');
    setIsLoading(true);

    try {
      // Multi-turn context: send conversation history
      const historyPayload = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await sendChatMessage({
        message: text,
        language,
        history: historyPayload,
        model: selectedModel,
        role: selectedRole,
        useSearchGrounding: useSearchGrounding
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: response.model || selectedModel,
        roleTitle: response.roleTitle,
        groundingSources: response.sources
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'bot',
        text:
          language === 'mr'
            ? 'माफ करा, तात्पुरत्या नेटवर्क समस्येमुळे उत्तर मिळण्यास अडचण येत आहे. कृपया पुन्हा प्रयत्न करा.'
            : language === 'hi'
            ? 'माफ कीजिए, नेटवर्क समस्या के कारण उत्तर नहीं मिल पाया। कृपया पुनः प्रयास करें।'
            : 'Apologies, temporary network issue. Please check your network and retry your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech audio output
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleClearHistory = () => {
    setMessages(defaultMessagesByLang[language]);
  };

  const getLanguageLabel = () => {
    if (language === 'mr') return 'मराठी (Marathi)';
    if (language === 'hi') return 'हिन्दी (Hindi)';
    return 'English (India)';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto pb-4">
      {/* Header bar of Chatbot */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs mb-3 space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-800 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-black text-base text-stone-900">KisanAI Gemini Assistant</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-600" />
                  Google Search Grounded
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Multi-turn conversation thread • {farmProfile.farmerName} ({farmProfile.location})
              </p>
            </div>
          </div>

          {/* Quick Actions (Reset & Language Switch) */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Start a new multi-turn conversation thread"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>

            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  language === 'en' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-stone-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  language === 'hi' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-stone-600'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('mr')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  language === 'mr' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-stone-600'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>
        </div>

        {/* Role Switcher & Gemini Model Selector Bar */}
        <div className="pt-2 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Specific Chatbot Role Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <span className="text-[11px] font-bold text-stone-500 shrink-0">Role:</span>
            {[
              { id: 'agronomist', label: '🌱 Crop Doctor', desc: 'Agronomy & IPM' },
              { id: 'market_analyst', label: '📈 Mandi Strategist', desc: 'Prices & Selling' },
              { id: 'schemes_expert', label: '📋 Schemes Specialist', desc: 'Govt Subsidies' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id as ChatbotRole)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  selectedRole === r.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          {/* Model Selector & Google Search Grounding Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-xl border border-stone-200 text-[11px] font-semibold">
              <span className="text-stone-500 px-1">Model:</span>
              <button
                onClick={() => setSelectedModel('gemini-3.5-flash')}
                className={`px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 ${
                  selectedModel === 'gemini-3.5-flash' || selectedModel === 'gemini-3.8-flash'
                    ? 'bg-white text-emerald-900 font-bold shadow-2xs border border-emerald-300'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Gemini 3.5 Flash: General farming tasks with Google Search Grounding"
              >
                <Globe className="w-3 h-3 text-emerald-600" />
                <span>3.5 Flash (General)</span>
              </button>

              <button
                onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                className={`px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 ${
                  selectedModel === 'gemini-3.1-pro-preview'
                    ? 'bg-white text-indigo-900 font-bold shadow-2xs border border-indigo-300'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Gemini 3.1 Pro: Complex agricultural reasoning, financial models & deep plans"
              >
                <BrainCircuit className="w-3 h-3 text-indigo-600" />
                <span>3.1 Pro (Complex)</span>
              </button>

              <button
                onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                className={`px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'bg-white text-amber-900 font-bold shadow-2xs border border-amber-300'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Gemini 3.1 Flash Lite: Fast Q&A and instant quick responses"
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span>3.1 Lite (Fast)</span>
              </button>
            </div>

            {/* Google Search Grounding Indicator / Toggle */}
            <button
              type="button"
              onClick={() => setUseSearchGrounding(!useSearchGrounding)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
                useSearchGrounding
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-stone-50 text-stone-500 border-stone-200'
              }`}
              title="Toggle Google Search Grounding for real-time web verification"
            >
              <Search className="w-3 h-3" />
              <span>Search Grounding {useSearchGrounding ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role-based Quick Action Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 shrink-0 no-scrollbar">
        {quickActionsByRole[selectedRole].map(action => (
          <button
            key={action.id}
            onClick={() => handleSend(action.promptText[language])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs font-semibold text-stone-700 whitespace-nowrap shadow-xs transition-colors"
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Active Voice Listening Banner */}
      {isListening && (
        <div className="mb-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md flex items-center justify-between animate-fadeIn shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-white animate-ping absolute"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-white relative"></span>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>
                  {language === 'mr'
                    ? '🎙️ किसान AI ऐकत आहे... (मराठीत बोला)'
                    : language === 'hi'
                    ? '🎙️ किसान AI सुन रहा है... (हिंदी में बोलें)'
                    : '🎙️ Kisan AI is listening... (Speak in English)'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 font-medium italic mt-0.5">
                {interimTranscript
                  ? `"${interimTranscript}..."`
                  : language === 'mr'
                  ? 'आपला प्रश्न बोला (उदा. "पावसाचा अंदाज काय आहे?")'
                  : language === 'hi'
                  ? 'अपना सवाल बोलें (उदा. "सोयाबीन में कौन सी खाद डालें?")'
                  : 'Speak your question clearly into your device microphone...'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleListening}
            className="px-3 py-1.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs shrink-0"
          >
            {language === 'mr' ? 'पूर्ण झाले (Stop)' : language === 'hi' ? 'पूर्ण हुआ (Stop)' : 'Done (Stop)'}
          </button>
        </div>
      )}

      {/* Speech Error Banner */}
      {speechError && (
        <div className="mb-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{speechError}</span>
          </div>
          <button
            onClick={() => setSpeechError(null)}
            className="text-[11px] font-bold text-rose-800 underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Message History Area (Scrollable Thread) */}
      <div className="flex-1 bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-xs">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-stone-50 border border-stone-200 text-stone-900 rounded-bl-xs'
                }`}
              >
                {/* Bot Role & Model Badge */}
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-stone-200/70 text-[10px] font-bold text-emerald-900 flex-wrap">
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                      {msg.roleTitle || 'KisanAI Agronomist'}
                    </span>
                    {msg.modelUsed && (
                      <span className="font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">
                        {msg.modelUsed}
                      </span>
                    )}
                    {msg.groundingSources && msg.groundingSources.length > 0 && (
                      <span className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5 text-sky-600" />
                        Search Grounded
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-line font-normal">{msg.text}</div>

                {/* Google Search Grounding Sources Drawer */}
                {!isUser && msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                      <Globe className="w-3 h-3 text-sky-600" />
                      Google Search Grounding Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingSources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-emerald-400 text-[11px] font-medium text-stone-700 hover:text-emerald-900 transition-colors shadow-2xs max-w-xs truncate"
                          title={source.title || source.uri}
                        >
                          <ExternalLink className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate">{source.title || new URL(source.uri).hostname}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`mt-2 pt-1 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-emerald-100' : 'text-stone-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="p-1 rounded hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors"
                      title="Listen aloud in your language"
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-800" />
                      )}
                      <span>
                        {language === 'mr' ? 'ऐका' : language === 'hi' ? 'सुनें' : 'Listen'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-800" />
              <span>
                {selectedModel === 'gemini-3.5-flash' && useSearchGrounding ? (
                  language === 'mr'
                    ? 'गूगल सर्च डेटा आणि कृषी सल्ला शोधत आहे...'
                    : language === 'hi'
                    ? 'गूगल सर्च और कृषि जानकारी खोजी जा रही है...'
                    : 'Querying Google Search Grounding & agronomist models...'
                ) : (
                  language === 'mr'
                    ? 'किसान AI कृषी माहिती शोधत आहे...'
                    : language === 'hi'
                    ? 'किसान AI उत्तर तैयार कर रहा है...'
                    : 'Kisan AI is analyzing farm guidelines...'
                )}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice & Text Input Bar */}
      <div className="mt-3 bg-white p-2.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 shrink-0">
        {/* Native Web Speech API Microphone Button */}
        {speechSupported ? (
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 shadow-xs ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
            }`}
            title={
              language === 'mr'
                ? 'मराठीत बोलण्यासाठी क्लिक करा'
                : language === 'hi'
                ? 'हिंदी में बोलने के लिए दबाएं'
                : 'Click to speak your question in English'
            }
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-emerald-800" />
            )}
          </button>
        ) : null}

        {/* Input Text Box */}
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={
            isListening
              ? language === 'mr'
                ? 'ऐकत आहे... (मराठीत बोला)'
                : language === 'hi'
                ? 'सुन रहा हूँ... (हिंदी में बोलें)'
                : 'Listening... (Speak in English)'
              : language === 'mr'
              ? 'आपला शेतीविषयक प्रश्न येथे टाइप करा किंवा माइक वापरा...'
              : language === 'hi'
              ? 'अपना कृषि प्रश्न यहाँ लिखें या माइक का उपयोग करें...'
              : `Ask ${farmProfile.farmerName}'s agricultural question or search live prices...`
          }
          className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold transition-all shadow-xs shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
