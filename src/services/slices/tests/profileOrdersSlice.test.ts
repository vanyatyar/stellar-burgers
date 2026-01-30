import profileOrdersReducer, {
  fetchProfileOrders
} from '../profileOrdersSlice';
import type { TOrder } from '../../../utils/types';

describe('profileOrdersSlice', () => {
  const mockOrder: TOrder = {
    _id: '123',
    ingredients: ['id1', 'id2'],
    status: 'done',
    number: 12345,
    createdAt: '2024-01-29T00:00:00.000Z',
    updatedAt: '2024-01-29T00:00:00.000Z',
    name: 'Бургер'
  };

  const initialState = {
    isLoading: false,
    orders: [],
    error: ''
  };

  describe('fetchProfileOrders async thunk', () => {
    it('должен установить isLoading=true при начале запроса', () => {
      const action = {
        type: fetchProfileOrders.pending.type
      };

      const state = profileOrdersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe('');
    });

    it('должен сохранить заказы пользователя при успехе', () => {
      const orders = [mockOrder];

      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: orders
      };

      const state = profileOrdersReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(orders);
      expect(state.error).toBe('');
    });

    it('должен сохранить ошибку при неудачном запросе', () => {
      const errorMessage = 'Unauthorized';

      const action = {
        type: fetchProfileOrders.rejected.type,
        payload: errorMessage
      };

      const state = profileOrdersReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });
  });
});
