/**
 * Shared validation utilities for form inputs
 * Used across auth screens and other forms
 */

// Email validation regex - validates standard email format
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Strong password: 8-24 chars, uppercase, lowercase, number, special char
// Note: Special characters limited to !@#$% for Firebase Auth compatibility
// These are the most common and universally supported special characters
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns Error message if invalid, null if valid
 */
export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Invalid email format (e.g., user@example.com)';
  }
  return null;
};

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Error message if invalid, null if valid
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  // Use raw password value for all checks (do not trim)
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (password.length > 24) {
    return 'Password must be no more than 24 characters';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain a lowercase letter';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain an uppercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain a number';
  }
  if (!/[!@#$%]/.test(password)) {
    return 'Password must contain at least one special character (!@#$%)';
  }
  return null;
};

/**
 * Validates password confirmation matches
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Error message if invalid, null if valid
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

/**
 * Validates required text field
 * @param value - Field value
 * @param fieldName - Name of field for error message
 * @returns Error message if invalid, null if valid
 */
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};
