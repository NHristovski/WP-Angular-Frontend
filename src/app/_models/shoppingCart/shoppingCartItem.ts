import {ProductId} from '../_value/product/ProductId';
import {Price} from '../_value/product/Price';
import {Quantity} from '../_value/product/Quantity';
import {Name} from '../_value/Name';
import {ShoppingCartItemId} from '../_value/shoppingCart/ShoppingCartItemId';

export class ShoppingCartItem {
  shoppingCartItemId: ShoppingCartItemId;
  version: number;
  productId: ProductId;
  productName: Name;
  price: Price;
  quantity: Quantity;
}
