<template>
  <main class="page">
    <div class="shell">
      <aside class="menu">
        <div class="menu-header">
          <p class="eyebrow">Toolbox</p>
          <h1>Utility Lab</h1>
        </div>
        <button class="menu-item is-active" type="button">
          Base64 Encode / Decode
        </button>
      </aside>

      <section class="panel">
        <header class="panel-header">
          <div>
            <p class="eyebrow">Base64</p>
            <h2>Encode and decode safely</h2>
          </div>
          <span class="tag">vue-demo</span>
        </header>

        <div class="panel-body">
          <label class="field">
            <span>Input</span>
            <textarea
              v-model="input"
              rows="6"
              placeholder="Paste or type text to encode or decode."
            ></textarea>
          </label>

          <div class="actions">
            <button class="primary" type="button" @click="handleEncode">Encode</button>
            <button class="ghost" type="button" @click="handleDecode">Decode</button>
          </div>

          <div class="feedback" :class="{ error: errorMessage }" role="status">
            {{ errorMessage || 'Ready.' }}
          </div>

          <label class="field">
            <span>Output</span>
            <div class="output">
              <textarea :value="output" rows="6" readonly></textarea>
              <button
                class="copy"
                type="button"
                @click="copyOutput"
                :disabled="!output"
              >
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
            </div>
          </label>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const errorMessage = ref('')
const copied = ref(false)

const resetStatus = () => {
  errorMessage.value = ''
  copied.value = false
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
  resetStatus()
  try {
    output.value = toBase64(input.value)
  } catch (error) {
    errorMessage.value = 'Encoding failed. Please check the input and try again.'
  }
}

const handleDecode = () => {
  resetStatus()
  try {
    output.value = fromBase64(input.value.trim())
  } catch (error) {
    errorMessage.value = 'Decoding failed. Please ensure the input is valid Base64.'
  }
}

const copyOutput = async () => {
  resetStatus()
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
  } catch (error) {
    errorMessage.value = 'Copy failed. Please copy the output manually.'
  }
}
</script>
