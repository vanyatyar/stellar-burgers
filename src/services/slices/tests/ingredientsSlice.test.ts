import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import type { TIngredient } from '../../../utils/types';

describe('ingredientsSlice', () => {
  const mockIngredient: TIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png'
  };

  const initialState = {
    isLoading: false,
    data: [],
    error: ''
  };

  describe('fetchIngredients async thunk', () => {
    it('должен установить isLoading=true при начале запроса', () => {
      const action = {
        type: fetchIngredients.pending.type
      };

      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe('');
      expect(state.data).toEqual([]);
    });

    it('должен сохранить ингредиенты и установить isLoading=false при успехе', () => {
      const ingredients = [mockIngredient];

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: ingredients
      };

      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(ingredients);
      expect(state.error).toBe('');
    });

    it('должен сохранить ошибку и установить isLoading=false при ошибке', () => {
      const errorMessage = 'Network error';

      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };

      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });
  });
});
