import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import B2BOpportunitySection from "../B2BOpportunitySection";

describe("B2BOpportunitySection", () => {
  describe("When a user has B2B disabled", () => {
    it("should not display the B2B section", () => {
      const { toJSON } = render(
        <B2BOpportunitySection
          b2bEnabled={false}
          industry="Tech"
          b2bTags={["Consulting"]}
        />
      );

      expect(toJSON()).toBeNull();
    });
  });

  describe("When a user has B2B enabled but no details", () => {
    it("should not display the B2B section", () => {
      const { toJSON } = render(
        <B2BOpportunitySection b2bEnabled={true} />
      );

      expect(toJSON()).toBeNull();
    });
  });

  describe("When a user has B2B enabled with an industry", () => {
    const renderWithIndustry = () =>
      render(<B2BOpportunitySection b2bEnabled={true} industry="Graphic Design" />);

    it("should label the section as B2B Opportunities", () => {
      renderWithIndustry();

      expect(screen.getByText("B2B Opportunities")).toBeTruthy();
    });

    it("should display their industry", () => {
      renderWithIndustry();

      expect(screen.getByText("Graphic Design")).toBeTruthy();
    });

    it("should announce the section for screen readers", () => {
      renderWithIndustry();

      expect(screen.getByLabelText("Business to business opportunities")).toBeTruthy();
    });
  });

  describe("When a user has B2B enabled with service tags", () => {
    const b2bTags = ["Consulting", "Web Design", "Marketing"];
    const renderWithTags = () =>
      render(
        <B2BOpportunitySection
          b2bEnabled={true}
          industry="Tech"
          b2bTags={b2bTags}
        />
      );

    it("should display all of their B2B services", () => {
      renderWithTags();

      b2bTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeTruthy();
      });
    });

    it("should announce each service for screen readers", () => {
      renderWithTags();

      b2bTags.forEach((tag) => {
        expect(screen.getByLabelText(`B2B service: ${tag}`)).toBeTruthy();
      });
    });
  });

  describe("When b2bEnabled is not specified", () => {
    it("should not display the B2B section", () => {
      const { toJSON } = render(
        <B2BOpportunitySection industry="Tech" b2bTags={["Consulting"]} />
      );

      expect(toJSON()).toBeNull();
    });
  });
});
