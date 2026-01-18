<template>
  <main class="page">
    <div class="shell">
      <aside class="menu">
        <div class="menu-header">
          <p class="eyebrow">Toolbox</p>
          <h1>Utility Lab</h1>
        </div>
        <button
          class="menu-item"
          :class="{ 'is-active': activeTool === 'base64' }"
          type="button"
          @click="activeTool = 'base64'"
        >
          Base64 Encode / Decode
        </button>
        <button
          class="menu-item"
          :class="{ 'is-active': activeTool === 'json' }"
          type="button"
          @click="activeTool = 'json'"
        >
          JSON Formatter
        </button>
      </aside>

      <section class="panel">
        <header class="panel-header">
          <div v-if="activeTool === 'base64'">
            <p class="eyebrow">Base64</p>
            <h2>Encode and decode safely</h2>
          </div>
          <div v-else>
            <p class="eyebrow">JSON</p>
            <h2>Format clean, readable JSON</h2>
          </div>
          <span class="tag">vue-demo</span>
        </header>

        <div class="panel-body" v-if="activeTool === 'base64'">
          <label class="field">
            <span>Input</span>
            <textarea
              v-model="inputBase64"
              rows="6"
              placeholder="Paste or type text to encode or decode."
            ></textarea>
          </label>

          <div class="actions">
            <button class="primary" type="button" @click="handleEncode">Encode</button>
            <button class="ghost" type="button" @click="handleDecode">Decode</button>
          </div>

          <div v-if="base64Error" class="feedback error" role="status">
            {{ base64Error }}
          </div>

          <label class="field">
            <div class="field-header">
              <span>Output</span>
              <button
                class="copy"
                type="button"
                @click="copyBase64"
                :disabled="!outputBase64"
              >
                {{ copiedBase64 ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <div class="output">
              <textarea
                :value="outputBase64"
                rows="6"
                readonly
                placeholder="No output yet."
              ></textarea>
            </div>
          </label>
        </div>

        <div class="panel-body" v-else>
          <label class="field">
            <span>Input</span>
            <textarea
              v-model="inputJson"
              rows="8"
              placeholder="Paste JSON or escaped JSON log output."
            ></textarea>
          </label>

          <div class="actions">
            <button class="primary" type="button" @click="handleFormatJson">
              Format JSON
            </button>
          </div>

          <div v-if="jsonError" class="feedback error" role="status">
            {{ jsonError }}
          </div>

          <label class="field">
            <div class="field-header">
              <span>Output</span>
              <button
                class="copy"
                type="button"
                @click="copyJson"
                :disabled="!outputJson"
              >
                {{ copiedJson ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <div class="output">
              <textarea
                :value="outputJson"
                rows="10"
                readonly
                placeholder="No output yet."
              ></textarea>
            </div>
          </label>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { formatJsonInput } from './utils/jsonFormatter'

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
    base64Error.value = 'Encoding failed. Please check the input and try again.'
  }
}

const handleDecode = () => {
  resetBase64Status()
  try {
    outputBase64.value = fromBase64(inputBase64.value.trim())
  } catch (error) {
    base64Error.value = 'Decoding failed. Please ensure the input is valid Base64.'
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
    base64Error.value = 'Copy failed. Please copy the output manually.'
  }
}

const handleFormatJson = () => {
  resetJsonStatus()
  const result = formatJsonInput(inputJson.value)
  if (result.ok) {
    outputJson.value = result.value
    return
  }

  jsonError.value = result.error
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
    jsonError.value = 'Copy failed. Please copy the output manually.'
  }
}
</script>
