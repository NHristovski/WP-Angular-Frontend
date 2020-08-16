import {Component, OnInit} from '@angular/core';
import {Product} from '../_models/product';
import {ProductService} from '../_services/product.service';
import {Router} from '@angular/router';
import {AlertService} from '../_services';
import {RatingStatistics} from '../_models/_value/product/RatingStatistics';
import {InventoryService} from '../_services/inventory.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  quantity: number;

  initialRatingStatistics: RatingStatistics;
  initialUserRating: number;

  constructor(private productService: ProductService,
              private router: Router,
              private alertService: AlertService,
              private dialogRef: MatDialogRef<ProductDetailsComponent>,
              private inventoryService: InventoryService) {
  }

  ngOnInit() {
    this.quantity = 1;
    this.initialRatingStatistics = this.product.ratingStatistics;
    this.initialUserRating = this.product.currentUserRating;
  }

  ratingClicked() {
    setTimeout(() => this.productService.rateProduct(this.product.productId.id, this.product.currentUserRating)
      .subscribe(data => {
        if (this.initialUserRating === 0) {
          // new rating added
          this.product.ratingStatistics = {
            totalRatings: this.initialRatingStatistics.totalRatings + 1,
            averageRating: (
                (this.initialRatingStatistics.totalRatings * this.initialRatingStatistics.averageRating) +
                this.product.currentUserRating
              )
              / (this.initialRatingStatistics.totalRatings + 1)
          };
        } else {
          // rating changed
          this.product.ratingStatistics = {
            totalRatings: this.initialRatingStatistics.totalRatings,
            averageRating: (
              (this.initialRatingStatistics.totalRatings * this.initialRatingStatistics.averageRating)
              + this.product.currentUserRating - this.initialUserRating) / (this.initialRatingStatistics.totalRatings)
          };
        }
      }, error => {
        this.alertService.openSnackBar(`Failed to rate the product`, true);
      }), 200);
  }

  openHome(categoryName: string) {
    this.router.navigate(['/'], {queryParams: {categoryName}});
  }

  addToCartClicked() {
    if (this.quantity <= 0) {
      this.alertService.openSnackBar(`Quantity must be a positive number`, true);
      return;
    }
    if (this.quantity > this.product.stock.quantity) {
      this.alertService.openSnackBar(`The quantity cannot exceed the quantity of the product in the inventory`, true);
      return;
    }

    this.inventoryService.verifyStock(this.product.productId, this.quantity, this.product.price, this.product.information.title)
      .subscribe(data => {
        this.product.stock = data.stock;
        if (data.success) {
          this.dialogRef.close(true);
          this.alertService.openSnackBar(`Product added to the shopping cart`, false);
        } else {
          this.alertService.openSnackBar(`The maximum products you can buy is ${data.stock.quantity}`, true);
        }
      }, error => {
        this.alertService.openSnackBar(`Failed to add the product to the shopping cart.`, true);
      });
  }
}
