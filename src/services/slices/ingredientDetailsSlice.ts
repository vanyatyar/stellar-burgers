import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IngredientDetailsState {
  ingredientData: TIngredient | null;
}

const initialState: IngredientDetailsState = {
  ingredientData: null
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredientDetails: (state, action) => {
      state.ingredientData = action.payload;
    },
    clearIngredientDetails: (state) => {
      state.ingredientData = null;
    }
  }
});

export const { setIngredientDetails, clearIngredientDetails } =
  ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;
