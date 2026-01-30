import feedReducer, { fetchOrders } from '../feedSlice';
import type { TOrder } from '../../../utils/types';

describe('feedSlice', () => {
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
    total: 0,
    totalToday: 0,
    error: ''
  };

  describe('fetchOrders async thunk', () => {
    it('должен установить isLoading=true при начале запроса', () => {
      const action = {
        type: fetchOrders.pending.type
      };

      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe('');
    });

    it('должен сохранить заказы при успешном получении', () => {
      const feedData = {
        orders: [mockOrder],
        total: 100,
        totalToday: 10
      };

      const action = {
        type: fetchOrders.fulfilled.type,
        payload: feedData
      };

      const state = feedReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(feedData.orders);
      expect(state.total).toBe(feedData.total);
      expect(state.totalToday).toBe(feedData.totalToday);
      expect(state.error).toBe('');
    });

    it('должен сохранить ошибку при неудачном запросе', () => {
      const errorMessage = 'Network error';

      const action = {
        type: fetchOrders.rejected.type,
        payload: errorMessage
      };

      const state = feedReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([]); 
      expect(state.error).toBe(errorMessage);
    });
  });
});
