import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import {
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectIsAuthenticated
} from '../../services/selectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch, isAuthenticated]);

  if (isLoading) {
    return <div>Загрузка заказов...</div>;
  }

  if (!isAuthenticated) {
    return <div>Пожалуйста, войдите в систему</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
