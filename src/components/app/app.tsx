import { FC, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { AppHeader } from '../../components/app-header';
import { ProtectedRoute } from '../../components/protected-route';
import { ConstructorPage } from '../../pages/constructor-page';
import { Feed } from '../../pages/feed';
import { Login } from '../../pages/login';
import { Register } from '../../pages/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404';
import { IngredientDetails } from '../../components/ingredient-details';
import { OrderInfo } from '../../components/order-info';
import { Modal } from '../../components/modal';
import styles from './app.module.css';

const App: FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, ingredientsLoaded } = useSelector((state) => ({
    isAuthenticated: state.user.isAuthenticated,
    ingredientsLoaded: state.ingredients.items.length > 0
  }));

  const handleModalClose = useCallback(() => window.history.back(), []);

  useEffect(() => {
    dispatch(getUser()).catch(() => {});

    // Загружаем ингредиенты только если они еще не загружены
    if (!ingredientsLoaded) {
      dispatch(fetchIngredients());
    }

    // Ленту заказов обновляем всегда
    dispatch(fetchFeeds());
  }, [dispatch, ingredientsLoaded]);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/login'
            element={isAuthenticated ? <ConstructorPage /> : <Login />}
          />
          <Route
            path='/register'
            element={isAuthenticated ? <ConstructorPage /> : <Register />}
          />
          <Route
            path='/forgot-password'
            element={isAuthenticated ? <ConstructorPage /> : <ForgotPassword />}
          />
          <Route
            path='/reset-password'
            element={isAuthenticated ? <ConstructorPage /> : <ResetPassword />}
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Информация об ингредиенте'
                onClose={handleModalClose}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
