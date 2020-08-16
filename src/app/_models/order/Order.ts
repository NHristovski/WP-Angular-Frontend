import {OrderId} from '../_value/order/OrderId';
import {ApplicationUserId} from '../_value/user/ApplicationUserId';
import {Price} from '../_value/product/Price';
import {Address} from '../_value/Address';
import {OrderItem} from './OrderItem';

export class Order {
  version: number;
  orderId: OrderId;
  createdOn: string;
  status: string;
  userId: ApplicationUserId;
  price: Price;
  orderItems: OrderItem[];
  shippingAddress: Address;
}
