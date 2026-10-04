import { Language } from '../types/farm';

export interface Translations {
  appName: string;
  tagline: string;
  demoBadge: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  farmIntelligenceToday: string;
  tabs: {
    dashboard: string;
    farm: string;
    farmSatellite: string;
    cropRecommendation: string;
    yieldForecast: string;
    profitOptimizer: string;
    cropHealth: string;
    marketPrices: string;
    weather: string;
    harvestPlanner: string;
    logistics: string;
    analytics: string;
    chatbot: string;
  };
  metrics: {
    weather: string;
    expectedYield: string;
    estimatedProfit: string;
    cropHealthScore: string;
    farmRisk: string;
    temperature: string;
    humidity: string;
    rainProb: string;
    windSpeed: string;
  };
  actions: {
    analyze: string;
    calculate: string;
    uploadPhoto: string;
    saveChanges: string;
    askAi: string;
    resetDemo: string;
    viewDetails: string;
    hold: string;
    sell: string;
    refreshData: string;
  };
  cropHealth: {
    title: string;
    subtitle: string;
    uploadInstructions: string;
    orChoosePreset: string;
    diagnosing: string;
    diagnosisResult: string;
    symptoms: string;
    causes: string;
    severity: string;
    immediateActions: string;
    organicRemedies: string;
    preventiveMeasures: string;
    expertAdvisory: string;
  };
  riskLevels: {
    low: string;
    medium: string;
    high: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'KisanAI',
    tagline: 'Smart Farming Assistant & Decision Platform',
    demoBadge: 'Demo Farm (Satara, MH)',
    greetingMorning: 'Good Morning',
    greetingAfternoon: 'Good Afternoon',
    greetingEvening: 'Good Evening',
    farmIntelligenceToday: "Here is your actionable farm intelligence for today.",
    tabs: {
      dashboard: 'Dashboard',
      farm: 'My Farm & Soil',
      farmSatellite: 'Satellite Farm View',
      cropRecommendation: 'Crop Advisory',
      yieldForecast: 'Yield Forecast',
      profitOptimizer: 'Profit Optimizer',
      cropHealth: 'Crop Health (Pest/Disease)',
      marketPrices: 'Market Intelligence',
      weather: 'Weather & Alerts',
      harvestPlanner: 'Harvest Planner',
      logistics: 'Logistics & Sales',
      analytics: 'Analytics & Risk',
      chatbot: 'Kisan AI Chatbot'
    },
    metrics: {
      weather: "Today's Weather",
      expectedYield: 'Expected Yield',
      estimatedProfit: 'Estimated Profit',
      cropHealthScore: 'Crop Health',
      farmRisk: 'Farm Risk Index',
      temperature: 'Temperature',
      humidity: 'Humidity',
      rainProb: 'Rainfall Probability',
      windSpeed: 'Wind Speed'
    },
    actions: {
      analyze: 'Analyze Farm Data',
      calculate: 'Recalculate Profit',
      uploadPhoto: 'Upload Crop Photo',
      saveChanges: 'Save Farm Profile',
      askAi: 'Ask Kisan AI',
      resetDemo: 'Reset Demo Data',
      viewDetails: 'View Details',
      hold: 'Hold Stock',
      sell: 'Sell at Mandi',
      refreshData: 'Refresh Real-Time Data'
    },
    cropHealth: {
      title: 'AI Crop Health & Disease Scanner',
      subtitle: 'Identify fungal blights, viral curl, pests & nutrient deficiencies from leaf photos',
      uploadInstructions: 'Drag & drop a crop photo or click to browse / use camera',
      orChoosePreset: 'Or select a realistic field leaf sample to test:',
      diagnosing: 'AI is analyzing leaf venation, lesions & pathogens...',
      diagnosisResult: 'Disease Detection Result',
      symptoms: 'Identified Symptoms',
      causes: 'Probable Environmental Causes',
      severity: 'Disease Severity',
      immediateActions: 'Immediate Field Actions',
      organicRemedies: 'Bio-Control & Organic Solutions',
      preventiveMeasures: 'Future Preventive Strategy',
      expertAdvisory: 'Official Agricultural Advisory'
    },
    riskLevels: {
      low: 'Low Risk',
      medium: 'Medium Risk',
      high: 'High Risk'
    }
  },
  hi: {
    appName: 'किसान AI',
    tagline: 'स्मार्ट कृषि सहायक एवं निर्णय मंच',
    demoBadge: 'डेमो खेत (सतारा, महाराष्ट्र)',
    greetingMorning: 'सुप्रभात',
    greetingAfternoon: 'शुभ दोपहर',
    greetingEvening: 'शुभ संध्या',
    farmIntelligenceToday: 'आज के लिए आपकी संपूर्ण कृषि जानकारी व सलाह प्रस्तुत है।',
    tabs: {
      dashboard: 'मुख्य डैशबोर्ड',
      farm: 'मेरा खेत व मिट्टी',
      farmSatellite: 'सैटेलाइट खेत दृश्य',
      cropRecommendation: 'फसल सिफारिश',
      yieldForecast: 'उपज पूर्वानुमान',
      profitOptimizer: 'लाभ अनुकूलन',
      cropHealth: 'फसल स्वास्थ्य व रोग',
      marketPrices: 'मंडी भाव व रुझान',
      weather: 'मौसम व चेतावनी',
      harvestPlanner: 'कटाई योजना',
      logistics: 'रसद व परिवहन',
      analytics: 'विश्लेषण व जोखिम',
      chatbot: 'किसान AI चैटबॉट'
    },
    metrics: {
      weather: 'आज का मौसम',
      expectedYield: 'अनुमानित उपज',
      estimatedProfit: 'अपेक्षित शुद्ध लाभ',
      cropHealthScore: 'फसल स्वास्थ्य स्कोर',
      farmRisk: 'खेत जोखिम स्तर',
      temperature: 'तापमान',
      humidity: 'आर्द्रता (नमी)',
      rainProb: 'बारिश की संभावना',
      windSpeed: 'हवा की गति'
    },
    actions: {
      analyze: 'खेत डेटा का विश्लेषण करें',
      calculate: 'पुनर्गणना करें',
      uploadPhoto: 'पत्ती का फोटो अपलोड करें',
      saveChanges: 'प्रोफाइल सहेजें',
      askAi: 'किसान AI से पूछें',
      resetDemo: 'डेमो डेटा रीसेट करें',
      viewDetails: 'विस्तार से देखें',
      hold: 'माल रोकें (होल्ड)',
      sell: 'मंडी में बेचें',
      refreshData: 'डेटा अपडेट करें'
    },
    cropHealth: {
      title: 'AI फसल स्वास्थ्य एवं रोग जांच',
      subtitle: 'पत्ती के फोटो से फफूंद, वायरस, कीट और पोषक तत्वों की कमी की त्वरित पहचान',
      uploadInstructions: 'फोटो यहां खींचकर लाएं या फोन कैमरे / गैलरी से चुनें',
      orChoosePreset: 'या तुरंत परीक्षण के लिए नमूना पत्ती चुनें:',
      diagnosing: 'AI पत्ती की नसों, धब्बों और रोगजनकों का विश्लेषण कर रहा है...',
      diagnosisResult: 'रोग पहचान परिणाम',
      symptoms: 'पहचाने गए लक्षण',
      causes: 'संभावित मौसमी कारण',
      severity: 'रोग की गंभीरता',
      immediateActions: 'तत्काल खेत में करने योग्य उपाय',
      organicRemedies: 'जैविक व सुरक्षित उपचार',
      preventiveMeasures: 'दीर्घकालिक रोकथाम उपाय',
      expertAdvisory: 'कृषि विशेषज्ञ सलाह'
    },
    riskLevels: {
      low: 'कम जोखिम',
      medium: 'मध्यम जोखिम',
      high: 'उच्च जोखिम'
    }
  },
  mr: {
    appName: 'किसान AI',
    tagline: 'स्मार्ट कृषी सहाय्यक व निर्णय मंच',
    demoBadge: 'डेमो शेत (सातारा, महाराष्ट्र)',
    greetingMorning: 'शुभ सकाळ',
    greetingAfternoon: 'शुभ दुपार',
    greetingEvening: 'शुभ संध्याकाळ',
    farmIntelligenceToday: 'आजच्या दिवसासाठी आपल्या शेतीची अचूक माहिती व कृषी सल्ला खालीलप्रमाणे आहे.',
    tabs: {
      dashboard: 'मुख्य डॅशबोर्ड',
      farm: 'माझे शेत व माती',
      farmSatellite: 'सॅटेलाइट शेत नकाशा',
      cropRecommendation: 'पीक शिफारस',
      yieldForecast: 'उत्पादन अंदाज',
      profitOptimizer: 'नफा वाढवा (कॅल्क्युलेटर)',
      cropHealth: 'पीक आरोग्य व कीड-रोग',
      marketPrices: 'बाजार भाव व कल',
      weather: 'हवामान व इशारे',
      harvestPlanner: 'काढणी नियोजन',
      logistics: 'वाहतूक व विक्री व्यवस्था',
      analytics: 'विश्लेषण व जोखीम',
      chatbot: 'किसान AI सहाय्यक'
    },
    metrics: {
      weather: 'आजचे हवामान',
      expectedYield: 'अपेक्षित उत्पादन',
      estimatedProfit: 'अपेक्षित निव्वळ नफा',
      cropHealthScore: 'पीक आरोग्य गुणवत्ता',
      farmRisk: 'शेती जोखीम निर्देशांक',
      temperature: 'तापमान',
      humidity: 'हवेतील आर्द्रता',
      rainProb: 'पावसाची शक्यता',
      windSpeed: 'वाऱ्याचा वेग'
    },
    actions: {
      analyze: 'माहितीचे विश्लेषण करा',
      calculate: 'नफ्याची फेरगणना करा',
      uploadPhoto: 'पानाचा फोटो अपलोड करा',
      saveChanges: 'माहिती सेव्ह करा',
      askAi: 'किसान AI ला विचारा',
      resetDemo: 'डेमो शेत रीसेट करा',
      viewDetails: 'सविस्तर पहा',
      hold: 'माल साठवा (थांबा)',
      sell: 'बाजारात विका',
      refreshData: 'डेटा रिफ्रेश करा'
    },
    cropHealth: {
      title: 'AI पीक आरोग्य व कीड-रोग निदान',
      subtitle: 'पानाच्या फोटोवरून बुरशीजन्य रोग, करपा, व्हायरस आणि पोषण कमतरतेचे अचूक निदान',
      uploadInstructions: 'फोटो येथे ड्रॅग करा किंवा मोबाईल कॅमेऱ्याने फोटो काढा',
      orChoosePreset: 'किंवा चाचणीसाठी खालील नमुना पानावर क्लिक करा:',
      diagnosing: 'AI पानावरील डाग, बुरशी व लक्षणांचे सूक्ष्म विश्लेषण करत आहे...',
      diagnosisResult: 'रोग निदान निकाल',
      symptoms: 'दिसून आलेली लक्षणे',
      causes: 'हवामान व मूळ कारणे',
      severity: 'रोगाची तीव्रता',
      immediateActions: 'त्वरित शेतात करावयाचे उपाय',
      organicRemedies: 'सेंद्रिय व जैविक औषधोपचार',
      preventiveMeasures: 'पुढील हंगामासाठी प्रतिबंधात्मक नियोजन',
      expertAdvisory: 'कृषी विज्ञान केंद्र (KVK) सल्ला'
    },
    riskLevels: {
      low: 'कमी जोखीम',
      medium: 'मध्यम जोखीम',
      high: 'जास्त जोखीम'
    }
  }
};
