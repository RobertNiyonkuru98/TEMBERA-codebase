// French translations - using English as fallback with French overrides from JSON files
import { en } from '../en';
import frCommon from './common.json';
import frAuth from './auth.json';
import frHome from './home.json';
import frItineraries from './itineraries.json';
import frDetail from './detail.json';
import frShowcase from './showcase.json';
import frRoles from './roles.json';

export const fr = {
  ...en,
  ...frCommon,
  ...frAuth,
  ...frHome,
  ...frItineraries,
  ...frDetail,
  ...frShowcase,
  ...frRoles,
} as const;
