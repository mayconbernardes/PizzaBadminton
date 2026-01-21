
export type PizzaSize = 'quarter' | 'half' | 'full';

export type PizzaPrice = {
  quarter: string;
  half: string;
  full: string;
};

export interface PizzaItem {
  id: string;
  name: string;
  description: string;
  prices: PizzaPrice;
  isCreamBase?: boolean;
}

export interface SpecialtyItem {
  id: string;
  name: string;
  price: string;
  description: string;
  image?: string;
}

export interface MenuItem {
  name: string;
  includes: string[];
  price: string;
}

export interface CartItem {
  cartId: string;
  id: string;
  name: string;
  size?: PizzaSize;
  price: number;
  quantity: number;
}
