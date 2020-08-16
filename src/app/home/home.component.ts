import {Component, OnInit} from '@angular/core';
import {AlertService, AuthenticationService, UserService} from '../_services';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkerService} from '../_services/worker.service';
import {ProductService} from '../_services/product.service';
import {CategoryService} from '../_services/category.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Product} from '../_models/product';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  response: any;
  products: Product[] = [];
  maxPages: number;
  size: number;
  currentPage: number;
  categories: any = [];
  submitted = false;
  renderForm: FormGroup;
  screen: any;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private workerService: WorkerService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {

    this.screen = screen;

    this.currentPage = 1;
    this.maxPages = 1;
    this.size = 9;

    this.getAllCategories();

    const categoryName = this.route.snapshot.queryParams['categoryId'] || '';

    if (categoryName) {
      this.getAllProductsForCategory(categoryName);
    } else {
      this.getAllProducts();
    }

    this.renderForm = this.formBuilder.group({
      render: ['', Validators.compose([Validators.required, Validators.min(1)])]
    });

  }

  get getFormControls() {
    return this.renderForm.controls;
  }

  logout() {
    this.authenticationService.logout();
    this.alertService.openSnackBar(`Logout successful`, false);
    this.router.navigate(['/login']);
  }

  message() {
    this.workerService.getMessage();
  }

  getAllProducts() {
    this.productService.getAllProducts(this.currentPage - 1, this.size)
      .subscribe(data => {
        this.response = data;
        this.products = this.response.personalizedProducts;
        console.log('the products are', this.products);
        this.maxPages = this.response.maxPages;
      }, error => {
        this.alertService.openSnackBar(`Failed to get the products`, true);
      });
  }

  getAllProductsForCategory(categoryId: string) {
    if (categoryId === 'top_products') {
      this.findTopRatedProducts();
    } else {
      this.productService.getAllProductsForCategory(this.currentPage - 1, this.size, categoryId)
        .subscribe(data => {
          this.response = data;
          this.products = this.response.personalizedProducts;
          this.maxPages = this.response.maxPages;
        }, error => {
          this.alertService.openSnackBar(`Failed to get the products for the category ${categoryId}`, true);
        });
    }
  }

  private findTopRatedProducts() {
    this.productService.getTopRatedProducts(this.currentPage - 1, this.size)
      .subscribe(data => {
        this.response = data;
        this.products = this.response.personalizedProducts;
        this.maxPages = this.response.maxPages;
      }, error => {
        this.alertService.openSnackBar(`Failed to get the products for the category Top Rated Products`, true);
      });
  }

  getAllCategories() {
    this.categoryService.getAllCategories()
      .subscribe(data => {
        this.categories = data.categories;
        console.log('this.categories', this.categories);
      }, error => {
        this.alertService.openSnackBar('Failed to get the product categories', true);
      });
  }

  previous() {
    this.currentPage = this.currentPage - 1;
    const categoryName = this.route.snapshot.queryParams['categoryId'] || '';
    if (categoryName) {
      this.getAllProductsForCategory(categoryName);
    } else {
      this.getAllProducts();
    }
  }

  next() {
    this.currentPage = this.currentPage + 1;
    const categoryName = this.route.snapshot.queryParams['categoryId'] || '';
    if (categoryName) {
      this.getAllProductsForCategory(categoryName);
    } else {
      this.getAllProducts();
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.renderForm.invalid) {
      console.error('invalid form');
      return;
    }
    this.size = this.getFormControls.render.value;
    this.submitted = false;

    const categoryId = this.route.snapshot.queryParams['categoryId'] || '';
    if (categoryId) {
      this.getAllProductsForCategory(categoryId);
    } else {
      this.getAllProducts();
    }
  }
}
