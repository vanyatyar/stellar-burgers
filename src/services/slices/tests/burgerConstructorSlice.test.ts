import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  reorderIngredients,
  clearConstructor
} from '../burgerConstructorSlice';
import type { TIngredient } from '../../../utils/types';

describe('burgerConstructorSlice', () => {
  const mockBun: TIngredient = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://example.com/bun.png',
    image_mobile: 'https://example.com/bun-mobile.png',
    image_large: 'https://example.com/bun-large.png'
  };

  const mockMain: TIngredient = {
    _id: 'main-1',
    name: 'Филе Люминесцентного тетраодона',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://example.com/meat.png',
    image_mobile: 'https://example.com/meat-mobile.png',
    image_large: 'https://example.com/meat-large.png'
  };

  const mockSauce: TIngredient = {
    _id: 'sauce-1',
    name: 'Соус Фалленианского плотоядного растения',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 426,
    price: 643,
    image: 'https://example.com/sauce.png',
    image_mobile: 'https://example.com/sauce-mobile.png',
    image_large: 'https://example.com/sauce-large.png'
  };

  const initialState = {
    bun: null,
    ingredients: [],
    total: 0
  };

  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const state = burgerConstructorReducer(initialState, addIngredient(mockBun));

      expect(state.bun).toMatchObject(mockBun);
      expect(state.bun?.uid).toBe('bun-1');
      expect(state.bun?.id).toBe('bun-1');
      expect(state.total).toBe(mockBun.price * 2);
    });

    it('должен заменить булку на новую', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockBun));

      const newBun: TIngredient = { ...mockBun, _id: 'bun-2', price: 1000 };

      state = burgerConstructorReducer(state, addIngredient(newBun));

      expect(state.bun).toMatchObject(newBun);
      expect(state.bun?.uid).toBe('bun-2');
      expect(state.total).toBe(newBun.price * 2);
    });

    it('должен добавить начинку в конструктор', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockBun));

      state = burgerConstructorReducer(state, addIngredient(mockMain));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('main-1');
      expect(state.ingredients[0]).toMatchObject(mockMain);
      expect(state.total).toBe(mockBun.price * 2 + mockMain.price);
    });

    it('должен добавить несколько ингредиентов', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockBun));

      state = burgerConstructorReducer(state, addIngredient(mockMain));

      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(2);
      expect(state.total).toBe(mockBun.price * 2 + mockMain.price + mockSauce.price);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент из конструктора', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockBun));

      state = burgerConstructorReducer(state, addIngredient(mockMain));

      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      const uidToRemove = state.ingredients[0].uid;
      state = burgerConstructorReducer(state, removeIngredient(uidToRemove));

      expect(state.ingredients).toHaveLength(1);
      expect(state.total).toBe(mockBun.price * 2 + mockSauce.price);
    });
  });

  describe('reorderIngredients', () => {
    it('должен изменить порядок ингредиентов', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockBun));

      state = burgerConstructorReducer(state, addIngredient(mockMain));

      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      const firstUid = state.ingredients[0].uid;
      const secondUid = state.ingredients[1].uid;

      state = burgerConstructorReducer(
        state,
        reorderIngredients({ fromIndex: 0, toIndex: 1 })
      );

      expect(state.ingredients[0].uid).toBe(secondUid);
      expect(state.ingredients[1].uid).toBe(firstUid);
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockBun));

      state = burgerConstructorReducer(state, addIngredient(mockMain));

      state = burgerConstructorReducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
      expect(state.total).toBe(0);
    });
  });
});