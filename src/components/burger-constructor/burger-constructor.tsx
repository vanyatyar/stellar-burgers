import { FC, useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { createOrder, resetOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';
import {
  selectConstructorItems,
  selectOrderData,
  selectOrderLoading,
  selectIsAuthenticated
} from '../../services/selectors';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectConstructorItems);
  const orderModalData = useSelector(selectOrderData);
  const orderRequest = useSelector(selectOrderLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const onOrderClick = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  }, [isAuthenticated, constructorItems, orderRequest, navigate, dispatch]);

  const closeOrderModal = useCallback(() => {
    dispatch(resetOrder());
    dispatch(clearConstructor());
  }, [dispatch]);

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (total: number, ingredient: TConstructorIngredient) =>
        total + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems.bun, constructorItems.ingredients]);

  return (
    <div data-testid='burger-constructor'>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
    </div>
  );
});

BurgerConstructor.displayName = 'BurgerConstructor';
