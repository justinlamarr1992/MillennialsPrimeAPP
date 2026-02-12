import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import MetricsDashboard from "../MetricsDashboard";
import type { Metric } from "../MetricsDashboard";

describe("MetricsDashboard", () => {
  const sampleMetrics: Metric[] = [
    { label: "Connections", value: 12, icon: "people-outline" },
    { label: "Pending", value: 3, icon: "time-outline" },
    { label: "Posts", value: 0, icon: "document-text-outline" },
    { label: "Views", value: 47, icon: "eye-outline" },
  ];

  describe("When metrics are provided", () => {
    it("should display each metric's label", () => {
      render(<MetricsDashboard metrics={sampleMetrics} />);

      expect(screen.getByText("Connections")).toBeTruthy();
      expect(screen.getByText("Pending")).toBeTruthy();
      expect(screen.getByText("Posts")).toBeTruthy();
      expect(screen.getByText("Views")).toBeTruthy();
    });

    it("should display each metric's value", () => {
      render(<MetricsDashboard metrics={sampleMetrics} />);

      expect(screen.getByText("12")).toBeTruthy();
      expect(screen.getByText("3")).toBeTruthy();
      expect(screen.getByText("0")).toBeTruthy();
      expect(screen.getByText("47")).toBeTruthy();
    });

    it("should be labeled as a metrics section for accessibility", () => {
      render(<MetricsDashboard metrics={sampleMetrics} />);

      expect(screen.getByLabelText("Profile metrics")).toBeTruthy();
    });
  });

  describe("When no metrics are provided", () => {
    it("should not render anything", () => {
      render(<MetricsDashboard metrics={[]} />);

      expect(screen.queryByLabelText("Profile metrics")).toBeNull();
    });
  });

  describe("When a single metric is provided", () => {
    it("should display the metric", () => {
      render(
        <MetricsDashboard
          metrics={[{ label: "Connections", value: 5, icon: "people-outline" }]}
        />
      );

      expect(screen.getByText("Connections")).toBeTruthy();
      expect(screen.getByText("5")).toBeTruthy();
    });
  });
});
