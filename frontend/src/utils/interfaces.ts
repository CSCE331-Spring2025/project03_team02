export interface IEmployee {
  id: string;
  name: string;
  is_manager: boolean;
  orders?: IOrderTable[]; // optional if not eagerly loaded
}

export interface IIngredient {
  id: string;
  name: string;
  quantity: number;
  supplier: string;
  expiration: string; // ISO Date string
}

export interface IOrderTable {
  id: string;
  employeeid: string;
  total: number;
  order_date: string; // ISO Date string
  product_orders?: IProductOrder[];
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  customizations?: string | null;
  has_boba: boolean;
  is_seasonal: boolean;
  ingredients: IIngredient[]
}

export interface IProductOrder {
  id: string;
  orderid: string;
  productid: string;
  quantity: number;
  product?: IProduct;
  order?: IOrderTable;
}

export interface IUser {
  id: string
  email: string
  email_verfied: boolean
  family_name: string
  given_name: string
  hd: string
  name: string
  picture: string
  sub: string
  is_manager: boolean
}