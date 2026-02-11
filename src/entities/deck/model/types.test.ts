import { describe, it, expect } from 'vitest';
import type { Deck, CreateDeckRequest, DeckDetails } from './types';

describe('Deck types', () => {
  describe('Deck', () => {
    it('should have correct structure', () => {
      const deck: Deck = {
        id: '1',
        name: 'Test Deck',
        description: 'Test description',
      };

      expect(deck).toHaveProperty('id');
      expect(deck).toHaveProperty('name');
      expect(deck).toHaveProperty('description');
    });
  });

  describe('CreateDeckRequest', () => {
    it('should have required name field', () => {
      const request: CreateDeckRequest = {
        name: 'New Deck',
      };

      expect(request).toHaveProperty('name');
      expect(request.name).toBe('New Deck');
    });

    it('should allow optional description', () => {
      const requestWithDescription: CreateDeckRequest = {
        name: 'New Deck',
        description: 'Deck description',
      };

      const requestWithoutDescription: CreateDeckRequest = {
        name: 'New Deck',
      };

      expect(requestWithDescription).toHaveProperty('description');
      expect(requestWithoutDescription).not.toHaveProperty('description');
    });
  });

  describe('DeckDetails', () => {
    it('should have complete structure', () => {
      const deckDetails: DeckDetails = {
        id: '1',
        name: 'Test Deck',
        description: 'Test description',
        cardCount: 10,
        learnedPercent: 50,
        lastStudied: '2024-01-01',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      expect(deckDetails).toHaveProperty('id');
      expect(deckDetails).toHaveProperty('name');
      expect(deckDetails).toHaveProperty('description');
      expect(deckDetails).toHaveProperty('cardCount');
      expect(deckDetails).toHaveProperty('learnedPercent');
      expect(deckDetails).toHaveProperty('lastStudied');
      expect(deckDetails).toHaveProperty('createdAt');
      expect(deckDetails).toHaveProperty('updatedAt');
    });

    it('should allow null description and lastStudied', () => {
      const deckDetails: DeckDetails = {
        id: '1',
        name: 'Test Deck',
        description: null,
        cardCount: 0,
        learnedPercent: 0,
        lastStudied: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      expect(deckDetails.description).toBeNull();
      expect(deckDetails.lastStudied).toBeNull();
    });
  });
});
