import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface BurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = {
        ...action.payload,
        id: uuidv4()
      };
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients.push({
        ...action.payload,
        id: uuidv4()
      });
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      if (action.payload > 0) {
        [
          state.ingredients[action.payload],
          state.ingredients[action.payload - 1]
        ] = [
          state.ingredients[action.payload - 1],
          state.ingredients[action.payload]
        ];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      if (action.payload < state.ingredients.length - 1) {
        [
          state.ingredients[action.payload],
          state.ingredients[action.payload + 1]
        ] = [
          state.ingredients[action.payload + 1],
          state.ingredients[action.payload]
        ];
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
