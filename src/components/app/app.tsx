import { FC, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Location,
  Navigate
} from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';

import {
  selectIsAuthenticated,
  selectIsAuthChecked
} from '../../services/selectors';

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

type LocationState = {
  background?: Location;
};

const AuthGate: FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  if (!isAuthChecked) {
    return null;
  }
  return <>{children}</>;
};

const OnlyUnauthRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) return null;

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const backgroundLocation = state?.background;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path='/login'
          element={
            <OnlyUnauthRoute>
              <Login />
            </OnlyUnauthRoute>
          }
        />
        <Route
          path='/register'
          element={
            <OnlyUnauthRoute>
              <Register />
            </OnlyUnauthRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <OnlyUnauthRoute>
              <ForgotPassword />
            </OnlyUnauthRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <OnlyUnauthRoute>
              <ResetPassword />
            </OnlyUnauthRoute>
          }
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

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => window.history.back()}
              >
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={() => window.history.back()}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={() => window.history.back()}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

const AppContent: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser()).catch(() => {});

    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AuthGate>
        <AppRoutes />
      </AuthGate>
    </div>
  );
};

const App: FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
