<template>
  <main class="page">
    <div class="shell">
      <aside class="menu">
        <div class="menu-header">
          <p class="eyebrow">{{ t('app.toolbox') }}</p>
          <h1>{{ t('app.utilityLab') }}</h1>
        </div>
        <button
          class="menu-item"
          :class="{ 'is-active': activeTool === 'base64' }"
          type="button"
          @click="activeTool = 'base64'"
        >
          {{ t('menu.base64') }}
        </button>
        <button
          class="menu-item"
          :class="{ 'is-active': activeTool === 'json' }"
          type="button"
          @click="activeTool = 'json'"
        >
          {{ t('menu.json') }}
        </button>
      </aside>

      <section class="panel">
        <header class="panel-header">
          <div v-if="activeTool === 'base64'">
            <p class="eyebrow">{{ t('tool.base64.eyebrow') }}</p>
            <h2>{{ t('tool.base64.title') }}</h2>
          </div>
          <div v-else>
            <p class="eyebrow">{{ t('tool.json.eyebrow') }}</p>
            <h2>{{ t('tool.json.title') }}</h2>
          </div>
          <div class="panel-meta">
            <label class="lang-label" for="lang-trigger">{{ t('settings.language') }}</label>
            <div class="lang-select" ref="langRef">
              <button
                id="lang-trigger"
                class="lang-trigger"
                type="button"
                aria-haspopup="listbox"
                :aria-expanded="isLangOpen"
                @click="toggleLang"
              >
                <span>{{ currentLangLabel }}</span>
                <span class="lang-chevron" aria-hidden="true">▾</span>
              </button>
              <div v-if="isLangOpen" class="lang-menu" role="listbox">
                <button
                  v-for="option in langOptions"
                  :key="option.value"
                  class="lang-option"
                  :class="{ active: currentLocale === option.value }"
                  type="button"
                  role="option"
                  :aria-selected="currentLocale === option.value"
                  @click="selectLang(option.value)"
                >
                  {{ t(option.labelKey) }}
                </button>
              </div>
            </div>
            <span class="tag">{{ t('app.tag') }}</span>
          </div>
        </header>

        <div class="panel-body" v-if="activeTool === 'base64'">
          <label class="field">
            <div class="field-header">
              <span>{{ t('fields.input') }}</span>
              <button class="ghost" type="button" @click="clearBase64">
                {{ t('actions.clear') }}
              </button>
            </div>
            <textarea
              v-model="inputBase64"
              rows="6"
              :placeholder="t('placeholders.base64Input')"
            ></textarea>
          </label>

          <div class="actions">
            <button class="primary" type="button" @click="handleEncode">{{ t('actions.encode') }}</button>
            <button class="ghost" type="button" @click="handleDecode">{{ t('actions.decode') }}</button>
          </div>

          <div v-if="base64Error" class="feedback error" role="status">
            {{ base64Error }}
          </div>

          <label class="field">
            <div class="field-header">
              <span>{{ t('fields.output') }}</span>
              <button
                class="copy"
                type="button"
                @click="copyBase64"
                :disabled="!outputBase64"
              >
                {{ copiedBase64 ? t('actions.copied') : t('actions.copy') }}
              </button>
            </div>
            <div class="output">
              <textarea
                :value="outputBase64"
                rows="6"
                readonly
                :placeholder="t('placeholders.output')"
              ></textarea>
            </div>
          </label>
        </div>

        <div class="panel-body" v-else>
          <label class="field">
            <div class="field-header">
              <span>{{ t('fields.input') }}</span>
              <button class="ghost" type="button" @click="clearJson">
                {{ t('actions.clear') }}
              </button>
            </div>
            <textarea
              v-model="inputJson"
              rows="8"
              :placeholder="t('placeholders.jsonInput')"
            ></textarea>
          </label>

          <div class="actions">
            <button class="primary" type="button" @click="handleFormatJson">
              {{ t('actions.formatJson') }}
            </button>
          </div>

          <div v-if="jsonError" class="feedback error" role="status">
            {{ jsonError }}
          </div>

          <label class="field">
            <div class="field-header">
              <span>{{ t('fields.output') }}</span>
              <button
                class="copy"
                type="button"
                @click="copyJson"
                :disabled="!outputJson"
              >
                {{ copiedJson ? t('actions.copied') : t('actions.copy') }}
              </button>
            </div>
            <div class="output">
              <textarea
                :value="outputJson"
                rows="10"
                readonly
                :placeholder="t('placeholders.output')"
              ></textarea>
            </div>
          </label>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatJsonInput } from './utils/jsonFormatter'
import { useI18n } from './i18n'

const { locale, setLocale, t } = useI18n()
const langRef = ref(null)
const isLangOpen = ref(false)
const langOptions = [
  { value: 'en', labelKey: 'settings.langEnglish' },
  { value: 'zh-CN', labelKey: 'settings.langChinese' },
  { value: 'ja', labelKey: 'settings.langJapanese' }
]

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => setLocale(value)
})

const currentLangLabel = computed(() => {
  const option = langOptions.find((item) => item.value == currentLocale.value)
  return option ? t(option.labelKey) : t('settings.langEnglish')
})

const toggleLang = () => {
  isLangOpen.value = !isLangOpen.value
}

const closeLang = () => {
  isLangOpen.value = false
}

const selectLang = (value) => {
  setLocale(value)
  closeLang()
}

const handleClickOutside = (event) => {
  if (!langRef.value) return
  if (!langRef.value.contains(event.target)) {
    closeLang()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const activeTool = ref('base64')

const inputBase64 = ref('')
const outputBase64 = ref('')
const base64Error = ref('')
const copiedBase64 = ref(false)

const inputJson = ref('')
const outputJson = ref('')
const jsonError = ref('')
const copiedJson = ref(false)

const base64CopyTimer = ref(null)
const jsonCopyTimer = ref(null)

const resetBase64Status = () => {
  base64Error.value = ''
  copiedBase64.value = false
  if (base64CopyTimer.value) {
    clearTimeout(base64CopyTimer.value)
    base64CopyTimer.value = null
  }
}


const clearBase64 = () => {
  inputBase64.value = ''
  outputBase64.value = ''
  resetBase64Status()
}

const clearJson = () => {
  inputJson.value = ''
  outputJson.value = ''
  resetJsonStatus()
}
const resetJsonStatus = () => {
  jsonError.value = ''
  copiedJson.value = false
  if (jsonCopyTimer.value) {
    clearTimeout(jsonCopyTimer.value)
    jsonCopyTimer.value = null
  }
}

const toBase64 = (value) => {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

const fromBase64 = (value) => {
  const binary = atob(value)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const handleEncode = () => {
  resetBase64Status()
  try {
    outputBase64.value = toBase64(inputBase64.value)
  } catch (error) {
    base64Error.value = t('errors.base64Encode')
  }
}

const handleDecode = () => {
  resetBase64Status()
  try {
    outputBase64.value = fromBase64(inputBase64.value.trim())
  } catch (error) {
    base64Error.value = t('errors.base64Decode')
  }
}

const copyBase64 = async () => {
  resetBase64Status()
  if (!outputBase64.value) return
  try {
    await navigator.clipboard.writeText(outputBase64.value)
    copiedBase64.value = true
    base64CopyTimer.value = setTimeout(() => {
      copiedBase64.value = false
      base64CopyTimer.value = null
    }, 2000)
  } catch (error) {
    base64Error.value = t('errors.copy')
  }
}

const handleFormatJson = () => {
  resetJsonStatus()
  const result = formatJsonInput(inputJson.value)
  if (result.ok) {
    outputJson.value = result.value
    return
  }

  const jsonErrorMap = {
    'json.empty': () => t('errors.jsonEmpty'),
    'json.parseFailed': () => t('errors.jsonParseFailed')
  }

  jsonError.value = jsonErrorMap[result.error]?.() ?? t('errors.jsonParseFailed')
}

const copyJson = async () => {
  resetJsonStatus()
  if (!outputJson.value) return
  try {
    await navigator.clipboard.writeText(outputJson.value)
    copiedJson.value = true
    jsonCopyTimer.value = setTimeout(() => {
      copiedJson.value = false
      jsonCopyTimer.value = null
    }, 2000)
  } catch (error) {
    jsonError.value = t('errors.copy')
  }
}
</script>
