import orderReducer, { createOrder } from '../orderSlice';
import type { TOrder } from '../../../utils/types';

describe('orderSlice', () => {
  const mockOrder: TOrder = {
    _id: '123',
    ingredients: ['id1', 'id2'],
    status: 'done',
    number: 12345,
    createdAt: '2024-01-29T00:00:00.000Z',
    updatedAt: '2024-01-29T00:00:00.000Z',
    name: 'Тестовый бургер'
  };

  const initialState = {
    isLoading: false,
    data: null,
    error: ''
  };

  describe('createOrder async thunk', () => {
    it('должен установить isLoading=true при начале создания заказа', () => {
      const action = {
        type: createOrder.pending.type
      };

      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe('');
      expect(state.data).toBeNull();
    });

    it('должен сохранить заказ при успешном создании', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };

      const state = orderReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockOrder);
      expect(state.error).toBe('');
    });

    it('должен сохранить ошибку при неудачном создании заказа', () => {
      const errorMessage = 'Failed to create order';

      const action = {
        type: createOrder.rejected.type,
        payload: errorMessage
      };

      const state = orderReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toBeNull();
      expect(state.error).toBe(errorMessage);
    });
  });
});
