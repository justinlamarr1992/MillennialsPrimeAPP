/**
 * Tests for imageUri validation utilities
 */

import { isValidImageUri } from '../imageUri';

describe('isValidImageUri', () => {
  describe('Valid URIs', () => {
    it('should accept valid http URLs', () => {
      expect(isValidImageUri('http://example.com/image.jpg')).toBe(true);
    });

    it('should accept valid https URLs', () => {
      expect(isValidImageUri('https://example.com/image.png')).toBe(true);
    });

    it('should accept data URIs with image media type', () => {
      expect(isValidImageUri('data:image/png;base64,abc123')).toBe(true);
      expect(isValidImageUri('data:image/jpeg;base64,def456')).toBe(true);
    });

    it('should accept file URIs', () => {
      expect(isValidImageUri('file:///path/to/image.jpg')).toBe(true);
    });

    it('should handle URLs with trimmed whitespace', () => {
      expect(isValidImageUri('  https://example.com/image.jpg  ')).toBe(true);
    });
  });

  describe('Invalid URIs', () => {
    it('should reject empty strings', () => {
      expect(isValidImageUri('')).toBe(false);
    });

    it('should reject whitespace-only strings', () => {
      expect(isValidImageUri('   ')).toBe(false);
    });

    it('should reject malformed http strings', () => {
      expect(isValidImageUri('httpbad')).toBe(false);
      expect(isValidImageUri('http//')).toBe(false);
    });

    it('should reject URLs without hostnames', () => {
      expect(isValidImageUri('http://')).toBe(false);
      expect(isValidImageUri('https://')).toBe(false);
    });

    it('should reject non-image data URIs', () => {
      expect(isValidImageUri('data:text/plain;base64,abc123')).toBe(false);
      expect(isValidImageUri('data:application/json;base64,abc123')).toBe(false);
    });

    it('should reject raw MongoDB ObjectIds', () => {
      expect(isValidImageUri('6988bc396a977b0030ea7b9e')).toBe(false);
    });

    it('should reject invalid protocols', () => {
      expect(isValidImageUri('ftp://example.com/image.jpg')).toBe(false);
      expect(isValidImageUri('javascript:alert("xss")')).toBe(false);
    });
  });
});
