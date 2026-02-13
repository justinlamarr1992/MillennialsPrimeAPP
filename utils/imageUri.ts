/**
 * Image URI validation utilities
 * Used to prevent React Native Image warnings from invalid URIs
 */

/**
 * Validates if a URI is a valid image source for React Native Image component
 *
 * @param uri - The URI string to validate
 * @returns true if the URI is valid (http/https, data:image/ URI, or file URI), false otherwise
 *
 * @example
 * isValidImageUri('https://example.com/image.jpg') // true
 * isValidImageUri('data:image/png;base64,abc...') // true
 * isValidImageUri('file:///path/to/image.jpg') // true
 * isValidImageUri('httpbad') // false (malformed)
 * isValidImageUri('data:text/plain;base64,abc...') // false (not an image)
 * isValidImageUri('6988bc396a977b0030ea7b9e') // false (raw MongoDB ObjectId)
 * isValidImageUri('') // false (empty string)
 */
export const isValidImageUri = (uri: string): boolean => {
  const trimmed = uri.trim();

  if (trimmed.length === 0) {
    return false;
  }

  const lower = trimmed.toLowerCase();

  // Validate data URIs: restrict to image media type
  if (lower.startsWith('data:')) {
    return lower.startsWith('data:image/');
  }

  // Validate file URIs: require proper file scheme
  if (trimmed.startsWith('file://')) {
    return true;
  }

  // Validate http/https URLs using the URL constructor
  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol;
    return (protocol === 'http:' || protocol === 'https:') && parsed.hostname.length > 0;
  } catch {
    return false;
  }
};
