import { describe, expect, it } from 'vitest'
import { formatJsonInput } from '../src/utils/jsonFormatter'

describe('formatJsonInput', () => {
  it('formats valid JSON', () => {
    const input = '{"a":1,"b":{"c":2}}'
    const result = formatJsonInput(input)
    expect(result.ok).toBe(true)
    expect(result.value).toBe('{\n  "a": 1,\n  "b": {\n    "c": 2\n  }\n}')
  })

  it('formats JSON embedded as a string value', () => {
    const input = '{"message":"{\\"a\\":1,\\"b\\":2}"}'
    const result = formatJsonInput(input)
    expect(result.ok).toBe(true)
    expect(result.value).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })

  it('formats escaped JSON string input', () => {
    const input = '{\\"a\\":1,\\"b\\":2}'
    const result = formatJsonInput(input)
    expect(result.ok).toBe(true)
    expect(result.value).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })

  it('returns friendly error for empty input', () => {
    const result = formatJsonInput('   ')
    expect(result.ok).toBe(false)
    expect(result.error).toBe('Please enter JSON content to format.')
  })

  it('returns friendly error for invalid JSON', () => {
    const result = formatJsonInput('{a:1}')
    expect(result.ok).toBe(false)
    expect(result.error).toBe('JSON parsing failed. Please check the input format.')
  })
})
