/**
 * Test Data Factories
 *
 * Reusable functions to generate mock data for tests.
 * Use these to avoid duplication and ensure consistency across tests.
 *
 * @example
 * const user = createMockUser({ email: 'custom@example.com' });
 * const post = createMockTextPost({ title: 'Custom Title' });
 */

/**
 * User and Authentication Data
 */

export interface MockUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  DOB?: string;
  roles?: {
    User?: number;
    Admin?: number;
    Prime?: number;
  };
}

export const createMockUser = (overrides?: Partial<MockUser>): MockUser => ({
  id: "user-123",
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  DOB: "1990-01-01",
  roles: { User: 2001 },
  ...overrides,
});

export const createMockAdminUser = (overrides?: Partial<MockUser>): MockUser =>
  createMockUser({
    roles: { User: 2001, Admin: 5150 },
    ...overrides,
  });

export const createMockPrimeUser = (overrides?: Partial<MockUser>): MockUser =>
  createMockUser({
    roles: { User: 2001, Prime: 3000 },
    ...overrides,
  });

export interface MockAuthResponse {
  accessToken: string;
  _id: string;
  roles: {
    User?: number;
    Admin?: number;
    Prime?: number;
  };
}

export const createMockAuthResponse = (
  overrides?: Partial<MockAuthResponse>
): MockAuthResponse => ({
  accessToken: "mock-access-token-123",
  _id: "user-mongodb-id-456",
  roles: { User: 2001 },
  ...overrides,
});

/**
 * Profile Data
 */

export interface MockMyInfoProfile {
  firstName?: string;
  lastName?: string;
  DOB?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export const createMockMyInfoProfile = (
  overrides?: Partial<MockMyInfoProfile>
): MockMyInfoProfile => ({
  firstName: "John",
  lastName: "Doe",
  DOB: "1990-01-01",
  email: "john.doe@example.com",
  phone: "555-0100",
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zip: "10001",
  country: "USA",
  ...overrides,
});

export interface MockBusinessProfile {
  entrepreneur?: string | boolean;
  businessSize?: string;
  businessLocationReason?: string;
  lengthOpen?: string;
  factorsOfLocation?: string;
}

export const createMockBusinessProfile = (
  overrides?: Partial<MockBusinessProfile>
): MockBusinessProfile => ({
  entrepreneur: "Yes",
  businessSize: "Small",
  businessLocationReason: "Market access",
  lengthOpen: "1-2 years",
  factorsOfLocation: "Demographics",
  ...overrides,
});

export interface MockArtProfile {
  artist?: string | boolean;
  professionalArtist?: string;
  favorites?: string;
  issues?: string;
  industryNavigation?: string;
  integral?: string;
}

export const createMockArtProfile = (overrides?: Partial<MockArtProfile>): MockArtProfile => ({
  artist: "Yes",
  professionalArtist: "Full-time",
  favorites: "Painting",
  issues: "Funding",
  industryNavigation: "Networking",
  integral: "Community support",
  ...overrides,
});

/**
 * Post Data
 */

export interface MockTextPost {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  dislikeCount?: number;
  isAdmin?: boolean;
  isPrime?: boolean;
}

export const createMockTextPost = (overrides?: Partial<MockTextPost>): MockTextPost => ({
  id: "post-123",
  title: "Test Post Title",
  description: "This is a test post description",
  authorId: "user-123",
  authorName: "John Doe",
  createdAt: "2026-01-26T12:00:00Z",
  likeCount: 10,
  commentCount: 5,
  dislikeCount: 2,
  isAdmin: false,
  isPrime: false,
  ...overrides,
});

export const createMockAdminPost = (overrides?: Partial<MockTextPost>): MockTextPost =>
  createMockTextPost({
    authorName: "Admin User",
    isAdmin: true,
    ...overrides,
  });

export const createMockPrimePost = (overrides?: Partial<MockTextPost>): MockTextPost =>
  createMockTextPost({
    authorName: "Prime User",
    isPrime: true,
    ...overrides,
  });

export interface MockVideoPost extends MockTextPost {
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
}

export const createMockVideoPost = (overrides?: Partial<MockVideoPost>): MockVideoPost => ({
  ...createMockTextPost(),
  videoUrl: "https://example.com/video.mp4",
  thumbnailUrl: "https://example.com/thumbnail.jpg",
  duration: 120,
  ...overrides,
});

export interface MockPicturePost extends MockTextPost {
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
}

export const createMockPicturePost = (overrides?: Partial<MockPicturePost>): MockPicturePost => ({
  ...createMockTextPost(),
  imageUrl: "https://example.com/image.jpg",
  imageWidth: 800,
  imageHeight: 600,
  ...overrides,
});

export interface MockComment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likeCount: number;
}

export const createMockComment = (overrides?: Partial<MockComment>): MockComment => ({
  id: "comment-123",
  text: "This is a test comment",
  authorId: "user-123",
  authorName: "John Doe",
  createdAt: "2026-01-26T12:00:00Z",
  likeCount: 3,
  ...overrides,
});

/**
 * Error Data
 */

export interface MockFirebaseError {
  code: string;
  message: string;
}

export const createMockFirebaseError = (code: string, message?: string): MockFirebaseError => ({
  code,
  message: message || `Firebase error: ${code}`,
});

export const createMockAuthErrors = () => ({
  userNotFound: createMockFirebaseError("auth/user-not-found", "User not found"),
  wrongPassword: createMockFirebaseError("auth/wrong-password", "Wrong password"),
  invalidCredential: createMockFirebaseError("auth/invalid-credential", "Invalid credential"),
  userDisabled: createMockFirebaseError("auth/user-disabled", "User disabled"),
  tooManyRequests: createMockFirebaseError("auth/too-many-requests", "Too many requests"),
  emailInUse: createMockFirebaseError("auth/email-already-in-use", "Email in use"),
  weakPassword: createMockFirebaseError("auth/weak-password", "Weak password"),
  invalidEmail: createMockFirebaseError("auth/invalid-email", "Invalid email"),
  networkError: createMockFirebaseError("auth/network-request-failed", "Network failed"),
  invalidToken: createMockFirebaseError("auth/invalid-user-token", "Invalid token"),
  tokenExpired: createMockFirebaseError("auth/user-token-expired", "Token expired"),
});

/**
 * Form Data
 */

export interface MockLoginForm {
  email: string;
  password: string;
}

export const createMockLoginForm = (overrides?: Partial<MockLoginForm>): MockLoginForm => ({
  email: "test@example.com",
  password: "password123",
  ...overrides,
});

export interface MockRegisterForm extends MockLoginForm {
  firstName: string;
  lastName: string;
  DOB: string;
  confirmPassword?: string;
}

export const createMockRegisterForm = (
  overrides?: Partial<MockRegisterForm>
): MockRegisterForm => ({
  email: "newuser@example.com",
  password: "SecurePass123!",
  confirmPassword: "SecurePass123!",
  firstName: "Jane",
  lastName: "Smith",
  DOB: "1995-05-15",
  ...overrides,
});

/**
 * API Response Data
 */

export interface MockApiResponse<T = unknown> {
  data: T;
  status?: number;
  statusText?: string;
}

export const createMockApiResponse = <T = unknown>(
  data: T,
  overrides?: Partial<MockApiResponse<T>>
): MockApiResponse<T> => ({
  data,
  status: 200,
  statusText: "OK",
  ...overrides,
});

export const createMockApiError = (
  status: number,
  message: string
): MockApiResponse<{ message: string }> => ({
  data: { message },
  status,
  statusText: status === 401 ? "Unauthorized" : "Error",
});

/**
 * Edge Case Data
 */

export const edgeCaseStrings = {
  empty: "",
  whitespace: "   ",
  veryLong: "A".repeat(500),
  withSpecialChars: 'Test & "special" <chars>',
  withUnicode: "José García Müller",
  withNewlines: "Line 1\nLine 2\nLine 3",
  withEmojis: "Hello 👋 World 🌍",
  withHtml: '<script>alert("xss")</script>',
  withSql: "'; DROP TABLE users; --",
};

export const edgeCaseNumbers = {
  zero: 0,
  negative: -1,
  veryLarge: Number.MAX_SAFE_INTEGER,
  verySmall: Number.MIN_SAFE_INTEGER,
  float: 3.14159,
  infinity: Infinity,
  negativeInfinity: -Infinity,
};

export const edgeCaseArrays = {
  empty: [],
  single: [1],
  duplicate: [1, 1, 1],
  mixed: [1, "two", true, null, undefined],
};

/**
 * Utility Functions
 */

/**
 * Create multiple mock users
 */
export const createMockUsers = (count: number): MockUser[] =>
  Array.from({ length: count }, (_, i) =>
    createMockUser({
      id: `user-${i + 1}`,
      email: `user${i + 1}@example.com`,
      firstName: `User${i + 1}`,
    })
  );

/**
 * Create multiple mock posts
 */
export const createMockPosts = (count: number): MockTextPost[] =>
  Array.from({ length: count }, (_, i) =>
    createMockTextPost({
      id: `post-${i + 1}`,
      title: `Post ${i + 1}`,
      description: `Description for post ${i + 1}`,
    })
  );

/**
 * Create multiple mock comments
 */
export const createMockComments = (count: number): MockComment[] =>
  Array.from({ length: count }, (_, i) =>
    createMockComment({
      id: `comment-${i + 1}`,
      text: `Comment ${i + 1}`,
    })
  );

/**
 * Create a mock user with a full profile
 */
export const createMockUserWithProfile = (
  userOverrides?: Partial<MockUser>,
  profileOverrides?: Partial<MockMyInfoProfile>
) => ({
  user: createMockUser(userOverrides),
  profile: createMockMyInfoProfile(profileOverrides),
});

/**
 * Create mock data for post ownership scenarios
 */
export const createPostOwnershipScenario = () => {
  const owner = createMockUser({ id: "owner-123" });
  const nonOwner = createMockUser({ id: "other-456" });
  const post = createMockTextPost({ authorId: owner.id });

  return { owner, nonOwner, post };
};
