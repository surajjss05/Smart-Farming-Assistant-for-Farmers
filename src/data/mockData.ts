import { FarmProfile, DiseaseDiagnosis } from '../types/farm';

export interface SampleLeaf {
  id: string;
  name: string;
  crop: string;
  thumbnailSvg: string;
  notes: string;
  diagnosis: DiseaseDiagnosis;
}

export const sampleLeafPresets: SampleLeaf[] = [
  {
    id: 'cercospora-leaf-spot',
    name: 'Brown Leaf Spot & Blight',
    crop: 'Soybean (JS-335)',
    notes: 'Brown circular spots with chlorotic halo observed on lower canopy leaves',
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <radialGradient id="leafGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="%2384cc16"/>
          <stop offset="60%" stop-color="%234d7c0f"/>
          <stop offset="100%" stop-color="%23365314"/>
        </radialGradient>
      </defs>
      <path d="M80 15 C120 40 145 90 120 135 C100 150 70 150 45 130 C20 85 40 40 80 15 Z" fill="url(%23leafGrad)"/>
      <path d="M80 18 Q80 80 82 145" stroke="%23365314" stroke-width="3" fill="none"/>
      <path d="M80 60 Q110 50 120 65" stroke="%23365314" stroke-width="1.8" fill="none"/>
      <path d="M80 85 Q50 75 35 90" stroke="%23365314" stroke-width="1.8" fill="none"/>
      <path d="M81 110 Q105 105 115 118" stroke="%23365314" stroke-width="1.8" fill="none"/>
      <!-- Brown Spots -->
      <circle cx="65" cy="80" r="10" fill="%2378350f" stroke="%23facc15" stroke-width="2"/>
      <circle cx="65" cy="80" r="5" fill="%23451a03"/>
      <circle cx="102" cy="72" r="8" fill="%2378350f" stroke="%23facc15" stroke-width="1.5"/>
      <circle cx="102" cy="72" r="3.5" fill="%23451a03"/>
      <circle cx="85" cy="120" r="7" fill="%2378350f" stroke="%23facc15" stroke-width="1.5"/>
      <circle cx="50" cy="115" r="6" fill="%2378350f"/>
    </svg>`,
    diagnosis: {
      diseaseName: 'Cercospora Leaf Spot (Tikka / Brown Spot)',
      pathogenType: 'Fungal Infection (Cercospora sojina)',
      confidence: 93,
      severity: 'Moderate (Action Recommended within 48h)',
      severityLevel: 'moderate',
      symptoms: [
        'Circular to angular reddish-brown lesions with distinct dark borders',
        'Chlorotic yellow halos surrounding spots on upper leaf surfaces',
        'Premature yellowing and drying of lower canopy leaves'
      ],
      causes: [
        'High relative humidity (> 80%) coupled with warm temperatures (25-30°C)',
        'Prolonged leaf wetness following rain showers or overhead irrigation',
        'Dense plant spacing limiting sunlight penetration in inner canopy'
      ],
      immediateActions: [
        'Prune and safely destroy severely infected lower leaves away from the field',
        'Ensure furrow drainage channels are free of standing water',
        'Avoid handling or walking through wet crop foliage to prevent spore dispersal'
      ],
      organicRemedies: [
        'Spray Pseudomonas fluorescens (bio-agent) at 5g/litre of water in late afternoon',
        'Apply 5% Neem Seed Kernel Extract (NSKE) spray as organic leaf shield',
        'Foliar spray of 10% fermented cow urine (Gomutra) mixed with Dashparni ark'
      ],
      preventiveMeasures: [
        'Follow minimum 2-year crop rotation with non-host graminaceous crops (Maize/Sorghum)',
        'Adopt wide row spacing (45 cm) for improved airflow and sunlight penetration',
        'Treat seeds with Trichoderma harzianum @ 4g/kg prior to future sowing'
      ],
      expertConsultationNote: 'If lesions spread beyond 20% leaf canopy or enter pod stage, consult your local Krishi Vigyan Kendra (KVK) or block agricultural extension officer before chemical fungicide selection.'
    }
  },
  {
    id: 'powdery-mildew-sample',
    name: 'Powdery White Mildew',
    crop: 'Tomato / Vegetables',
    notes: 'White talcum powder coating visible on leaf surface with leaf curling',
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <radialGradient id="powGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="%2365a30d"/>
          <stop offset="100%" stop-color="%231e3a12"/>
        </radialGradient>
      </defs>
      <path d="M80 15 C130 50 140 100 115 135 C95 155 65 150 45 130 C20 85 40 40 80 15 Z" fill="url(%23powGrad)"/>
      <path d="M80 18 Q80 80 82 145" stroke="%231e3a12" stroke-width="2.5" fill="none"/>
      <!-- Powdery Patches -->
      <ellipse cx="70" cy="70" rx="18" ry="14" fill="%23f8fafc" opacity="0.85"/>
      <ellipse cx="100" cy="95" rx="20" ry="15" fill="%23f8fafc" opacity="0.8"/>
      <ellipse cx="60" cy="110" rx="14" ry="11" fill="%23f8fafc" opacity="0.75"/>
      <ellipse cx="88" cy="45" rx="12" ry="9" fill="%23f8fafc" opacity="0.7"/>
    </svg>`,
    diagnosis: {
      diseaseName: 'Powdery Mildew (Oidium / Leveillula taurica)',
      pathogenType: 'Obligate Fungal Pathogen',
      confidence: 91,
      severity: 'Moderate',
      severityLevel: 'moderate',
      symptoms: [
        'White talcum powder-like fungal patches on leaf surfaces and tender stems',
        'Leaves curl upwards, turn brittle, and drop prematurely',
        'Reduced photosynthesis causing stunted growth and undersized fruit setting'
      ],
      causes: [
        'Dry daytime temperatures (28-32°C) coupled with cool, humid nights (85% RH)',
        'Heavy nitrogen fertilizer application promoting soft succulent tissue'
      ],
      immediateActions: [
        'Carefully excise heavily encrusted leaves and bag them directly to avoid blowing spores',
        'Discontinue overhead water sprinkler passes immediately'
      ],
      organicRemedies: [
        'Spray fresh milk dilution (100ml raw milk in 900ml water) in bright morning sunshine',
        'Baking soda spray: 5 grams potassium/sodium bicarbonate + 2ml liquid soap per litre of water',
        'Neem oil 0.5% emulsion spray targeting both leaf sides'
      ],
      preventiveMeasures: [
        'Plant mildew-tolerant certified varieties',
        'Ensure 6-8 hours of direct unobstructed sunlight reach the crop canopy'
      ],
      expertConsultationNote: 'Consult your local block agronomist if powdery spread covers more than 30% of foliage.'
    }
  },
  {
    id: 'cotton-leaf-curl',
    name: 'Leaf Curl & Sucking Pest Damage',
    crop: 'Cotton (Bt Hybrid)',
    notes: 'Upward cup curling of leaves with thickened veins and stunted terminals',
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="curlGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%2384cc16"/>
          <stop offset="40%" stop-color="%23eab308"/>
          <stop offset="100%" stop-color="%234d7c0f"/>
        </linearGradient>
      </defs>
      <path d="M80 20 C125 35 135 85 110 125 C85 145 65 140 45 125 C25 85 45 35 80 20 Z" fill="url(%23curlGrad)"/>
      <path d="M80 22 Q78 80 82 140" stroke="%23451a03" stroke-width="3" fill="none"/>
      <!-- Curled Margins -->
      <path d="M45 125 Q30 95 45 65 Q60 45 75 30" stroke="%23ca8a04" stroke-width="4" stroke-dasharray="3,3" fill="none"/>
      <path d="M110 125 Q130 95 115 65 Q100 45 85 30" stroke="%23ca8a04" stroke-width="4" stroke-dasharray="3,3" fill="none"/>
    </svg>`,
    diagnosis: {
      diseaseName: 'Cotton Leaf Curl Viral Complex (CLCuV) & Whitefly Vector',
      pathogenType: 'Begomovirus transmitted by Bemisia tabaci (Whitefly)',
      confidence: 89,
      severity: 'High (Immediate Vector Suppression Required)',
      severityLevel: 'high',
      symptoms: [
        'Upward curling and puckering of leaf margins into a boat/cup shape',
        'Thickening and dark green swelling of primary and secondary leaf veins',
        'Enation (leaf-like outgrowths) on the underside of major veins with stunting'
      ],
      causes: [
        'High population of whitefly vectors breeding during warm, dry spells',
        'Weed hosts like Abutilon indicum growing adjacent to farm borders'
      ],
      immediateActions: [
        'Install yellow sticky traps (15-20 traps per acre) at crop canopy height to capture whiteflies',
        'Rogue out and bury severely stunted plants in early growth stage'
      ],
      organicRemedies: [
        'Foliar spray of 5% Neem Seed Kernel Extract (NSKE) or Verticillium lecanii (bio-fungus) @ 5g/L',
        'Spray fish oil rosin soap (25g/L) to dissolve insect protective cuticle'
      ],
      preventiveMeasures: [
        'Sow border rows of Maize, Jowar, or Bajra (4 rows) to act as biological physical barrier against whiteflies',
        'Avoid excessive synthetic pyrethroids which kill natural whitefly predators like ladybird beetles'
      ],
      expertConsultationNote: 'Urgent: Consult university cotton scientist or KVK officer to assess threshold levels and select targeted vector management.'
    }
  },
  {
    id: 'healthy-leaf-sample',
    name: 'Vibrant Healthy Foliage',
    crop: 'Rice / Soybean / Vegetable',
    notes: 'Deep green, uniform texture, no spots, optimum chlorophyll activity',
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <radialGradient id="healthyGrad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="%234ade80"/>
          <stop offset="55%" stop-color="%2316a34a"/>
          <stop offset="100%" stop-color="%2314532d"/>
        </radialGradient>
      </defs>
      <path d="M80 12 C125 40 145 90 120 135 C100 152 70 152 45 132 C20 85 40 38 80 12 Z" fill="url(%23healthyGrad)"/>
      <path d="M80 15 Q80 80 82 145" stroke="%2314532d" stroke-width="2.5" fill="none"/>
      <path d="M80 50 Q110 40 120 55" stroke="%2314532d" stroke-width="1.6" fill="none"/>
      <path d="M80 75 Q50 65 35 80" stroke="%2314532d" stroke-width="1.6" fill="none"/>
      <path d="M81 100 Q108 95 118 108" stroke="%2314532d" stroke-width="1.6" fill="none"/>
      <!-- Sun Shine Sparkle -->
      <polygon points="65,45 68,52 75,55 68,58 65,65 62,58 55,55 62,52" fill="%23ffffff" opacity="0.8"/>
    </svg>`,
    diagnosis: {
      diseaseName: 'Healthy Crop Foliage (No Pathogen Detected)',
      pathogenType: 'None (Healthy plant tissue)',
      confidence: 96,
      severity: 'None (Optimal Health)',
      severityLevel: 'healthy',
      symptoms: [
        'Vibrant, deep green leaf pigmentation indicating robust chlorophyll synthesis',
        'Uniform leaf venation without chlorosis, spots, or mosaic mottling',
        'Active turgor pressure with crisp, undamaged leaf margins'
      ],
      causes: [
        'Balanced soil nutrient uptake and well-managed irrigation scheduling',
        'Effective baseline soil microbiome activity'
      ],
      immediateActions: [
        'Maintain balanced drip fertigation schedule according to current growth stage',
        'Continue regular bi-weekly pest scouting on lower leaf undersides'
      ],
      organicRemedies: [
        'Periodic preventive application of Panchagavya or seaweed bio-stimulant foliar spray',
        'Install yellow and blue sticky traps to monitor early sucking pest arrivals'
      ],
      preventiveMeasures: [
        'Maintain optimal soil organic carbon and mulch layers to sustain root biology'
      ],
      expertConsultationNote: 'Your crop health is currently in top 10% condition. Document current management practices for future seasons.'
    }
  }
];

export const initialFarmProfile: FarmProfile = {
  id: 'farm-101',
  farmerName: 'Ramesh Patel',
  phone: '+91 98220 12345',
  location: 'Satara District, Maharashtra',
  state: 'Maharashtra',
  coordinates: {
    latitude: 17.6805,
    longitude: 73.9972
  },
  totalAcres: 4.5,
  soilType: 'Black Cotton Soil (Regur)',
  soilData: {
    ph: 6.8,
    nitrogen: 195,
    phosphorus: 28,
    potassium: 310,
    moisture: 64,
    organicCarbon: 0.68,
    fertilityRating: 'Good'
  },
  currentCrop: {
    name: 'Soybean',
    variety: 'JS-335 / JS-9305',
    sowingDate: '2026-06-25',
    growthStage: 'Pod Development (R5)',
    daysAfterSowing: 68,
    expectedMaturityDays: 95,
    irrigationType: 'Drip & Furrow Backup',
    waterSource: 'Borewell & Farm Pond'
  },
  resources: {
    tractorAvailable: true,
    storageCapacityQuintals: 60,
    storageType: 'Ventilated Pucca Godown',
    labourAvailability: 'Adequate',
    dripCoveragePercent: 80
  }
};
