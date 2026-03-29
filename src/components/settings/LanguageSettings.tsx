// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { useMemo } from "react";
import { Stack, Select, RadioGroup, Radio } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useStoreActions, useStoreState } from "../../store";
import { SettingsSection } from "./SettingsSection";

export function LanguageSettings() {
  const { t, i18n } = useTranslation();
  const displayLangPrefs = useMemo(
    () => [
      { value: "en", display: "English", credit: "" },
      // { value: "en-GB", display: "English (British)", credit: "" },
      // { value: "lol-PEKO", display: "English (PEKO)", credit: "" },
      {
        value: "ja-JP",
        display: "日本語",
        credit: "Saginomiya#2353, ぴーまん#2976",
      },
      // { value: "zh-TW", display: "繁體中文", credit: "angel84326#7887" },
      // { value: "zh-CN", display: "简体中文", credit: "ttg#6038" },
      // { value: "ko-KR", display: "한국어", credit: "AlexKoala#0253" },
      // { value: "es-MX", display: "Español Latino", credit: "Aldo#3682" },
      // { value: "ms-MY", display: "Bahasa Melayu", credit: "Admiy#8261" },
      // { value: "id-ID", display: "Bahasa Indonesia", credit: "alcyneous#2803" },
      // {
      //   value: "de-DE",
      //   display: "Deutsch",
      //   credit: "Doubleturtle#3660",
      // },
      // { value: "tr-TR", display: "Türkçe", credit: "creeperkafasipw#1861" },
      // { value: "vi-VN", display: "Tiếng Việt", credit: "Frincess" },
      // { value: "hu-HU", display: "Magyar", credit: "kuroihikikomori#7216" },
    ],
    [],
  );

  const channelNamePrefs = useMemo(
    () => [
      { value: "english_name", display: t("English") },
      { value: "name", display: t("Original Name on YouTube (Japanese, etc)") },
    ],
    [t],
  );

  const useEN = useStoreState((s) => s.settings.useEN);
  const changeUseEN = useStoreActions((s) => s.settings.setUseEN);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <SettingsSection title={t("Interface Language")}>
        <Select
          onChange={(e) => changeLanguage(e.target.value)}
          defaultValue={i18n.language}
        >
          {displayLangPrefs.map((opt) => (
            <option value={opt.value} key={`i18n-${opt.value}`}>
              {opt.display}
            </option>
          ))}
        </Select>
      </SettingsSection>
      <SettingsSection title={t("Channel Name")}>
        <RadioGroup
          defaultValue={useEN ? "english_name" : "name"}
          onChange={(e) => changeUseEN(e === "english_name")}
        >
          <Stack>
            {channelNamePrefs.map((opt) => (
              <Radio value={opt.value} key={`useEN-${opt.value}`}>
                {opt.display}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </SettingsSection>
    </>
  );
}
