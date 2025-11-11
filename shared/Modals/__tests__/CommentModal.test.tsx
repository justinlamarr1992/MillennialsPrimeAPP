import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import CommentModal from '../CommentModal';

describe('CommentModal', () => {
  describe('Modal Content Display', () => {
    it('should display comment modal text', () => {
      render(<CommentModal />);
      expect(screen.getByText('CommentModalssss')).toBeTruthy();
    });
  });
});
