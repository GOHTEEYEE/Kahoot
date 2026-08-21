"use client";

import { SettingsComingSoon } from "../../../components/settings/SettingsClient";
import { SETTINGS_I18N } from "../../../lib/i18n/settings";
import { useLocale } from "../../../lib/i18n/useLocale";

export default function SettingsTermsPage() {
  const { locale } = useLocale();
  return <SettingsComingSoon title={SETTINGS_I18N[locale].terms} />;
}
