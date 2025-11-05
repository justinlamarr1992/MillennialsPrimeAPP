export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn(),
};

export const auth = mockAuth;

export const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
};

// Mock Firebase Auth functions
export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const sendPasswordResetEmail = jest.fn();
export const updateProfile = jest.fn();
export const getAuth = jest.fn(() => mockAuth);

// Reset all mocks helper
export const resetFirebaseMocks = () => {
  createUserWithEmailAndPassword.mockReset();
  signInWithEmailAndPassword.mockReset();
  signOut.mockReset();
  sendPasswordResetEmail.mockReset();
  updateProfile.mockReset();
  mockAuth.currentUser = null;
  mockAuth.onAuthStateChanged.mockReset();
};
