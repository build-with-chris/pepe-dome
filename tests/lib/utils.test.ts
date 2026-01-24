/**
 * Utils Library Tests
 * Tests for utility functions in src/lib/utils.ts
 */

import { describe, it, expect } from 'vitest'
import { cn, slugify, truncate, getReadingTime } from '@/lib/utils'

describe('Utils Library', () => {
  describe('cn (class name merger)', () => {
    it('should merge simple class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'included', false && 'excluded')).toBe('base included')
    })

    it('should handle arrays of classes', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
    })

    it('should handle undefined and null values', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
    })

    it('should merge Tailwind classes correctly (last wins)', () => {
      expect(cn('p-4', 'p-8')).toBe('p-8')
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
    })

    it('should merge complex Tailwind classes', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('should keep non-conflicting classes', () => {
      expect(cn('p-4 m-2', 'text-lg')).toBe('p-4 m-2 text-lg')
    })
  })

  describe('slugify', () => {
    it('should convert text to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('should replace spaces with hyphens', () => {
      expect(slugify('hello world test')).toBe('hello-world-test')
    })

    it('should handle German umlauts correctly', () => {
      expect(slugify('Über')).toBe('ueber')
      expect(slugify('Köln')).toBe('koeln')
      expect(slugify('Müller')).toBe('mueller')
      expect(slugify('Straße')).toBe('strasse')
    })

    it('should remove special characters', () => {
      expect(slugify('hello! @world#')).toBe('hello-world')
    })

    it('should remove leading and trailing hyphens', () => {
      expect(slugify('--hello world--')).toBe('hello-world')
    })

    it('should handle multiple consecutive special chars', () => {
      expect(slugify('hello   world')).toBe('hello-world')
      expect(slugify('hello---world')).toBe('hello-world')
    })

    it('should handle empty string', () => {
      expect(slugify('')).toBe('')
    })

    it('should handle all German umlauts together', () => {
      expect(slugify('äöüß')).toBe('aeoeuess')
    })

    it('should handle mixed content', () => {
      expect(slugify('München 2024: Große Show!')).toBe('muenchen-2024-grosse-show')
    })
  })

  describe('truncate', () => {
    it('should not truncate text shorter than limit', () => {
      expect(truncate('hello', 10)).toBe('hello')
    })

    it('should truncate text longer than limit with ellipsis', () => {
      expect(truncate('hello world', 5)).toBe('hello...')
    })

    it('should handle exact length', () => {
      expect(truncate('hello', 5)).toBe('hello')
    })

    it('should trim whitespace before adding ellipsis', () => {
      // 'hello world' truncated at 6 -> 'hello ' -> trimmed to 'hello...'
      expect(truncate('hello world', 6)).toBe('hello...')
    })

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('')
    })

    it('should handle limit of 0', () => {
      expect(truncate('hello', 0)).toBe('...')
    })

    it('should handle longer texts', () => {
      const longText = 'This is a very long text that needs to be truncated for display purposes'
      expect(truncate(longText, 20)).toBe('This is a very long...')
    })
  })

  describe('getReadingTime', () => {
    it('should return 1 minute for short content', () => {
      expect(getReadingTime('Hello world')).toBe(1)
    })

    it('should calculate reading time based on word count', () => {
      // 200 words = 1 minute
      const words200 = Array(200).fill('word').join(' ')
      expect(getReadingTime(words200)).toBe(1)
    })

    it('should round up reading time', () => {
      // 250 words = 1.25 minutes = 2 minutes (ceil)
      const words250 = Array(250).fill('word').join(' ')
      expect(getReadingTime(words250)).toBe(2)
    })

    it('should handle empty content', () => {
      expect(getReadingTime('')).toBe(1)
    })

    it('should handle longer content', () => {
      // 600 words = 3 minutes
      const words600 = Array(600).fill('word').join(' ')
      expect(getReadingTime(words600)).toBe(3)
    })

    it('should handle content with multiple whitespace', () => {
      const content = 'word   word  word    word'
      expect(getReadingTime(content)).toBe(1)
    })
  })
})
