const tryParseJson = (value) => {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch (error) {
    return { ok: false, error }
  }
}

const tryParseEscapedString = (value) => {
  const trimmed = value.trim()
  if (!trimmed) return { ok: false }

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    const normalized = trimmed.replace(/^'/, '"').replace(/'$/, '"')
    const parsed = tryParseJson(normalized)
    if (parsed.ok) {
      return parsed
    }
    return { ok: true, data: normalized.slice(1, -1) }
  }

  const safe = trimmed.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return tryParseJson(`"${safe}"`)
}

const looksLikeJson = (value) => {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false

  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    return true
  }

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return true
  }

  return false
}

const extractEmbeddedJson = (data) => {
  if (typeof data === 'string') {
    return looksLikeJson(data) ? data : null
  }

  if (data && typeof data === 'object') {
    const keys = Object.keys(data)
    if (keys.length === 1 && typeof data[keys[0]] === 'string') {
      return looksLikeJson(data[keys[0]]) ? data[keys[0]] : null
    }
  }

  return null
}

const findJsonCandidates = (value) => {
  const candidates = []
  const stack = []
  let start = -1

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i]
    if (char === '{' || char === '[') {
      if (stack.length === 0) {
        start = i
      }
      stack.push(char)
      continue
    }

    if ((char === '}' || char === ']') && stack.length > 0) {
      const last = stack[stack.length - 1]
      if ((char === '}' && last === '{') || (char === ']' && last === '[')) {
        stack.pop()
        if (stack.length === 0 && start !== -1) {
          candidates.push(value.slice(start, i + 1))
          start = -1
        }
      }
    }
  }

  return candidates
}

const formatData = (data) => JSON.stringify(data, null, 2)

const normalizeInput = (raw) => {
  const input = raw ? raw.trim() : ''
  if (!input) return ''

  if ((input.startsWith('"') && input.endsWith('"')) || (input.startsWith("'") && input.endsWith("'"))) {
    return input
  }

  const candidates = findJsonCandidates(input)
  if (candidates.length > 0) {
    return candidates[0]
  }

  return input
}

export const formatJsonInput = (raw) => {
  const input = normalizeInput(raw)
  if (!input) {
    return { ok: false, error: 'json.empty' }
  }

  let current = input
  for (let pass = 0; pass < 4; pass += 1) {
    const parsed = tryParseJson(current)
    if (parsed.ok) {
      const embedded = extractEmbeddedJson(parsed.data)
      if (embedded) {
        current = embedded
        continue
      }
      return { ok: true, value: formatData(parsed.data) }
    }

    const unescaped = current
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\\\u/g, '\\u')
    if (unescaped !== current) {
      current = unescaped
      continue
    }

    const stringParse = tryParseEscapedString(current)
    if (stringParse.ok && stringParse.data !== current) {
      current = stringParse.data
      continue
    }
    break
  }

  return { ok: false, error: 'json.parseFailed' }
}
