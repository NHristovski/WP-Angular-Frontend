import {Category} from '../../category';
import {ProductId} from './ProductId';
import {ImageLocation} from './ImageLocation';
import {ProductInformation} from './ProductInformation';
import {Price} from './Price';
import {RatingStatistics} from './RatingStatistics';
import {Quantity} from './Quantity';

export class SimpleProduct {
  productId: ProductId;
  version: number;
  imageLocation: ImageLocation;
  information: ProductInformation;
  createdOn: string;
  price: Price;
  ratingStatistics: RatingStatistics;
  stock: Quantity;
  categories: Category[];
}
