import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Базовые селекторы
export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

// Мемоизированные селекторы для burger constructor
export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;

export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

// Исправленный селектор selectConstructorItems
export const selectConstructorItems = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => ({
    bun,
    ingredients
  })
);

// Остальные селекторы
export const selectOrderData = (state: RootState) => state.order.orderData;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export const selectProfileOrdersLoading = (state: RootState) =>
  state.profileOrders.isLoading;

export const selectIngredientDetails = (state: RootState) =>
  state.ingredientDetails.ingredientData;
