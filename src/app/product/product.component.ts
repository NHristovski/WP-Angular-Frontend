import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../_models/product';
import {ProductService} from '../_services/product.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductDetailsComponent} from '../product-details/product-details.component';
import {ShoppingCartService} from '../_services/shopping-cart.service';
import {AlertService} from '../_services';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product;
  @Input() currentRate;

  initialRatingStatistics: any;
  initialUserRating: any;

  constructor(private productService: ProductService,
              private shoppingCardService: ShoppingCartService,
              private alertService: AlertService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initialRatingStatistics = this.product.ratingStatistics;
    this.initialUserRating = this.product.currentUserRating;
  }

  ratingClicked() {
    setTimeout(() => this.productService.rateProduct(this.product.productId.id, this.currentRate)
      .subscribe(data => {
        this.product.currentUserRating = this.currentRate;

        if (this.initialUserRating === 0) {
          // new rating added
          this.adjustRatingStatisticsForNewRating();
        } else {
          // rating changed
          this.adjustRatingStatisticsForChangedRating();
        }
      }, error => {
        this.alertService.openSnackBar(`Failed to rate the product`, true);
      }), 200);
  }

  private adjustRatingStatisticsForChangedRating() {
    this.product.ratingStatistics = {
      totalRatings: this.initialRatingStatistics.totalRatings,
      averageRating: (
        (this.initialRatingStatistics.totalRatings * this.initialRatingStatistics.averageRating)
        + this.currentRate - this.initialUserRating) / (this.initialRatingStatistics.totalRatings)
    };
  }

  private adjustRatingStatisticsForNewRating() {
    this.product.ratingStatistics = {
      totalRatings: this.initialRatingStatistics.totalRatings + 1,
      averageRating: (
          (this.initialRatingStatistics.totalRatings * this.initialRatingStatistics.averageRating) + this.currentRate
        )
        / (this.initialRatingStatistics.totalRatings + 1)
    };
  }

  openDialog(productRef: Product) {
    const dialogRef = this.dialog.open(ProductDetailsComponent);
    dialogRef.componentInstance.product = productRef;

    dialogRef.afterClosed().subscribe(result => {
      this.product = dialogRef.componentInstance.product;
    });
  }
}
