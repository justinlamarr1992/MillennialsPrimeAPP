export const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
};

// Mock auth methods - these return promises to match React Native Firebase behavior
const createUserWithEmailAndPassword = jest.fn();
const signInWithEmailAndPassword = jest.fn();
const signOut = jest.fn();
const sendPasswordResetEmail = jest.fn();
const updateProfile = jest.fn();
const onAuthStateChanged = jest.fn();

// Mock auth() function that returns an object with all methods
// This matches the React Native Firebase SDK pattern: auth().methodName()
export const mockAuthInstance = {
  currentUser: null,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
};

// Default export is a function that returns the auth instance
// This matches: import auth from '@react-native-firebase/auth'; auth().method()
const auth = jest.fn(() => mockAuthInstance);

// Also export as named export for firebaseConfig compatibility
export { auth };

// Export individual methods for test assertions
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
};

// For backwards compatibility with existing tests that might use getAuth
export const getAuth = jest.fn(() => mockAuthInstance);

// Reset all mocks helper
export const resetFirebaseMocks = () => {
  createUserWithEmailAndPassword.mockReset();
  signInWithEmailAndPassword.mockReset();
  signOut.mockReset();
  sendPasswordResetEmail.mockReset();
  updateProfile.mockReset();
  onAuthStateChanged.mockReset();
  mockAuthInstance.currentUser = null;
};

// Export default for: import auth from '@react-native-firebase/auth'
export default auth;
