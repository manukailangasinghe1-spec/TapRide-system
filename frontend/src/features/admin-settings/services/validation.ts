import { CURRENCIES, LANGUAGES, TIME_ZONES } from '../data/options';
import type { GeneralSettings, SettingsFormErrors } from '../types';

export const SYSTEM_NAME_MAX_LENGTH = 60;

/**
 * Validate the General panel form. Returns an error map; an empty object means
 * valid. Called on Save, and again on every keystroke so a fixed field's
 * error clears as soon as the value is legal.
 */
export function validateGeneralSettings(values: GeneralSettings): SettingsFormErrors {
  const errors: SettingsFormErrors = {};
  const name = values.systemName.trim();

  if (!name) {
    errors.systemName = 'System name is required.';
  } else if (name.length > SYSTEM_NAME_MAX_LENGTH) {
    errors.systemName = `System name must be ${SYSTEM_NAME_MAX_LENGTH} characters or fewer.`;
  }
  if (!TIME_ZONES.some((option) => option.value === values.timeZone)) {
    errors.timeZone = 'Choose a time zone from the list.';
  }
  if (!CURRENCIES.some((option) => option.value === values.currency)) {
    errors.currency = 'Choose a currency from the list.';
  }
  if (!LANGUAGES.some((option) => option.value === values.language)) {
    errors.language = 'Choose a language from the list.';
  }

  return errors;
}
