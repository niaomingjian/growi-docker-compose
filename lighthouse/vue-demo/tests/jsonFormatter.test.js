import { describe, expect, it } from 'vitest'
import { formatJsonInput } from '../src/utils/jsonFormatter'

describe('formatJsonInput', () => {
  it('formats valid JSON', () => {
    // UI test input: {"a":1,"b":{"c":2}}
    const input = '{"a":1,"b":{"c":2}}'
    const result = formatJsonInput(input)
    expect(result.ok).toBe(true)
    expect(result.value).toBe('{\n  "a": 1,\n  "b": {\n    "c": 2\n  }\n}')
  })

  it('formats JSON embedded as a string value', () => {
    // UI test input: {"message":"{\"a\":1,\"b\":2}"}
    const input = '{"message":"{\\"a\\":1,\\"b\\":2}"}'
    const result = formatJsonInput(input)
    expect(result.ok).toBe(true)
    expect(result.value).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })

  it('formats escaped JSON string input', () => {
    // UI test input: {\"a\":1,\"b\":2}
    const input = '{\\"a\\":1,\\"b\\":2}'
    const result = formatJsonInput(input)
    expect(result.ok).toBe(true)
    expect(result.value).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })

  it('formats JSON inside a log prefix', () => {
    // UI test input: INFO 2024-10-01 {"status":200,"ok":true}
    const input = 'INFO 2024-10-01 {"status":200,"ok":true}'
    const result = formatJsonInput(input)
    expect(result.ok).toBe(true)
    expect(result.value).toBe('{\n  "status": 200,\n  "ok": true\n}')
  })

  it('formats unicode escapes in JSON strings', () => {
    // UI test input: "{\"message\":\"\\u4f60\\u597d\"}"
    const input = '"{\\"message\\":\\"\\\\u4f60\\\\u597d\\"}"'
    const result = formatJsonInput(input)
    expect(result.ok).toBe(true)
    expect(result.value).toBe('{\n  "message": "你好"\n}')
  })

  it('returns friendly error for empty input', () => {
    // UI test input: (empty or whitespace)
    const result = formatJsonInput('   ')
    expect(result.ok).toBe(false)
    expect(result.error).toBe('Please enter JSON content to format.')
  })

  it('returns friendly error for invalid JSON', () => {
    // UI test input: {a:1}
    const result = formatJsonInput('{a:1}')
    expect(result.ok).toBe(false)
    expect(result.error).toBe('JSON parsing failed. Please check the input format.')
  })
})
