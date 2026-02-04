/**
 * Tests for validation utilities
 * Target Coverage: 100%
 */

import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  validateZip,
  validateName,
  validateBio,
  validateInterests,
  EMAIL_REGEX,
  PASSWORD_REGEX,
} from '../validation';

describe('validation utilities', () => {
  describe('EMAIL_REGEX', () => {
    it('should be a valid regex pattern', () => {
      expect(EMAIL_REGEX).toBeInstanceOf(RegExp);
    });
  });

  describe('PASSWORD_REGEX', () => {
    it('should be a valid regex pattern', () => {
      expect(PASSWORD_REGEX).toBeInstanceOf(RegExp);
    });
  });

  describe('validateEmail', () => {
    describe('valid emails', () => {
      it('should return null for valid email', () => {
        expect(validateEmail('test@example.com')).toBeNull();
      });

      it('should return null for email with numbers', () => {
        expect(validateEmail('user123@example.com')).toBeNull();
      });

      it('should return null for email with dots and plus', () => {
        expect(validateEmail('first.last+tag@example.com')).toBeNull();
      });

      it('should return null for email with subdomain', () => {
        expect(validateEmail('user@mail.example.com')).toBeNull();
      });

      it('should return null for email with hyphen in domain', () => {
        expect(validateEmail('user@my-domain.com')).toBeNull();
      });

      it('should return null for email with multiple TLDs', () => {
        expect(validateEmail('user@example.co.uk')).toBeNull();
      });

      it('should trim whitespace and validate', () => {
        expect(validateEmail('  test@example.com  ')).toBeNull();
      });
    });

    describe('invalid emails', () => {
      it('should return error for empty string', () => {
        expect(validateEmail('')).toBe('Email is required');
      });

      it('should return error for whitespace only', () => {
        expect(validateEmail('   ')).toBe('Email is required');
      });

      it('should return error for missing @', () => {
        expect(validateEmail('testexample.com')).toBe(
          'Invalid email format (e.g., user@example.com)'
        );
      });

      it('should return error for missing domain', () => {
        expect(validateEmail('test@')).toBe(
          'Invalid email format (e.g., user@example.com)'
        );
      });

      it('should return error for missing username', () => {
        expect(validateEmail('@example.com')).toBe(
          'Invalid email format (e.g., user@example.com)'
        );
      });

      it('should return error for missing TLD', () => {
        expect(validateEmail('test@example')).toBe(
          'Invalid email format (e.g., user@example.com)'
        );
      });

      it('should return error for spaces in email', () => {
        expect(validateEmail('test @example.com')).toBe(
          'Invalid email format (e.g., user@example.com)'
        );
      });

      it('should return error for multiple @ symbols', () => {
        expect(validateEmail('test@@example.com')).toBe(
          'Invalid email format (e.g., user@example.com)'
        );
      });

      it('should return error for single character TLD', () => {
        expect(validateEmail('test@example.c')).toBe(
          'Invalid email format (e.g., user@example.com)'
        );
      });
    });
  });

  describe('validatePassword', () => {
    describe('valid passwords', () => {
      it('should return null for valid password with all requirements', () => {
        expect(validatePassword('Password1!')).toBeNull();
      });

      it('should return null for password with all special chars', () => {
        expect(validatePassword('Pass123!@#$%')).toBeNull();
      });

      it('should return null for 8 character password (minimum)', () => {
        expect(validatePassword('Pass123!')).toBeNull();
      });

      it('should return null for 24 character password (maximum)', () => {
        expect(validatePassword('Password123!@#$%12345678')).toBeNull();
      });

      it('should return null for password with multiple uppercase', () => {
        expect(validatePassword('PASSword123!')).toBeNull();
      });

      it('should return null for password with multiple numbers', () => {
        expect(validatePassword('Password1234!')).toBeNull();
      });
    });

    describe('invalid passwords - required field', () => {
      it('should return error for empty string', () => {
        expect(validatePassword('')).toBe('Password is required');
      });
    });

    describe('invalid passwords - length', () => {
      it('should return error for password less than 8 characters', () => {
        expect(validatePassword('Pass1!')).toBe(
          'Password must be at least 8 characters'
        );
      });

      it('should return error for 7 character password', () => {
        expect(validatePassword('Pass12!')).toBe(
          'Password must be at least 8 characters'
        );
      });

      it('should return error for password more than 24 characters', () => {
        expect(validatePassword('Password123!1234567890123')).toBe(
          'Password must be no more than 24 characters'
        );
      });

      it('should return error for 25 character password', () => {
        expect(validatePassword('Password123!1234567890123')).toBe(
          'Password must be no more than 24 characters'
        );
      });
    });

    describe('invalid passwords - missing lowercase', () => {
      it('should return error for password without lowercase', () => {
        expect(validatePassword('PASSWORD123!')).toBe(
          'Password must contain a lowercase letter'
        );
      });

      it('should return error for all uppercase and numbers', () => {
        expect(validatePassword('PASS1234!')).toBe(
          'Password must contain a lowercase letter'
        );
      });
    });

    describe('invalid passwords - missing uppercase', () => {
      it('should return error for password without uppercase', () => {
        expect(validatePassword('password123!')).toBe(
          'Password must contain an uppercase letter'
        );
      });

      it('should return error for all lowercase and numbers', () => {
        expect(validatePassword('pass1234!')).toBe(
          'Password must contain an uppercase letter'
        );
      });
    });

    describe('invalid passwords - missing number', () => {
      it('should return error for password without number', () => {
        expect(validatePassword('Password!')).toBe(
          'Password must contain a number'
        );
      });

      it('should return error for letters and special chars only', () => {
        expect(validatePassword('Password!@#')).toBe(
          'Password must contain a number'
        );
      });
    });

    describe('invalid passwords - missing special character', () => {
      it('should return error for password without special character', () => {
        expect(validatePassword('Password123')).toBe(
          'Password must contain at least one special character (!@#$%)'
        );
      });

      it('should return error for letters and numbers only', () => {
        expect(validatePassword('Pass1234')).toBe(
          'Password must contain at least one special character (!@#$%)'
        );
      });

      it('should return error for unsupported special character', () => {
        expect(validatePassword('Password123&')).toBe(
          'Password must contain at least one special character (!@#$%)'
        );
      });

      it('should return error for asterisk (unsupported)', () => {
        expect(validatePassword('Password123*')).toBe(
          'Password must contain at least one special character (!@#$%)'
        );
      });
    });

    describe('password edge cases', () => {
      it('should not trim password (spaces count toward length)', () => {
        // Password with space - this is actually valid (9 chars, has all requirements)
        // Testing that spaces are preserved in the password
        expect(validatePassword('Pass 12!')).toBeNull();
      });

      it('should validate exact 8 characters', () => {
        expect(validatePassword('Pass123!')).toBeNull();
      });

      it('should validate exact 24 characters', () => {
        expect(validatePassword('Password123!@#$%12345678')).toBeNull();
      });
    });
  });

  describe('validatePasswordMatch', () => {
    describe('valid password matches', () => {
      it('should return null when passwords match', () => {
        expect(validatePasswordMatch('Password123!', 'Password123!')).toBeNull();
      });

      it('should return null when both passwords are identical complex strings', () => {
        expect(
          validatePasswordMatch('P@ssw0rd!@#$%123', 'P@ssw0rd!@#$%123')
        ).toBeNull();
      });

      it('should return null when both passwords have spaces (exact match)', () => {
        expect(validatePasswordMatch('Pass 123!', 'Pass 123!')).toBeNull();
      });
    });

    describe('invalid password matches', () => {
      it('should return error when confirmPassword is empty', () => {
        expect(validatePasswordMatch('Password123!', '')).toBe(
          'Please confirm your password'
        );
      });

      it('should return error when passwords do not match', () => {
        expect(validatePasswordMatch('Password123!', 'Password456!')).toBe(
          'Passwords do not match'
        );
      });

      it('should return error for case-sensitive mismatch', () => {
        expect(validatePasswordMatch('Password123!', 'password123!')).toBe(
          'Passwords do not match'
        );
      });

      it('should return error for whitespace differences', () => {
        expect(validatePasswordMatch('Password123!', 'Password123! ')).toBe(
          'Passwords do not match'
        );
      });

      it('should return error when passwords differ by one character', () => {
        expect(validatePasswordMatch('Password123!', 'Password124!')).toBe(
          'Passwords do not match'
        );
      });
    });
  });

  describe('validateRequired', () => {
    describe('valid required fields', () => {
      it('should return null for non-empty value', () => {
        expect(validateRequired('John', 'First Name')).toBeNull();
      });

      it('should return null for value with multiple words', () => {
        expect(validateRequired('John Doe', 'Full Name')).toBeNull();
      });

      it('should return null for value with numbers', () => {
        expect(validateRequired('User123', 'Username')).toBeNull();
      });

      it('should return null for value with special characters', () => {
        expect(validateRequired('Test!@#', 'Field')).toBeNull();
      });

      it('should return null for value with whitespace (but not only whitespace)', () => {
        expect(validateRequired('  John  ', 'First Name')).toBeNull();
      });
    });

    describe('invalid required fields', () => {
      it('should return error for empty string', () => {
        expect(validateRequired('', 'First Name')).toBe('First Name is required');
      });

      it('should return error for whitespace only', () => {
        expect(validateRequired('   ', 'Last Name')).toBe('Last Name is required');
      });

      it('should return error for tab characters only', () => {
        expect(validateRequired('\t\t', 'Username')).toBe('Username is required');
      });

      it('should return error for newline characters only', () => {
        expect(validateRequired('\n\n', 'Field')).toBe('Field is required');
      });

      it('should use provided field name in error message', () => {
        expect(validateRequired('', 'Email Address')).toBe(
          'Email Address is required'
        );
      });
    });
  });

  describe('validateZip', () => {
    describe('valid ZIP codes', () => {
      it('should return null for valid 5-digit ZIP', () => {
        expect(validateZip('12345')).toBeNull();
      });

      it('should return null for valid ZIP+4 format', () => {
        expect(validateZip('12345-6789')).toBeNull();
      });

      it('should return null for empty string (ZIP is optional)', () => {
        expect(validateZip('')).toBeNull();
      });

      it('should return null for whitespace only (ZIP is optional)', () => {
        expect(validateZip('   ')).toBeNull();
      });

      it('should trim whitespace and validate 5-digit ZIP', () => {
        expect(validateZip('  12345  ')).toBeNull();
      });

      it('should trim whitespace and validate ZIP+4', () => {
        expect(validateZip('  12345-6789  ')).toBeNull();
      });
    });

    describe('invalid ZIP codes', () => {
      it('should return error for 4-digit ZIP', () => {
        expect(validateZip('1234')).toBe(
          'Invalid ZIP code format (e.g., 12345 or 12345-6789)'
        );
      });

      it('should return error for 6-digit ZIP', () => {
        expect(validateZip('123456')).toBe(
          'Invalid ZIP code format (e.g., 12345 or 12345-6789)'
        );
      });

      it('should return error for ZIP+3 format', () => {
        expect(validateZip('12345-678')).toBe(
          'Invalid ZIP code format (e.g., 12345 or 12345-6789)'
        );
      });

      it('should return error for ZIP+5 format', () => {
        expect(validateZip('12345-67890')).toBe(
          'Invalid ZIP code format (e.g., 12345 or 12345-6789)'
        );
      });

      it('should return error for letters in ZIP', () => {
        expect(validateZip('1234A')).toBe(
          'Invalid ZIP code format (e.g., 12345 or 12345-6789)'
        );
      });

      it('should return error for special characters', () => {
        expect(validateZip('12345!')).toBe(
          'Invalid ZIP code format (e.g., 12345 or 12345-6789)'
        );
      });

      it('should return error for space in middle', () => {
        expect(validateZip('123 45')).toBe(
          'Invalid ZIP code format (e.g., 12345 or 12345-6789)'
        );
      });

      it('should return error for multiple hyphens', () => {
        expect(validateZip('12345--6789')).toBe(
          'Invalid ZIP code format (e.g., 12345 or 12345-6789)'
        );
      });

      it('should return error for hyphen without extension', () => {
        expect(validateZip('12345-')).toBe(
          'Invalid ZIP code format (e.g., 12345 or 12345-6789)'
        );
      });
    });
  });

  describe('validateName', () => {
    describe('valid names', () => {
      it('should return null for simple name', () => {
        expect(validateName('John')).toBeNull();
      });

      it('should return null for name with space', () => {
        expect(validateName('John Doe')).toBeNull();
      });

      it('should return null for name with hyphen', () => {
        expect(validateName('Mary-Jane')).toBeNull();
      });

      it('should return null for name with apostrophe', () => {
        expect(validateName("O'Brien")).toBeNull();
      });

      it('should return null for name with multiple words', () => {
        expect(validateName('Mary Jane Watson')).toBeNull();
      });

      it('should return null for name with mixed special chars', () => {
        expect(validateName("Mary-Jane O'Brien")).toBeNull();
      });

      it('should return null for 2 character name (minimum)', () => {
        expect(validateName('Li')).toBeNull();
      });

      it('should return null for 100 character name (maximum)', () => {
        const longName = 'a'.repeat(100);
        expect(validateName(longName)).toBeNull();
      });

      it('should trim whitespace and validate', () => {
        expect(validateName('  John Doe  ')).toBeNull();
      });

      it('should return null for lowercase names', () => {
        expect(validateName('john doe')).toBeNull();
      });

      it('should return null for uppercase names', () => {
        expect(validateName('JOHN DOE')).toBeNull();
      });

      it('should return null for mixed case names', () => {
        expect(validateName('JoHn DoE')).toBeNull();
      });
    });

    describe('invalid names', () => {
      it('should return error for empty string', () => {
        expect(validateName('')).toBe('Name is required');
      });

      it('should return error for whitespace only', () => {
        expect(validateName('   ')).toBe('Name is required');
      });

      it('should return error for name with numbers', () => {
        expect(validateName('John123')).toBe(
          'Name can only contain letters, spaces, hyphens, and apostrophes'
        );
      });

      it('should return error for name with special characters', () => {
        expect(validateName('John@Doe')).toBe(
          'Name can only contain letters, spaces, hyphens, and apostrophes'
        );
      });

      it('should return error for name with underscore', () => {
        expect(validateName('John_Doe')).toBe(
          'Name can only contain letters, spaces, hyphens, and apostrophes'
        );
      });

      it('should return error for name with period', () => {
        expect(validateName('John.Doe')).toBe(
          'Name can only contain letters, spaces, hyphens, and apostrophes'
        );
      });

      it('should return error for name with exclamation', () => {
        expect(validateName('John!')).toBe(
          'Name can only contain letters, spaces, hyphens, and apostrophes'
        );
      });

      it('should return error for single character name', () => {
        expect(validateName('J')).toBe('Name must be at least 2 characters');
      });

      it('should return error for name over 100 characters', () => {
        const longName = 'a'.repeat(101);
        expect(validateName(longName)).toBe(
          'Name must be no more than 100 characters'
        );
      });

      it('should return error for 1 character after trimming', () => {
        expect(validateName('  J  ')).toBe('Name must be at least 2 characters');
      });

      it('should return error for emojis', () => {
        expect(validateName('John 😀')).toBe(
          'Name can only contain letters, spaces, hyphens, and apostrophes'
        );
      });
    });
  });

  describe('validateBio', () => {
    describe('valid bios', () => {
      it('should return null for empty string (bio is optional)', () => {
        expect(validateBio('')).toBeNull();
      });

      it('should return null for whitespace only (bio is optional)', () => {
        expect(validateBio('   ')).toBeNull();
      });

      it('should return null for short bio', () => {
        expect(validateBio('Hello, I am a developer.')).toBeNull();
      });

      it('should return null for bio with special characters', () => {
        expect(validateBio('I love coding! JavaScript & React are my favorites.')).toBeNull();
      });

      it('should return null for bio with numbers', () => {
        expect(validateBio('Software engineer with 10+ years of experience.')).toBeNull();
      });

      it('should return null for bio with newlines', () => {
        expect(validateBio('First line\nSecond line\nThird line')).toBeNull();
      });

      it('should return null for 200 character bio (maximum)', () => {
        const bio = 'a'.repeat(200);
        expect(validateBio(bio)).toBeNull();
      });

      it('should trim and validate bio at exactly 200 chars after trim', () => {
        const bio = '  ' + 'a'.repeat(200) + '  ';
        expect(validateBio(bio)).toBeNull();
      });
    });

    describe('invalid bios', () => {
      it('should return error for bio over 200 characters', () => {
        const bio = 'a'.repeat(201);
        expect(validateBio(bio)).toBe('Bio must be no more than 200 characters');
      });

      it('should return error for 201 character bio', () => {
        const bio = 'a'.repeat(201);
        expect(validateBio(bio)).toBe('Bio must be no more than 200 characters');
      });

      it('should return error for bio over 200 chars after trimming', () => {
        const bio = '  ' + 'a'.repeat(201) + '  ';
        expect(validateBio(bio)).toBe('Bio must be no more than 200 characters');
      });

      it('should return error for very long bio', () => {
        const bio = 'a'.repeat(500);
        expect(validateBio(bio)).toBe('Bio must be no more than 200 characters');
      });
    });
  });

  describe('validateInterests', () => {
    describe('valid interests', () => {
      it('should return null for empty array (interests are optional)', () => {
        expect(validateInterests([])).toBeNull();
      });

      it('should return null for single interest', () => {
        expect(validateInterests(['JavaScript'])).toBeNull();
      });

      it('should return null for multiple interests', () => {
        expect(validateInterests(['JavaScript', 'React', 'Node.js'])).toBeNull();
      });

      it('should return null for 10 interests (maximum)', () => {
        const interests = Array.from({ length: 10 }, (_, i) => `Interest ${i + 1}`);
        expect(validateInterests(interests)).toBeNull();
      });

      it('should return null for interests with 30 character tags', () => {
        const interests = ['a'.repeat(30), 'b'.repeat(30)];
        expect(validateInterests(interests)).toBeNull();
      });

      it('should return null for interests with spaces', () => {
        expect(validateInterests(['Web Development', 'Machine Learning'])).toBeNull();
      });

      it('should return null for interests with special characters', () => {
        expect(validateInterests(['C++', 'C#', 'F#'])).toBeNull();
      });
    });

    describe('invalid interests', () => {
      it('should return error for more than 10 interests', () => {
        const interests = Array.from({ length: 11 }, (_, i) => `Interest ${i + 1}`);
        expect(validateInterests(interests)).toBe('Maximum 10 interests allowed');
      });

      it('should return error for 11 interests', () => {
        const interests = Array.from({ length: 11 }, (_, i) => `Tag${i}`);
        expect(validateInterests(interests)).toBe('Maximum 10 interests allowed');
      });

      it('should return error for interest with over 30 characters', () => {
        const interests = ['JavaScript', 'a'.repeat(31)];
        expect(validateInterests(interests)).toBe('Each interest must be no more than 30 characters');
      });

      it('should return error for interest with exactly 31 characters', () => {
        const interests = ['a'.repeat(31)];
        expect(validateInterests(interests)).toBe('Each interest must be no more than 30 characters');
      });

      it('should return error for multiple interests where one exceeds limit', () => {
        const interests = ['Valid Tag', 'Another Valid', 'a'.repeat(35), 'Also Valid'];
        expect(validateInterests(interests)).toBe('Each interest must be no more than 30 characters');
      });

      it('should return error for very long interest tag', () => {
        const interests = ['a'.repeat(100)];
        expect(validateInterests(interests)).toBe('Each interest must be no more than 30 characters');
      });
    });

    describe('edge cases', () => {
      it('should handle interests with leading/trailing whitespace', () => {
        const interests = ['  JavaScript  ', '  React  '];
        expect(validateInterests(interests)).toBeNull();
      });

      it('should catch whitespace-padded tags that exceed 30 chars after trim', () => {
        const interests = ['  ' + 'a'.repeat(31) + '  '];
        expect(validateInterests(interests)).toBe('Each interest must be no more than 30 characters');
      });
    });
  });
});
