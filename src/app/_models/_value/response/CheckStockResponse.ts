import {Quantity} from '../product/Quantity';

export class CheckStockResponse {
  success: boolean;
  stock: Quantity;
}
