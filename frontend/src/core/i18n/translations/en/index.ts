import common from './common.json';
import auth from './auth.json';
import home from './home.json';
import itineraries from './itineraries.json';
import detail from './detail.json';
import bookings from './bookings.json';
import profile from './profile.json';
import showcase from './showcase.json';
import company from './company.json';
import admin from './admin.json';

export const en = {
  ...common,
  ...auth,
  ...home,
  ...itineraries,
  ...detail,
  ...bookings,
  ...profile,
  ...showcase,
  ...company,
  ...admin,
} as const;

export type TranslationKey = keyof typeof en;
