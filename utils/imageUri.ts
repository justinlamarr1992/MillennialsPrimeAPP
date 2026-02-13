/**
 * Image URI validation utilities
 * Used to prevent React Native Image warnings from invalid URIs
 */

/**
 * Validates if a URI is a valid image source for React Native Image component
 *
 * @param uri - The URI string to validate
 * @returns true if the URI is valid (http/https, data URI, or file URI), false otherwise
 *
 * @example
 * isValidImageUri('https://example.com/image.jpg') // true
 * isValidImageUri('data:image/png;base64,abc...') // true
 * isValidImageUri('file:///path/to/image.jpg') // true
 * isValidImageUri('6988bc396a977b0030ea7b9e') // false (raw MongoDB ObjectId)
 * isValidImageUri('') // false (empty string)
 */
export const isValidImageUri = (uri: string): boolean =>
  uri.startsWith('http') || uri.startsWith('data:') || uri.startsWith('file://');
