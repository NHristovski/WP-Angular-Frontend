import {ShoppingCartItem} from './shoppingCartItem';
import {ShoppingCartId} from '../_value/shoppingCart/ShoppingCartId';

export class ShoppingCart {
  version: number;
  shoppingCartId: ShoppingCartId;
  shoppingCartItems: ShoppingCartItem[];
}
