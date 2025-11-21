import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import ContentCarousel from "../ContentCarousel";

/**
 * Unit tests for ContentCarousel component
 * Following functional programming and clean code principles
 */
describe("ContentCarousel", () => {
  /**
   * Pure test data generators
   */
  const createMockChildren = () => (
    <>
      <Text testID="child-1">Child 1</Text>
      <Text testID="child-2">Child 2</Text>
    </>
  );

  describe("Rendering", () => {
    it("should render section title", () => {
      render(
        <ContentCarousel title="Test Section">
          {createMockChildren()}
        </ContentCarousel>
      );

      expect(screen.getByText("Test Section")).toBeTruthy();
    });

    it("should render children content", () => {
      render(
        <ContentCarousel title="Test Section">
          {createMockChildren()}
        </ContentCarousel>
      );

      expect(screen.getByTestId("child-1")).toBeTruthy();
      expect(screen.getByTestId("child-2")).toBeTruthy();
    });

    it("should not show badge when showBadge is false", () => {
      render(
        <ContentCarousel title="Test Section" showBadge={false}>
          {createMockChildren()}
        </ContentCarousel>
      );

      expect(screen.queryByText("New")).toBeNull();
    });

    it("should show badge when showBadge is true", () => {
      render(
        <ContentCarousel title="Test Section" showBadge={true}>
          {createMockChildren()}
        </ContentCarousel>
      );

      expect(screen.getByText("New")).toBeTruthy();
    });

    it("should display custom badge text", () => {
      render(
        <ContentCarousel
          title="Test Section"
          showBadge={true}
          badgeText="Custom Badge"
        >
          {createMockChildren()}
        </ContentCarousel>
      );

      expect(screen.getByText("Custom Badge")).toBeTruthy();
    });
  });

  describe("Props validation", () => {
    it("should handle empty children gracefully", () => {
      render(<ContentCarousel title="Empty Section">{null}</ContentCarousel>);

      expect(screen.getByText("Empty Section")).toBeTruthy();
    });

    it("should use default badge text when not provided", () => {
      render(
        <ContentCarousel title="Test Section" showBadge={true}>
          {createMockChildren()}
        </ContentCarousel>
      );

      expect(screen.getByText("New")).toBeTruthy();
    });
  });

  describe("Pure component behavior", () => {
    it("should render consistently with same props", () => {
      const props = {
        title: "Consistent Section",
        showBadge: true,
        badgeText: "Test",
      };

      const { rerender } = render(
        <ContentCarousel {...props}>
          {createMockChildren()}
        </ContentCarousel>
      );

      const firstRender = screen.getByText("Consistent Section");

      rerender(
        <ContentCarousel {...props}>
          {createMockChildren()}
        </ContentCarousel>
      );

      const secondRender = screen.getByText("Consistent Section");

      expect(firstRender).toBeTruthy();
      expect(secondRender).toBeTruthy();
    });
  });
});
