import {ShoppingCartId} from '../_value/shoppingCart/ShoppingCartId';
import {Price} from '../_value/product/Price';

export class BuyRequest {
  deliveryAddress: string;
  phone: string;
  creditCard: string;
  cardHolderName: string;
  expiryDate: string;
  ccv: string;
  shoppingCartId: ShoppingCartId;
  price: Price;
}
