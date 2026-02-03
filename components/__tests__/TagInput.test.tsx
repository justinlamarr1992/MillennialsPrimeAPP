/**
 * TagInput Component - Behavioral Tests
 *
 * Tests verify user-facing behavior for tag input/management.
 * Focus: What users can do, not implementation details.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TagInput from "../TagInput";

describe("TagInput Component - Behavioral Tests", () => {
  describe("Given a user wants to add interests", () => {
    it("should allow adding a tag when text is entered and button pressed", () => {
      const onTagsChange = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <TagInput tags={[]} onTagsChange={onTagsChange} placeholder="Add interest" />
      );

      const input = getByPlaceholderText("Add interest");
      const addButton = getByText("Add");

      fireEvent.changeText(input, "React Native");
      fireEvent.press(addButton);

      expect(onTagsChange).toHaveBeenCalledWith(["React Native"]);
    });

    it("should clear input field after adding a tag", () => {
      const onTagsChange = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <TagInput tags={[]} onTagsChange={onTagsChange} placeholder="Add interest" />
      );

      const input = getByPlaceholderText("Add interest");
      const addButton = getByText("Add");

      fireEvent.changeText(input, "TypeScript");
      fireEvent.press(addButton);

      expect(input.props.value).toBe("");
    });

    it("should not add empty tags", () => {
      const onTagsChange = jest.fn();
      const { getByText } = render(
        <TagInput tags={[]} onTagsChange={onTagsChange} placeholder="Add interest" />
      );

      const addButton = getByText("Add");
      fireEvent.press(addButton);

      expect(onTagsChange).not.toHaveBeenCalled();
    });

    it("should trim whitespace from tags", () => {
      const onTagsChange = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <TagInput tags={[]} onTagsChange={onTagsChange} placeholder="Add interest" />
      );

      const input = getByPlaceholderText("Add interest");
      const addButton = getByText("Add");

      fireEvent.changeText(input, "  JavaScript  ");
      fireEvent.press(addButton);

      expect(onTagsChange).toHaveBeenCalledWith(["JavaScript"]);
    });
  });

  describe("Given a user wants to view their tags", () => {
    it("should display all existing tags", () => {
      const { getByText } = render(
        <TagInput
          tags={["React", "TypeScript", "Node.js"]}
          onTagsChange={jest.fn()}
          placeholder="Add interest"
        />
      );

      expect(getByText("React")).toBeTruthy();
      expect(getByText("TypeScript")).toBeTruthy();
      expect(getByText("Node.js")).toBeTruthy();
    });

    it("should display message when no tags exist", () => {
      const { getByText } = render(
        <TagInput tags={[]} onTagsChange={jest.fn()} placeholder="Add interest" />
      );

      expect(getByText("No tags added yet")).toBeTruthy();
    });
  });

  describe("Given a user wants to remove a tag", () => {
    it("should allow removing a tag when X button is pressed", () => {
      const onTagsChange = jest.fn();
      const { getAllByTestId } = render(
        <TagInput
          tags={["React", "TypeScript"]}
          onTagsChange={onTagsChange}
          placeholder="Add interest"
        />
      );

      const removeButtons = getAllByTestId("remove-tag");
      fireEvent.press(removeButtons[0]); // Remove first tag

      expect(onTagsChange).toHaveBeenCalledWith(["TypeScript"]);
    });

    it("should remove the correct tag when multiple exist", () => {
      const onTagsChange = jest.fn();
      const { getAllByTestId } = render(
        <TagInput
          tags={["React", "TypeScript", "Node.js"]}
          onTagsChange={onTagsChange}
          placeholder="Add interest"
        />
      );

      const removeButtons = getAllByTestId("remove-tag");
      fireEvent.press(removeButtons[1]); // Remove second tag (TypeScript)

      expect(onTagsChange).toHaveBeenCalledWith(["React", "Node.js"]);
    });
  });

  describe("Given validation constraints", () => {
    it("should not allow more than 10 tags", () => {
      const existingTags = Array.from({ length: 10 }, (_, i) => `Tag${i + 1}`);
      const onTagsChange = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <TagInput tags={existingTags} onTagsChange={onTagsChange} placeholder="Add interest" />
      );

      const input = getByPlaceholderText("Add interest");
      const addButton = getByText("Add");

      fireEvent.changeText(input, "Tag11");
      fireEvent.press(addButton);

      expect(onTagsChange).not.toHaveBeenCalled();
    });

    it("should show error message when max tags reached", () => {
      const existingTags = Array.from({ length: 10 }, (_, i) => `Tag${i + 1}`);
      const { getByPlaceholderText, getByText, queryByText } = render(
        <TagInput tags={existingTags} onTagsChange={jest.fn()} placeholder="Add interest" />
      );

      const input = getByPlaceholderText("Add interest");
      const addButton = getByText("Add");

      fireEvent.changeText(input, "Tag11");
      fireEvent.press(addButton);

      expect(queryByText(/Maximum 10 tags allowed/i)).toBeTruthy();
    });

    it("should not allow tags longer than 30 characters", () => {
      const onTagsChange = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <TagInput tags={[]} onTagsChange={onTagsChange} placeholder="Add interest" />
      );

      const input = getByPlaceholderText("Add interest");
      const addButton = getByText("Add");

      const longTag = "A".repeat(31);
      fireEvent.changeText(input, longTag);
      fireEvent.press(addButton);

      expect(onTagsChange).not.toHaveBeenCalled();
    });

    it("should show error message when tag is too long", () => {
      const { getByPlaceholderText, getByText, queryByText } = render(
        <TagInput tags={[]} onTagsChange={jest.fn()} placeholder="Add interest" />
      );

      const input = getByPlaceholderText("Add interest");
      const addButton = getByText("Add");

      const longTag = "A".repeat(31);
      fireEvent.changeText(input, longTag);
      fireEvent.press(addButton);

      expect(queryByText(/Maximum 30 characters per tag/i)).toBeTruthy();
    });

    it("should not add duplicate tags", () => {
      const onTagsChange = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <TagInput tags={["React"]} onTagsChange={onTagsChange} placeholder="Add interest" />
      );

      const input = getByPlaceholderText("Add interest");
      const addButton = getByText("Add");

      fireEvent.changeText(input, "React");
      fireEvent.press(addButton);

      expect(onTagsChange).not.toHaveBeenCalled();
    });

    it("should show error message when duplicate tag is entered", () => {
      const { getByPlaceholderText, getByText, queryByText } = render(
        <TagInput tags={["React"]} onTagsChange={jest.fn()} placeholder="Add interest" />
      );

      const input = getByPlaceholderText("Add interest");
      const addButton = getByText("Add");

      fireEvent.changeText(input, "React");
      fireEvent.press(addButton);

      expect(queryByText(/Tag already exists/i)).toBeTruthy();
    });
  });

  describe("Given accessibility requirements", () => {
    it("should have accessible input field", () => {
      const { getByPlaceholderText } = render(
        <TagInput tags={[]} onTagsChange={jest.fn()} placeholder="Add interest" />
      );

      const input = getByPlaceholderText("Add interest");
      expect(input.props.accessibilityLabel).toBe("Tag input field");
    });

    it("should have accessible add button", () => {
      const { getByTestId } = render(
        <TagInput tags={[]} onTagsChange={jest.fn()} placeholder="Add interest" />
      );

      const addButton = getByTestId("add-tag-button");
      expect(addButton.props.accessibilityLabel).toBe("Add tag");
      expect(addButton.props.accessibilityHint).toBe("Add the entered tag to the list");
    });

    it("should have accessible remove buttons", () => {
      const { getAllByTestId } = render(
        <TagInput tags={["React"]} onTagsChange={jest.fn()} placeholder="Add interest" />
      );

      const removeButton = getAllByTestId("remove-tag")[0];
      expect(removeButton.props.accessibilityLabel).toBe("Remove React tag");
      expect(removeButton.props.accessibilityRole).toBe("button");
    });
  });
});
