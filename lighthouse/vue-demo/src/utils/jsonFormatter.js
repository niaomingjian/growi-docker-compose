const tryParseJson = (value) => {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch (error) {
    return { ok: false, error }
  }
}

const extractEmbeddedJson = (data) => {
  if (typeof data === 'string') {
    return data
  }

  if (data && typeof data === 'object') {
    const keys = Object.keys(data)
    if (keys.length === 1 && typeof data[keys[0]] === 'string') {
      return data[keys[0]]
    }
  }

  return null
}

export const formatJsonInput = (raw) => {
  const input = raw ? raw.trim() : ''
  if (!input) {
    return { ok: false, error: 'Please enter JSON content to format.' }
  }

  const format = (data) => JSON.stringify(data, null, 2)

  const firstPass = tryParseJson(input)
  if (firstPass.ok) {
    const embedded = extractEmbeddedJson(firstPass.data)
    if (embedded) {
      const secondPass = tryParseJson(embedded)
      if (secondPass.ok) {
        return { ok: true, value: format(secondPass.data) }
      }
    }

    return { ok: true, value: format(firstPass.data) }
  }

  const unescaped = input.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t')
  const fallback = tryParseJson(unescaped)
  if (fallback.ok) {
    return { ok: true, value: format(fallback.data) }
  }

  return { ok: false, error: 'JSON parsing failed. Please check the input format.' }
}
