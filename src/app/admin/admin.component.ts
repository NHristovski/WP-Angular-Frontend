import {Component, OnInit} from '@angular/core';
import {AdminService} from '../_services/admin.service';
import {CategoryService} from '../_services/category.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AddProductComponent} from '../add-product/add-product.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {AlertService} from '../_services';
import {Product} from '../_models/product';
import {RestockDialogComponent} from '../restock-dialog/restock-dialog.component';
import {ToolbarStateService} from '../_services/toolbar-state.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  categories: any = [];
  categoryForm: FormGroup;
  submitted = false;
  submittedSearch = false;
  searchForm: FormGroup;
  products: any;
  displayedColumns = ['product', 'id', 'name', 'createdOn', 'stock', 'action'];
  onceSubmited = false;
  hasProducts = false;

  constructor(private adminService: AdminService,
              private categoryService: CategoryService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private alertService: AlertService,
              private toolbarStateService: ToolbarStateService) {
  }


  get getFormControls() {
    return this.categoryForm.controls;
  }

  get getSearchFormControls() {
    return this.searchForm.controls;
  }


  ngOnInit(): void {
    this.toolbarStateService.changeCurrentlyActive(3);

    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data.categories;
    }, error => {
      this.alertService.openSnackBar('Failed to get the categories!', true);
    });

    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      term: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log('in on submit');

    if (this.categoryForm.invalid) {
      console.error('invalid form');
      return;
    }

    this.addCategory(this.categoryForm.controls.name.value);
    this.submitted = false;
    this.categoryForm.reset();
  }

  onSearchSubmit() {
    this.submittedSearch = true;

    if (this.searchForm.invalid) {
      console.error('invalid form');
      return;
    }

    this.adminService.search(this.searchForm.controls.term.value).subscribe(data => {
      console.log('found data', data);
      this.products = data.products;
      this.onceSubmited = true;
      this.hasProducts = this.products.length !== 0;
    }, error1 => {
      this.alertService.openSnackBar('Search failed!', true);
      this.hasProducts = false;
    });

    this.submittedSearch = false;
    this.searchForm.reset();
  }


  deleteCategory(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deleteCategory(id).subscribe(data => {
          this.categories = this.categories.filter(cate => cate.categoryId.id !== id);
          this.alertService.openSnackBar('Category deleted successfully', false);
        }, error => {
          this.alertService.openSnackBar('Failed to deleteProduct the category!', true);
        });
      }
    });
  }

  addCategory(name: string) {
    this.adminService.addCategory(name).subscribe(data => {
      console.log('add category subscribe data', data);
      this.categories.push(data.category);
      this.alertService.openSnackBar('Category added successfully', false);
    }, error => {
      this.alertService.openSnackBar('Failed to add the category! Check if category already exists', true);
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '1200px',
      height: '700px'
    });

    dialogRef.componentInstance.categories = this.categories;
    dialogRef.componentInstance.imageLocation = {
      url: 'https://lunawood.com/wp-content/uploads/2018/02/placeholder-image.png'
    };
    dialogRef.componentInstance.information = {
      title: '',
      shortDescription: '',
      longDescription: ''
    };
    dialogRef.componentInstance.price = {
      amount: null,
      currency: 'MKD'
    };
    dialogRef.componentInstance.stock = {
      quantity: 0
    };

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  edit(item: Product) {

    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '1200px',
      height: '730px'
    });


    dialogRef.componentInstance.categories = this.categories;

    dialogRef.componentInstance.id = item.productId;
    dialogRef.componentInstance.version = item.version;
    dialogRef.componentInstance.imageLocation = item.imageLocation;
    dialogRef.componentInstance.information = item.information;
    dialogRef.componentInstance.createdOn = item.createdOn;
    dialogRef.componentInstance.price = item.price;
    dialogRef.componentInstance.stock = item.stock;

    dialogRef.componentInstance.productCategories = item.categories.map(cat => cat.categoryName.name);

    dialogRef.componentInstance.edit = true;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const newProduct = dialogRef.componentInstance.newProduct;

        console.log('new Product', newProduct);

        const index = this.products.findIndex(p => p.productId.id === newProduct.productId.id);

        if (index > -1) {
          this.products[index].version = newProduct.version;
          this.products[index].imageLocation = newProduct.imageLocation;
          this.products[index].information = newProduct.information;
          this.products[index].createdOn = newProduct.createdOn;
          this.products[index].price = newProduct.price;
          this.products[index].ratingStatistics = newProduct.ratingStatistics;
          this.products[index].categories = newProduct.categories;
          this.products[index].stock = dialogRef.componentInstance.stock;
        }
      } else {
        const index = this.products.findIndex(p => p.productId.id === item.productId.id);
        if (index > -1) {
          this.products[index].stock = dialogRef.componentInstance.stock;
        }
      }
    });
  }

  refresh(item: any) {
    this.adminService.refresh(item.productId.id)
      .subscribe(data => {
        const index = this.products.findIndex(p => p.productId.id === item.productId.id);
        if (index > -1) {
          this.products[index].createdOn = data.product.createdOn;
        }
        this.alertService.openSnackBar('Product timestamp refreshed successfully', false);
      }, error => {
        this.alertService.openSnackBar(`Failed to refresh the timestamp for product ${item.productId.id}!`, true);
      });
  }

  editStock(item: any) {

    const dialogRef = this.dialog.open(RestockDialogComponent, {
      width: '300px',
      height: '240px'
    });


    dialogRef.componentInstance.productId = item.productId;
    dialogRef.componentInstance.oldStock = item.stock;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const newStock = dialogRef.componentInstance.newStock;

        console.log('new Stock', newStock);

        const index = this.products.findIndex(p => p.productId.id === item.productId.id);

        if (index > -1) {
          this.products[index].stock = newStock;
        }
      }
    });
  }

  deleteProduct(item: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.adminService.deleteProduct(item.productId.id)
            .subscribe(data => {
                this.products = this.products.filter(p => p.productId.id !== item.productId.id);
                this.alertService.openSnackBar('Product deleted successfully', false);
              }
              , error => {
                this.alertService.openSnackBar(`Failed to delete the product ${item.productId.id}!`, true);
              });
        }
      }
    );
  }
}


