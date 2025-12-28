export type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: 'done' | 'pending' | 'created';
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export type TSelectedIngredients = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
};
