import { ref } from 'vue'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'
import ja from './locales/ja.json'

const messages = {
  en,
  'zh-CN': zhCN,
  ja
}

const normalize = (value) => (value ? value.toLowerCase() : '')

const detectLanguage = () => {
  const candidates = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language]

  for (const lang of candidates) {
    const normalized = normalize(lang)
    if (normalized.startsWith('zh')) return 'zh-CN'
    if (normalized.startsWith('ja')) return 'ja'
    if (normalized.startsWith('en')) return 'en'
  }

  return 'en'
}

const locale = ref(detectLanguage())

const resolveMessage = (source, key) => key
  .split('.')
  .reduce((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), source)

const t = (key) => {
  const current = messages[locale.value] || messages.en
  const currentValue = resolveMessage(current, key)
  if (currentValue != null) return currentValue
  const fallbackValue = resolveMessage(messages.en, key)
  return fallbackValue != null ? fallbackValue : key
}

const setLocale = (nextLocale) => {
  if (messages[nextLocale]) {
    locale.value = nextLocale
  }
}

export const useI18n = () => ({
  locale,
  setLocale,
  t,
  supportedLocales: Object.keys(messages)
})
