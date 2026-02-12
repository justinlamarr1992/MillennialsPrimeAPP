import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import InterestSection from "../InterestSection";

describe("InterestSection", () => {
  describe("When a user has no interests", () => {
    it("should not display the interests section", () => {
      const { toJSON } = render(<InterestSection interests={[]} />);

      expect(toJSON()).toBeNull();
    });
  });

  describe("When a user has interests", () => {
    const interests = ["Graphic Design", "Photography", "Music"];
    const renderWithInterests = () =>
      render(<InterestSection interests={interests} />);

    it("should display all of their interests", () => {
      renderWithInterests();

      interests.forEach((interest) => {
        expect(screen.getByText(interest)).toBeTruthy();
      });
    });

    it("should label the section as Interests", () => {
      renderWithInterests();

      expect(screen.getByText("Interests")).toBeTruthy();
    });

    it("should announce each interest for screen readers", () => {
      renderWithInterests();

      interests.forEach((interest) => {
        expect(screen.getByLabelText(`Interest: ${interest}`)).toBeTruthy();
      });
    });
  });

  describe("When a user has a single interest", () => {
    it("should display that interest", () => {
      render(<InterestSection interests={["Painting"]} />);

      expect(screen.getByText("Painting")).toBeTruthy();
    });
  });
});
