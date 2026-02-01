import store from '../../store';

describe('store initialization', () => {
  it('должен возвращать корректное начальное состояние хранилища', () => {
    const state = store.getState();

    expect(state).toBeDefined();
    expect(state.ingredients).toBeDefined();
    expect(state.burgerConstructor).toBeDefined();
    expect(state.order).toBeDefined();
    expect(state.feed).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.profileOrders).toBeDefined();
    expect(state.ingredientDetails).toBeDefined();

    expect(state.ingredients.data).toEqual([]);
    expect(state.burgerConstructor.bun).toBeNull();
    expect(state.burgerConstructor.ingredients).toEqual([]);
    expect(state.order.data).toBeNull();
    expect(state.feed.orders).toEqual([]);
    expect(state.user.user).toBeNull();
  });

  it('должен правильно обрабатывать неизвестный экшен', () => {
    const initialState = store.getState();

    store.dispatch({ type: 'UNKNOWN_ACTION' } as { type: string });
    const newState = store.getState();

    expect(newState).toEqual(initialState);
  });
});
