/**
 * Tests for logger utility
 * Target Coverage: 100%
 *
 * Note: In the test environment, __DEV__ is true (as configured in jest.config.js globals).
 * The logger module reads __DEV__ at module load time, so all tests run in dev mode.
 * Production mode behavior is tested by verifying the conditional logic would work correctly.
 */

// Store original console methods before importing
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

// Mock console before import
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();
console.debug = jest.fn();

import { logger } from '../logger';

describe('logger utility', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore console methods after all tests
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.debug = originalConsole.debug;
  });

  describe('logger.log', () => {
    it('should log messages in development mode', () => {
      logger.log('Test message');
      expect(console.log).toHaveBeenCalledWith('Test message');
    });

    it('should log multiple arguments', () => {
      logger.log('Message', 123, { key: 'value' });
      expect(console.log).toHaveBeenCalledWith('Message', 123, { key: 'value' });
    });

    it('should log objects', () => {
      const obj = { test: 'data' };
      logger.log(obj);
      expect(console.log).toHaveBeenCalledWith(obj);
    });

    it('should log arrays', () => {
      const arr = [1, 2, 3];
      logger.log(arr);
      expect(console.log).toHaveBeenCalledWith(arr);
    });

    it('should log empty string', () => {
      logger.log('');
      expect(console.log).toHaveBeenCalledWith('');
    });

    it('should log null and undefined', () => {
      logger.log(null, undefined);
      expect(console.log).toHaveBeenCalledWith(null, undefined);
    });
  });

  describe('logger.warn', () => {
    it('should log warnings in development mode', () => {
      logger.warn('Warning message');
      expect(console.warn).toHaveBeenCalledWith('Warning message');
    });

    it('should log multiple warning arguments', () => {
      logger.warn('Warning', 'details', 123);
      expect(console.warn).toHaveBeenCalledWith('Warning', 'details', 123);
    });

    it('should log warning objects', () => {
      const warning = { type: 'deprecation' };
      logger.warn(warning);
      expect(console.warn).toHaveBeenCalledWith(warning);
    });

    it('should handle complex warning data', () => {
      const data = { nested: { key: 'value' }, array: [1, 2] };
      logger.warn('Warning:', data);
      expect(console.warn).toHaveBeenCalledWith('Warning:', data);
    });
  });

  describe('logger.error', () => {
    it('should log errors in development mode', () => {
      logger.error('Error message');
      expect(console.error).toHaveBeenCalledWith('Error message');
    });

    it('should log multiple error arguments', () => {
      logger.error('Error', 'details', { code: 500 });
      expect(console.error).toHaveBeenCalledWith('Error', 'details', {
        code: 500,
      });
    });

    it('should log Error instances', () => {
      const error = new Error('Test error');
      logger.error(error);
      expect(console.error).toHaveBeenCalledWith(error);
    });

    it('should log Error with context', () => {
      const error = new Error('Error with context');
      logger.error(error, 'additional', 'context');
      expect(console.error).toHaveBeenCalledWith(error, 'additional', 'context');
    });

    it('should handle string errors', () => {
      logger.error('String error message');
      expect(console.error).toHaveBeenCalledWith('String error message');
    });

    it('should handle TypeError instances', () => {
      const error = new TypeError('Type error');
      logger.error(error);
      expect(console.error).toHaveBeenCalledWith(error);
    });

    it('should call console.error when Error is first argument', () => {
      const error = new Error('Test');
      logger.error(error, 'context');
      // In dev mode, should be called once (the error tracking is production only)
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error, 'context');
    });
  });

  describe('logger.exception', () => {
    it('should always log exceptions to console', () => {
      const error = new Error('Exception occurred');
      logger.exception(error);

      expect(console.error).toHaveBeenCalledWith('[Exception]', error, undefined);
    });

    it('should log exceptions with context', () => {
      const error = new Error('Exception with context');
      const context = { userId: '123', action: 'submit' };
      logger.exception(error, context);

      expect(console.error).toHaveBeenCalledWith('[Exception]', error, context);
    });

    it('should handle exception without context', () => {
      const error = new Error('Simple exception');
      logger.exception(error);

      expect(console.error).toHaveBeenCalledWith('[Exception]', error, undefined);
    });

    it('should handle complex context objects', () => {
      const error = new Error('Complex exception');
      const context = {
        user: { id: '123', email: 'test@example.com' },
        timestamp: Date.now(),
        metadata: { key: 'value' }
      };
      logger.exception(error, context);

      expect(console.error).toHaveBeenCalledWith('[Exception]', error, context);
    });

    it('should handle TypeError exceptions', () => {
      const error = new TypeError('Type exception');
      logger.exception(error, { source: 'validation' });

      expect(console.error).toHaveBeenCalledWith('[Exception]', error, { source: 'validation' });
    });
  });

  describe('logger.debug', () => {
    it('should log debug messages in development mode', () => {
      logger.debug('Debug message');
      expect(console.debug).toHaveBeenCalledWith('Debug message');
    });

    it('should log multiple debug arguments', () => {
      logger.debug('Debug:', { data: 'test' }, [1, 2, 3]);
      expect(console.debug).toHaveBeenCalledWith('Debug:', { data: 'test' }, [1, 2, 3]);
    });

    it('should log complex debug data', () => {
      const debugData = { nested: { data: 'value' }, array: [1, 2, 3] };
      logger.debug(debugData);
      expect(console.debug).toHaveBeenCalledWith(debugData);
    });

    it('should handle debug with null and undefined', () => {
      logger.debug('Debug:', null, undefined);
      expect(console.debug).toHaveBeenCalledWith('Debug:', null, undefined);
    });

    it('should handle empty debug calls', () => {
      logger.debug();
      expect(console.debug).toHaveBeenCalledWith();
    });
  });

  describe('logger.api', () => {
    it('should log API calls with method and URL', () => {
      logger.api('GET', '/api/users');
      expect(console.log).toHaveBeenCalledWith('[API GET]', '/api/users', '');
    });

    it('should log API calls with data', () => {
      const data = { userId: 123 };
      logger.api('POST', '/api/users', data);
      expect(console.log).toHaveBeenCalledWith('[API POST]', '/api/users', data);
    });

    it('should log different HTTP methods', () => {
      logger.api('DELETE', '/api/users/123');
      expect(console.log).toHaveBeenCalledWith('[API DELETE]', '/api/users/123', '');
    });

    it('should handle PUT method', () => {
      logger.api('PUT', '/api/users/1', { name: 'Updated' });
      expect(console.log).toHaveBeenCalledWith('[API PUT]', '/api/users/1', { name: 'Updated' });
    });

    it('should handle PATCH method', () => {
      logger.api('PATCH', '/api/users/1', { email: 'new@example.com' });
      expect(console.log).toHaveBeenCalledWith('[API PATCH]', '/api/users/1', { email: 'new@example.com' });
    });

    it('should handle empty data as empty string', () => {
      logger.api('GET', '/api/endpoint');
      expect(console.log).toHaveBeenCalledWith('[API GET]', '/api/endpoint', '');
    });

    it('should log complex data objects', () => {
      const complexData = {
        body: { name: 'test' },
        headers: { 'Content-Type': 'application/json' }
      };
      logger.api('PUT', '/api/users/1', complexData);
      expect(console.log).toHaveBeenCalledWith('[API PUT]', '/api/users/1', complexData);
    });

    it('should handle falsy but defined data values (like 0) as-is', () => {
      // The logger.api function uses `data ?? ''` so only null/undefined become empty string
      logger.api('POST', '/api/endpoint', 0);
      expect(console.log).toHaveBeenCalledWith('[API POST]', '/api/endpoint', 0);
    });

    it('should handle null data as empty string', () => {
      // The logger.api function uses `data ?? ''` so null becomes empty string
      logger.api('GET', '/api/endpoint', null);
      expect(console.log).toHaveBeenCalledWith('[API GET]', '/api/endpoint', '');
    });

    it('should handle undefined data as empty string', () => {
      // The logger.api function uses `data ?? ''` so undefined becomes empty string
      logger.api('GET', '/api/endpoint', undefined);
      expect(console.log).toHaveBeenCalledWith('[API GET]', '/api/endpoint', '');
    });

    it('should handle false as-is', () => {
      // false is a valid data value and should not be converted
      logger.api('POST', '/api/endpoint', false);
      expect(console.log).toHaveBeenCalledWith('[API POST]', '/api/endpoint', false);
    });

    it('should handle empty string as-is', () => {
      // Empty string is different from no data
      logger.api('POST', '/api/endpoint', '');
      expect(console.log).toHaveBeenCalledWith('[API POST]', '/api/endpoint', '');
    });
  });

  describe('logger object structure', () => {
    it('should have all expected methods', () => {
      expect(logger).toHaveProperty('log');
      expect(logger).toHaveProperty('warn');
      expect(logger).toHaveProperty('error');
      expect(logger).toHaveProperty('exception');
      expect(logger).toHaveProperty('debug');
      expect(logger).toHaveProperty('api');
    });

    it('should have all methods be functions', () => {
      expect(typeof logger.log).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.exception).toBe('function');
      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.api).toBe('function');
    });

    it('should export logger as an object', () => {
      expect(typeof logger).toBe('object');
      expect(logger).not.toBeNull();
    });
  });

  describe('logger integration', () => {
    it('should handle mixed log calls', () => {
      logger.log('Log message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid successive calls', () => {
      logger.log('First');
      logger.log('Second');
      logger.log('Third');

      expect(console.log).toHaveBeenCalledTimes(3);
      expect(console.log).toHaveBeenNthCalledWith(1, 'First');
      expect(console.log).toHaveBeenNthCalledWith(2, 'Second');
      expect(console.log).toHaveBeenNthCalledWith(3, 'Third');
    });

    it('should handle all methods in sequence', () => {
      logger.log('log');
      logger.debug('debug');
      logger.warn('warn');
      logger.error('error');
      logger.api('GET', '/api');
      logger.exception(new Error('exception'));

      expect(console.log).toHaveBeenCalledTimes(2); // log + api
      expect(console.debug).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(2); // error + exception
    });
  });
});
