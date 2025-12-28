import { setCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';

const URL = 'https://norma.education-services.ru/api';

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

// Оптимизированная версия fetchWithRefresh
export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, options);
    const data = await checkResponse<T>(response);
    return data;
  } catch (err) {
    const error = err as { message: string };
    // Проверяем только конкретную ошибку токена
    if (error.message === 'jwt expired') {
      try {
        const refreshData = await refreshToken();
        const updatedHeaders = {
          ...options.headers,
          authorization: refreshData.accessToken
        };
        const newOptions = {
          ...options,
          headers: updatedHeaders
        };
        const response = await fetch(url, newOptions);
        return await checkResponse<T>(response);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const getOrdersApi = () => {
  const token = localStorage.getItem('accessToken');
  return fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: token || ''
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });
};

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

// Оптимизированная функция создания заказа
export const orderBurgerApi = (data: string[]) => {
  const token = localStorage.getItem('accessToken');
  return fetch(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: token || ''
    },
    body: JSON.stringify({ ingredients: data })
  })
    .then((res) => checkResponse<TNewOrderResponse>(res))
    .then((response) => {
      if (response?.success) return response;
      return Promise.reject(response);
    });
};

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        return data;
      }
      return Promise.reject(data);
    });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        return data;
      }
      return Promise.reject(data);
    });

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () => {
  const token = localStorage.getItem('accessToken');
  return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: token || ''
    } as HeadersInit
  });
};

export const updateUserApi = (user: Partial<TRegisterData>) => {
  const token = localStorage.getItem('accessToken');
  return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: token || ''
    } as HeadersInit,
    body: JSON.stringify(user)
  });
};
export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
