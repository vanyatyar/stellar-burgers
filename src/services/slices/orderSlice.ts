import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

interface OrderState {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderData: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при создании заказа');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка при создании заказа';
      });
  }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
