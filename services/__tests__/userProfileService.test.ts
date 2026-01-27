/**
 * Tests for userProfileService
 * Following TDD approach - tests written first
 *
 * IMPORTANT: Server expects data wrapped in `values` object for all update endpoints.
 */

// Mock dependencies BEFORE imports
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    multiRemove: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));
jest.mock("@/API/axios", () => ({
  axiosPrivate: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("@/services/serverAuth");
jest.mock("@/utils/logger");

import { userProfileService } from "../userProfileService";
import { serverAuth } from "../serverAuth";
import { axiosPrivate } from "@/API/axios";
import type {
  ServerUserProfile,
  MyInfoFormData,
  BusinessFormData,
  ArtFormData,
} from "@/types/UserProfile";

describe("userProfileService", () => {
  const mockUserId = "user-123-abc";
  const mockedAxiosPrivate = axiosPrivate as jest.Mocked<typeof axiosPrivate>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(serverAuth, "getUserId").mockResolvedValue(mockUserId);
  });

  describe("fetchProfile", () => {
    it("fetches complete user profile from server", async () => {
      const mockProfile: ServerUserProfile = {
        _id: mockUserId,
        username: "testuser",
        name: "John Doe",
        email: "john@example.com",
        location: {
          country: "USA",
          state: "California",
          city: "San Francisco",
          zip: 94102,
        },
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockProfile });

      const result = await userProfileService.fetchProfile();

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(axiosPrivate.get).toHaveBeenCalledWith(`/users/${mockUserId}`);
      expect(result).toEqual(mockProfile);
    });

    it("throws error when user ID not found", async () => {
      jest.spyOn(serverAuth, "getUserId").mockResolvedValue(null);

      await expect(userProfileService.fetchProfile()).rejects.toThrow("User ID not found");
    });

    it("handles server errors", async () => {
      const mockError = new Error("Server error");
      mockedAxiosPrivate.get.mockRejectedValueOnce(mockError);

      await expect(userProfileService.fetchProfile()).rejects.toThrow("Server error");
    });
  });

  describe("updateMyInfo", () => {
    it("updates basic profile info successfully with values wrapper", async () => {
      const formData: MyInfoFormData = {
        name: "Jane Doe",
        country: "USA",
        state: "New York",
        city: "New York City",
        zip: "10001",
      };

      mockedAxiosPrivate.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateMyInfo(formData);

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(axiosPrivate.patch).toHaveBeenCalledWith(`/users/${mockUserId}`, {
        values: {
          name: "Jane Doe",
          country: "USA",
          state: "New York",
          city: "New York City",
          zip: 10001,
        },
      });
    });

    it("converts zip string to number", async () => {
      const formData: MyInfoFormData = {
        name: "Test User",
        country: "USA",
        state: "CA",
        city: "LA",
        zip: "90210",
      };

      mockedAxiosPrivate.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateMyInfo(formData);

      expect(axiosPrivate.patch).toHaveBeenCalledWith(`/users/${mockUserId}`, {
        values: {
          name: "Test User",
          country: "USA",
          state: "CA",
          city: "LA",
          zip: 90210,
        },
      });
    });

    it("handles invalid zip code gracefully", async () => {
      const formData: MyInfoFormData = {
        name: "Test User",
        country: "USA",
        state: "CA",
        city: "LA",
        zip: "invalid",
      };

      mockedAxiosPrivate.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateMyInfo(formData);

      expect(axiosPrivate.patch).toHaveBeenCalledWith(`/users/${mockUserId}`, {
        values: {
          name: "Test User",
          country: "USA",
          state: "CA",
          city: "LA",
          zip: undefined,
        },
      });
    });

    it("throws error when user ID not found", async () => {
      jest.spyOn(serverAuth, "getUserId").mockResolvedValue(null);

      const formData: MyInfoFormData = {
        name: "Test",
        country: "USA",
        state: "CA",
        city: "LA",
        zip: "90210",
      };

      await expect(userProfileService.updateMyInfo(formData)).rejects.toThrow("User ID not found");
    });
  });

  describe("updateBusiness", () => {
    it("updates business profile successfully with values wrapper", async () => {
      const formData: BusinessFormData = {
        entrepreneur: "Yes",
        industry: "Technology",
        businessSize: "Medium",
        businessLocationReason: "Access to talent",
      };

      mockedAxiosPrivate.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateBusiness(formData);

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(axiosPrivate.patch).toHaveBeenCalledWith(`/users/business/${mockUserId}`, {
        values: {
          entrepreneur: true,
          industry: "Technology",
          lengthOpen: "Medium",
          factorsOfLocation: "Access to talent",
        },
      });
    });

    it('converts "No" to false for entrepreneur field', async () => {
      const formData: BusinessFormData = {
        entrepreneur: "No",
        industry: "Retail",
      };

      mockedAxiosPrivate.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateBusiness(formData);

      expect(axiosPrivate.patch).toHaveBeenCalledWith(`/users/business/${mockUserId}`, {
        values: {
          entrepreneur: false,
          industry: "Retail",
          lengthOpen: undefined,
          factorsOfLocation: undefined,
        },
      });
    });

    it("throws error when user ID not found", async () => {
      jest.spyOn(serverAuth, "getUserId").mockResolvedValue(null);

      const formData: BusinessFormData = {
        entrepreneur: "Yes",
      };

      await expect(userProfileService.updateBusiness(formData)).rejects.toThrow(
        "User ID not found"
      );
    });
  });

  describe("updateArt", () => {
    it("updates artist profile successfully with values wrapper", async () => {
      const formData: ArtFormData = {
        artist: "Yes",
        professionalArtist: "Yes",
        purpose: "Expression",
        favorites: "Abstract",
        issues: "Climate change",
        industryNavigation: "Networking",
        network: "Yes",
        integral: "Yes",
      };

      mockedAxiosPrivate.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateArt(formData);

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(axiosPrivate.patch).toHaveBeenCalledWith(`/users/art/${mockUserId}`, {
        values: {
          artist: true,
          professional: true,
          purpose: "Expression",
          favsOrNoneFavs: "Abstract",
          affectIssues: "Climate change",
          navigateIndustry: "Networking",
          network: true,
          specificIntegral: true,
        },
      });
    });

    it('converts "No" values to false', async () => {
      const formData: ArtFormData = {
        artist: "No",
        professionalArtist: "No",
        network: "No",
        integral: "No",
      };

      mockedAxiosPrivate.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateArt(formData);

      expect(axiosPrivate.patch).toHaveBeenCalledWith(`/users/art/${mockUserId}`, {
        values: {
          artist: false,
          professional: false,
          purpose: undefined,
          favsOrNoneFavs: undefined,
          affectIssues: undefined,
          navigateIndustry: undefined,
          network: false,
          specificIntegral: false,
        },
      });
    });

    it("throws error when user ID not found", async () => {
      jest.spyOn(serverAuth, "getUserId").mockResolvedValue(null);

      const formData: ArtFormData = {
        artist: "Yes",
      };

      await expect(userProfileService.updateArt(formData)).rejects.toThrow("User ID not found");
    });
  });

  describe("uploadProfilePicture", () => {
    it("uploads profile picture with correct server format", async () => {
      const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANS...";

      mockedAxiosPrivate.post.mockResolvedValueOnce({ data: {} });

      await userProfileService.uploadProfilePicture(base64Image);

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(axiosPrivate.post).toHaveBeenCalledWith("/users/pic", {
        _id: mockUserId,
        newImage: {
          image: base64Image,
        },
      });
    });

    it("throws error when user ID not found", async () => {
      jest.spyOn(serverAuth, "getUserId").mockResolvedValue(null);

      await expect(userProfileService.uploadProfilePicture("base64-image")).rejects.toThrow(
        "User ID not found"
      );
    });
  });

  describe("getProfilePicture", () => {
    it("retrieves profile picture with correct server format", async () => {
      const mockImage = "data:image/png;base64,iVBORw0KGgoAAAANS...";
      mockedAxiosPrivate.post.mockResolvedValueOnce({ data: { getImageToClient: mockImage } });

      const result = await userProfileService.getProfilePicture();

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(axiosPrivate.post).toHaveBeenCalledWith("/users/getpic", {
        _id: mockUserId,
      });
      expect(result).toBe(mockImage);
    });

    it("returns null when no image exists", async () => {
      mockedAxiosPrivate.post.mockResolvedValueOnce({ data: {} });

      const result = await userProfileService.getProfilePicture();

      expect(result).toBeNull();
    });

    it("returns null when getImageToClient is null", async () => {
      mockedAxiosPrivate.post.mockResolvedValueOnce({ data: { getImageToClient: null } });

      const result = await userProfileService.getProfilePicture();

      expect(result).toBeNull();
    });

    it("throws error when user ID not found", async () => {
      jest.spyOn(serverAuth, "getUserId").mockResolvedValue(null);

      await expect(userProfileService.getProfilePicture()).rejects.toThrow("User ID not found");
    });
  });
});
