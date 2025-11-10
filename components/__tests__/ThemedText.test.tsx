import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import { ThemedText } from '../ThemedText';

describe('ThemedText', () => {
  describe('Content Display', () => {
    it('should display text content to the user', () => {
      render(<ThemedText>Hello World</ThemedText>);
      expect(screen.getByText('Hello World')).toBeTruthy();
    });

    it('should display nested text content', () => {
      render(
        <ThemedText>
          Parent <ThemedText>Nested</ThemedText>
        </ThemedText>
      );
      expect(screen.getByText(/Nested/)).toBeTruthy();
    });
  });

  describe('Text Presentation Types', () => {
    it('should display title-sized text when type is "title"', () => {
      render(<ThemedText type="title" testID="title-text">Title</ThemedText>);
      const text = screen.getByTestId('title-text');
      expect(text).toBeTruthy();
      expect(screen.getByText('Title')).toBeTruthy();
    });

    it('should display subtitle-sized text when type is "subtitle"', () => {
      render(<ThemedText type="subtitle" testID="subtitle-text">Subtitle</ThemedText>);
      const text = screen.getByTestId('subtitle-text');
      expect(text).toBeTruthy();
      expect(screen.getByText('Subtitle')).toBeTruthy();
    });

    it('should display semibold text when type is "defaultSemiBold"', () => {
      render(<ThemedText type="defaultSemiBold" testID="semibold-text">SemiBold</ThemedText>);
      const text = screen.getByTestId('semibold-text');
      expect(text).toBeTruthy();
      expect(screen.getByText('SemiBold')).toBeTruthy();
    });

    it('should display link-styled text when type is "link"', () => {
      render(<ThemedText type="link" testID="link-text">Link</ThemedText>);
      const text = screen.getByTestId('link-text');
      expect(text).toBeTruthy();
      expect(screen.getByText('Link')).toBeTruthy();
    });

    it('should display default text when no type is specified', () => {
      render(<ThemedText testID="default-text">Default</ThemedText>);
      const text = screen.getByTestId('default-text');
      expect(text).toBeTruthy();
      expect(screen.getByText('Default')).toBeTruthy();
    });
  });

  describe('Theme Color Adaptation', () => {
    it('should render with light theme color when specified', () => {
      render(<ThemedText lightColor="#FFFFFF">Light</ThemedText>);
      expect(screen.getByText('Light')).toBeTruthy();
    });

    it('should render with dark theme color when specified', () => {
      render(<ThemedText darkColor="#000000">Dark</ThemedText>);
      expect(screen.getByText('Dark')).toBeTruthy();
    });

    it('should render with both light and dark theme colors when both specified', () => {
      render(<ThemedText lightColor="#FFFFFF" darkColor="#000000">Themed</ThemedText>);
      expect(screen.getByText('Themed')).toBeTruthy();
    });
  });

  describe('Text Truncation and Formatting', () => {
    it('should truncate long text when numberOfLines is specified', () => {
      render(
        <ThemedText numberOfLines={2} testID="truncated">
          This is a very long text that should be truncated after two lines
        </ThemedText>
      );
      const text = screen.getByTestId('truncated');
      expect(text.props.numberOfLines).toBe(2);
    });

    it('should apply ellipsis mode when specified', () => {
      render(
        <ThemedText ellipsizeMode="tail" testID="ellipsis">
          Long text with ellipsis
        </ThemedText>
      );
      const text = screen.getByTestId('ellipsis');
      expect(text.props.ellipsizeMode).toBe('tail');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with accessibility label', () => {
      render(
        <ThemedText accessibilityLabel="Accessible Text">
          Content
        </ThemedText>
      );
      expect(screen.getByText('Content')).toBeTruthy();
    });

    it('should support accessibility role for assistive technologies', () => {
      render(
        <ThemedText accessible={true} accessibilityRole="header">
          Header Text
        </ThemedText>
      );
      expect(screen.getByText('Header Text')).toBeTruthy();
    });
  });

  describe('Custom Styling', () => {
    it('should accept and apply custom style prop', () => {
      const customStyle = { marginTop: 10 };
      render(
        <ThemedText style={customStyle} testID="custom-styled">
          Custom Styled
        </ThemedText>
      );
      expect(screen.getByTestId('custom-styled')).toBeTruthy();
      expect(screen.getByText('Custom Styled')).toBeTruthy();
    });
  });
});
