// Kinyarwanda translations - using English as fallback with Kinyarwanda overrides from JSON files
import { en } from '../en';
import rwCommon from './common.json';
import rwAuth from './auth.json';
import rwHome from './home.json';
import rwItineraries from './itineraries.json';
import rwDetail from './detail.json';
import rwShowcase from './showcase.json';

export const rw = {
  ...en,
  ...rwCommon,
  ...rwAuth,
  ...rwHome,
  ...rwItineraries,
  ...rwDetail,
  ...rwShowcase,
} as const;
