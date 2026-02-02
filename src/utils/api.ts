const BASE_URL = 'https://norma.nomoreparties.space/api';

const checkResponse = <T>(res: Response): Promise<T> => {
  console.log('API Response:', res.status, res.url);

  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return res.text().then((text) => {
      console.error('API returned non-JSON:', text.substring(0, 200));
      throw new Error(`API returned ${res.status}: ${text.substring(0, 100)}`);
    });
  }

  if (res.ok) {
    return res.json();
  }

  return res.json().then((err) => {
    throw new Error(err.message || `Ошибка ${res.status}`);
  });
};

const request = <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  console.log('API Request:', `${BASE_URL}${endpoint}`);
  return fetch(`${BASE_URL}${endpoint}`, options)
    .then(checkResponse<T>)
    .catch((error) => {
      console.error('API Request failed:', error);
      throw error;
    });
};
