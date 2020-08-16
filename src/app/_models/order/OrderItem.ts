import {OrderItemId} from '../_value/order/OrderItemId';
import {ProductId} from '../_value/product/ProductId';
import {Price} from '../_value/product/Price';
import {Quantity} from '../_value/product/Quantity';
import {Name} from '../_value/Name';

export class OrderItem {
  orderItemId: OrderItemId;
  version: number;
  productId: ProductId;
  price: Price;
  quantity: Quantity;
  productName: Name;
}
