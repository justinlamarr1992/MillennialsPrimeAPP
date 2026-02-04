/**
 * TagInput Component
 *
 * Reusable component for managing tags/chips with add/remove functionality.
 * Used for interests, skills, and other tag-based inputs.
 *
 * Features:
 * - Add tags via text input
 * - Remove tags via X button
 * - Validation (max 10 tags, max 30 chars per tag, no duplicates)
 * - Accessibility support
 * - Error messaging
 */

import React, { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder: string;
}

const MAX_TAGS = 10;
const MAX_TAG_LENGTH = 30;

/**
 * Pure function: Validate a new tag
 */
const validateTag = (tag: string, existingTags: string[]): { valid: boolean; error?: string } => {
  const trimmedTag = tag.trim();

  if (trimmedTag.length === 0) {
    return { valid: false };
  }

  if (trimmedTag.length > MAX_TAG_LENGTH) {
    return { valid: false, error: `Maximum ${MAX_TAG_LENGTH} characters per tag` };
  }

  if (existingTags.map(tagItem => tagItem.toLowerCase()).includes(trimmedTag.toLowerCase())) {
    return { valid: false, error: "Tag already exists" };
  }

  if (existingTags.length >= MAX_TAGS) {
    return { valid: false, error: `Maximum ${MAX_TAGS} tags allowed` };
  }

  return { valid: true };
};

/**
 * Pure function: Add a tag to the list
 */
const addTag = (tag: string, existingTags: string[]): string[] => {
  return [...existingTags, tag.trim()];
};

/**
 * Pure function: Remove a tag from the list
 */
const removeTag = (index: number, existingTags: string[]): string[] => {
  return existingTags.filter((_, i) => i !== index);
};

export default function TagInput({ tags, onTagsChange, placeholder }: TagInputProps) {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Handle adding a new tag
   */
  const handleAddTag = (): void => {
    const validation = validateTag(inputValue, tags);

    if (!validation.valid) {
      if (validation.error) {
        setErrorMessage(validation.error);
      }
      return;
    }

    const newTags = addTag(inputValue, tags);
    onTagsChange(newTags);
    setInputValue("");
    setErrorMessage(null);
  };

  /**
   * Handle removing a tag
   */
  const handleRemoveTag = (index: number): void => {
    const newTags = removeTag(index, tags);
    onTagsChange(newTags);
    setErrorMessage(null);
  };

  return (
    <View style={styles.container}>
      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { borderColor: colors.gray, color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.plcHoldText}
          value={inputValue}
          onChangeText={setInputValue}
          accessibilityLabel="Tag input field"
        />
        <Pressable
          style={[styles.addButton, { backgroundColor: colors.priC }]}
          onPress={handleAddTag}
          testID="add-tag-button"
          accessibilityLabel="Add tag"
          accessibilityHint="Add the entered tag to the list"
          accessibilityRole="button"
        >
          <Text style={[styles.addButtonText, { color: colors.secT }]}>Add</Text>
        </Pressable>
      </View>

      {/* Error message */}
      {errorMessage && (
        <Text style={[styles.errorText, { color: colors.triC }]}>
          {errorMessage}
        </Text>
      )}

      {/* Tags display */}
      <View style={styles.tagsContainer}>
        {tags.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.plcHoldText }]}>No tags added yet</Text>
        ) : (
          tags.map((tag, index) => (
            <View key={`${tag}-${index}`} style={[styles.tag, { backgroundColor: colors.secC }]}>
              <Text style={[styles.tagText, { color: colors.secT }]}>{tag}</Text>
              <Pressable
                onPress={() => handleRemoveTag(index)}
                testID="remove-tag"
                accessibilityLabel={`Remove ${tag} tag`}
                accessibilityRole="button"
                style={styles.removeButton}
              >
                <Text style={[styles.removeButtonText, { color: colors.secT }]}>×</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    marginRight: 6,
  },
  removeButton: {
    marginLeft: 4,
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
  },
});
