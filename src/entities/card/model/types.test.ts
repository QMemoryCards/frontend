import { describe, it, expect } from 'vitest';
import type { Card, CreateCardRequest, UpdateCardRequest, GetCardsResponse } from './types';

describe('Card types', () => {
  describe('Card', () => {
    it('should have correct structure', () => {
      const card: Card = {
        id: '1',
        question: 'Test question',
        answer: 'Test answer',
        isLearned: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('question');
      expect(card).toHaveProperty('answer');
      expect(card).toHaveProperty('isLearned');
      expect(card).toHaveProperty('createdAt');
      expect(card).toHaveProperty('updatedAt');
    });
  });

  describe('CreateCardRequest', () => {
    it('should have required fields', () => {
      const request: CreateCardRequest = {
        question: 'New question',
        answer: 'New answer',
      };

      expect(request).toHaveProperty('question');
      expect(request).toHaveProperty('answer');
    });
  });

  describe('UpdateCardRequest', () => {
    it('should allow partial updates', () => {
      const requestWithQuestion: UpdateCardRequest = {
        question: 'Updated question',
      };

      const requestWithAnswer: UpdateCardRequest = {
        answer: 'Updated answer',
      };

      const requestWithBoth: UpdateCardRequest = {
        question: 'Updated question',
        answer: 'Updated answer',
      };

      expect(requestWithQuestion).toHaveProperty('question');
      expect(requestWithAnswer).toHaveProperty('answer');
      expect(requestWithBoth).toHaveProperty('question');
      expect(requestWithBoth).toHaveProperty('answer');
    });
  });

  describe('GetCardsResponse', () => {
    it('should have paginated structure', () => {
      const response: GetCardsResponse = {
        content: [
          {
            id: '1',
            question: 'Q1',
            answer: 'A1',
            isLearned: false,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
        page: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
      };

      expect(response).toHaveProperty('content');
      expect(response).toHaveProperty('page');
      expect(response).toHaveProperty('size');
      expect(response).toHaveProperty('totalElements');
      expect(response).toHaveProperty('totalPages');
      expect(Array.isArray(response.content)).toBe(true);
    });
  });
});
