import {Category} from './category';
import {ProductId} from './_value/product/ProductId';
import {ImageLocation} from './_value/product/ImageLocation';
import {ProductInformation} from './_value/product/ProductInformation';
import {Price} from './_value/product/Price';
import {RatingStatistics} from './_value/product/RatingStatistics';
import {Quantity} from './_value/product/Quantity';

export class Product {
  productId: ProductId;
  version: number;
  imageLocation: ImageLocation;
  information: ProductInformation;
  createdOn: string;
  price: Price;
  ratingStatistics: RatingStatistics;
  currentUserRating: number;
  stock: Quantity;
  categories: Category[];
}
