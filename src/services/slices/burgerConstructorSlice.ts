import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TIngredient } from '../../utils/types';

interface BurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  total: number;
}

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: [],
  total: 0
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        if (state.bun) {
          state.total -= state.bun.price * 2;
        }
        const bunWithUid: TConstructorIngredient = {
          ...ingredient,
          uid: ingredient._id,
          id: ingredient._id
        };
        state.bun = bunWithUid;
        state.total += ingredient.price * 2;
      } else {
        const ingredientWithUid: TConstructorIngredient = {
          ...ingredient,
          uid: Date.now().toString() + Math.random(),
          id: Date.now().toString() + Math.random()
        };
        state.ingredients.push(ingredientWithUid);
        state.total += ingredient.price;
      }
    },

    addBun: (state, action: PayloadAction<TIngredient>) => {
      const bun = action.payload;
      if (state.bun) {
        state.total -= state.bun.price * 2;
      }
      const bunWithUid: TConstructorIngredient = {
        ...bun,
        uid: bun._id,
        id: bun._id
      };
      state.bun = bunWithUid;
      state.total += bun.price * 2;
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      const index = state.ingredients.findIndex(
        (item) => item.uid === uid || item.id === uid
      );
      if (index !== -1) {
        state.total -= state.ingredients[index].price;
        state.ingredients.splice(index, 1);
      }
    },

    reorderIngredients: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },

    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      const index = state.ingredients.findIndex(
        (item) => item.uid === uid || item.id === uid
      );
      if (index > 0) {
        const [movedItem] = state.ingredients.splice(index, 1);
        state.ingredients.splice(index - 1, 0, movedItem);
      }
    },

    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      const index = state.ingredients.findIndex(
        (item) => item.uid === uid || item.id === uid
      );
      if (index !== -1 && index < state.ingredients.length - 1) {
        const [movedItem] = state.ingredients.splice(index, 1);
        state.ingredients.splice(index + 1, 0, movedItem);
      }
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.total = 0;
    }
  }
});

export const {
  addIngredient,
  addBun,
  removeIngredient,
  reorderIngredients,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
