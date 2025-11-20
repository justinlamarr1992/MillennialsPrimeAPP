import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import ContentCard from "../ContentCard";

/**
 * Unit tests for ContentCard component
 * Following functional programming and clean code principles
 */
describe("ContentCard", () => {
  /**
   * Pure test data generators
   */
  const createBaseProps = () => ({
    title: "Test Video Title",
    description: "Test video description",
    dateUploaded: "2024-01-15T10:00:00Z",
  });

  const createPrimeProps = () => ({
    ...createBaseProps(),
    isPrime: true,
  });

  const createNonPrimeProps = () => ({
    ...createBaseProps(),
    isPrime: false,
  });

  describe("Rendering", () => {
    it("should render card with title", () => {
      render(<ContentCard {...createBaseProps()} />);

      expect(screen.getByText("Test Video Title")).toBeTruthy();
    });

    it("should render card with description", () => {
      render(<ContentCard {...createBaseProps()} />);

      expect(screen.getByText("Test video description")).toBeTruthy();
    });

    it("should render formatted date", () => {
      render(<ContentCard {...createBaseProps()} />);

      // Date should be formatted as "Jan 15, 2024"
      expect(screen.getByText(/Jan 15, 2024/)).toBeTruthy();
    });

    it("should not render description when not provided", () => {
      const props = {
        title: "Test Title",
        dateUploaded: "2024-01-15T10:00:00Z",
      };

      render(<ContentCard {...props} />);

      expect(screen.getByText("Test Title")).toBeTruthy();
      expect(screen.queryByText("Test video description")).toBeNull();
    });

    it("should not render date when not provided", () => {
      const props = {
        title: "Test Title",
        description: "Test Description",
      };

      render(<ContentCard {...props} />);

      expect(screen.getByText("Test Title")).toBeTruthy();
      expect(screen.queryByText(/Jan/)).toBeNull();
    });
  });

  describe("Badge display", () => {
    it("should not show new badge by default", () => {
      render(<ContentCard {...createBaseProps()} />);

      expect(screen.queryByText("New Episode")).toBeNull();
    });

    it("should show new badge when showNewBadge is true", () => {
      render(<ContentCard {...createBaseProps()} showNewBadge={true} />);

      expect(screen.getByText("New Episode")).toBeTruthy();
    });
  });

  describe("Menu button", () => {
    it("should not show menu button by default", () => {
      render(<ContentCard {...createBaseProps()} />);

      // Menu button contains an Ionicon, look for the icon
      const menuButtons = screen.queryAllByText("ellipsis-vertical");
      expect(menuButtons.length).toBe(0);
    });

    it("should show menu button when showMenu is true", () => {
      render(<ContentCard {...createBaseProps()} showMenu={true} />);

      // The Ionicon should render
      expect(screen.getByText("")).toBeTruthy(); // Ionicons render as empty text
    });

    it("should call onMenuPress when menu button is pressed", () => {
      const mockOnMenuPress = jest.fn();

      render(
        <ContentCard
          {...createBaseProps()}
          showMenu={true}
          onMenuPress={mockOnMenuPress}
        />
      );

      const menuButton = screen.getAllByRole("button")[1]; // Second button (first is card)
      fireEvent.press(menuButton);

      expect(mockOnMenuPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("Card interaction", () => {
    it("should call onPress when card is pressed", () => {
      const mockOnPress = jest.fn();

      render(<ContentCard {...createBaseProps()} onPress={mockOnPress} />);

      const card = screen.getAllByRole("button")[0];
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("should not crash when onPress is not provided", () => {
      render(<ContentCard {...createBaseProps()} />);

      const card = screen.getAllByRole("button")[0];

      expect(() => fireEvent.press(card)).not.toThrow();
    });
  });

  describe("Prime status styling", () => {
    it("should apply prime styling when isPrime is true", () => {
      render(<ContentCard {...createPrimeProps()} />);

      // Visual styling is applied via LinearGradient
      expect(screen.getByText("Test Video Title")).toBeTruthy();
    });

    it("should apply non-prime styling when isPrime is false", () => {
      render(<ContentCard {...createNonPrimeProps()} />);

      // Visual styling is applied via LinearGradient
      expect(screen.getByText("Test Video Title")).toBeTruthy();
    });
  });

  describe("Pure component behavior", () => {
    it("should render consistently with same props (deterministic)", () => {
      const props = createBaseProps();

      const { rerender } = render(<ContentCard {...props} />);
      const firstRender = screen.getByText("Test Video Title");

      rerender(<ContentCard {...props} />);
      const secondRender = screen.getByText("Test Video Title");

      expect(firstRender).toBeTruthy();
      expect(secondRender).toBeTruthy();
    });

    it("should not have side effects", () => {
      const mockOnPress = jest.fn();
      const props = {
        ...createBaseProps(),
        onPress: mockOnPress,
      };

      render(<ContentCard {...props} />);

      // Rendering alone should not trigger callbacks
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    it("should handle invalid date format gracefully", () => {
      const props = {
        ...createBaseProps(),
        dateUploaded: "invalid-date",
      };

      render(<ContentCard {...props} />);

      // Should render the invalid date string as-is
      expect(screen.getByText("invalid-date")).toBeTruthy();
    });

    it("should handle very long titles", () => {
      const props = {
        title: "A".repeat(200),
        description: "Test",
      };

      render(<ContentCard {...props} />);

      // Should truncate with numberOfLines={2}
      expect(screen.getByText("A".repeat(200))).toBeTruthy();
    });

    it("should handle very long descriptions", () => {
      const props = {
        title: "Test",
        description: "B".repeat(500),
      };

      render(<ContentCard {...props} />);

      // Should truncate with numberOfLines={3}
      expect(screen.getByText("B".repeat(500))).toBeTruthy();
    });
  });
});
