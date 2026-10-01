export type SourceType = 'travel_diary' | 'telegram' | 'tip';

export interface ItineraryItem {
  id: string;
  text: string;
  source: SourceType;
}

export interface DaySchedule {
  day: number;
  date: string;
  title: string;
  hotel: string;
  meal: string;
  items: ItineraryItem[];
}

export interface GeneralInfoItem {
  id: string;
  text: string;
  source?: SourceType;
}

export type IconKey = 'ShieldCheck' | 'Phone' | 'CreditCard' | 'AlertCircle' | 'Sparkles';

export interface GeneralInfoSection {
  categoryKey: string;
  title: string;
  iconName: IconKey;
  items: GeneralInfoItem[];
}

export type ActiveTab = 'GENERAL INFO' | 'ITINERARY' | 'YOUR NOTES';

export interface TelegramExportMessage {
  id: number;
  type: string;
  date: string;
  from: string;
  text: string | Array<string | Record<string, unknown>>;
}

export interface TelegramExport {
  name?: string;
  type?: string;
  id?: number;
  messages?: TelegramExportMessage[];
}

export interface AIEnrichmentPayload {
  travel_diary_base: DaySchedule[];
  telegram_chat?: string;
  new_tips?: string;
}

export interface GeneralInfoUpdate {
  category?: string;
  text: string;
  id?: string;
  source?: SourceType;
}

export interface ItineraryInjection {
  day: number;
  text: string;
  source: SourceType;
  id?: string;
}

export interface AIEnrichmentResponse {
  generalInfoUpdates: GeneralInfoUpdate[];
  injections: ItineraryInjection[];
}

export interface ProcessedAIUpdates {
  generalInfoUpdates: GeneralInfoItem[];
  itineraryUpdates: Array<ItineraryInjection & { id: string }>;
}