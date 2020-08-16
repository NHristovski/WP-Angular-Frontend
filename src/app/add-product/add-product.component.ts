import {Component, OnInit} from '@angular/core';
import {ImageService} from '../_services/image.service';
import {ProductService} from '../_services/product.service';
import {AddProductRequest} from '../_models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CategoryService} from '../_services/category.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AlertService} from '../_services';
import {ProductId} from '../_models/_value/product/ProductId';
import {ImageLocation} from '../_models/_value/product/ImageLocation';
import {ProductInformation} from '../_models/_value/product/ProductInformation';
import {Price} from '../_models/_value/product/Price';
import {EditProductRequest} from '../_models/message/request/EditProductRequest';
import {Quantity} from '../_models/_value/product/Quantity';
import {RestockDialogComponent} from '../restock-dialog/restock-dialog.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup;
  loading = false;
  submitted = false;
  imageFile: File;
  imageURL: string | ArrayBuffer;
  categories: any = [];
  newProduct: any;
  currencies = ['MKD', 'USD', 'EUR'];

  id: ProductId;
  version: number;
  imageLocation: ImageLocation;
  information: ProductInformation;
  createdOn: string;
  price: Price;
  productCategories: string[];
  stock: Quantity;
  edit: boolean;

  shouldEditStock = false;

  // convenience getter for easy access to form fields
  get getFormControls() {
    return this.productForm.controls;
  }

  ngOnInit() {

    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data.categories;
    }, error1 => {
      this.alertService.openSnackBar(`Failed to get the categories!`, true);
    });

    this.productForm = this.formBuilder.group({
      title: [this.information.title, Validators.required],
      shortDescription: [this.information.shortDescription, Validators.required],
      longDescription: [this.information.longDescription, Validators.required],
      categories: [this.productCategories, Validators.required],
      amount: [this.price.amount, Validators.required],
      currency: [this.price.currency, Validators.required],
      stock: [{value: this.stock.quantity, disabled: this.edit}]
    });
  }

  onSubmit() {

    this.submitted = true;

    if (this.productForm.invalid || (!this.imageFile && !this.imageLocation.url)) {
      this.alertService.openSnackBar('Invalid form!', true);
      return;
    }

    this.loading = true;

    if (this.edit) {
      this.editProduct();
    } else {
      this.addProduct();
    }
  }

  constructor(private imageService: ImageService,
              private productService: ProductService,
              private formBuilder: FormBuilder,
              private router: Router,
              private categoryService: CategoryService,
              private dialogRef: MatDialogRef<AddProductComponent>,
              public dialog: MatDialog,
              private alertService: AlertService) {

  }

  formatDate(date: string) {
    let tempDate = date.replace('T', ' ');
    tempDate = tempDate.replace('Z', '');
    return tempDate;
  }

  imageInputChange(imageInput: any) {
    this.imageFile = imageInput.files[0];
    this.preview(this.imageFile);
  }

  preview(file) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.imageURL = reader.result;
    };
  }

  addProduct() {
    if (this.imageFile) {
      this.imageService.uploadImage(this.imageFile)
        .subscribe(
          data => {
            // let addProductRequest: AddProductRequest;
            this.sendRequestToAddProduct(data.data.link);
          },
          error2 => {
            this.alertService.openSnackBar('Failed to upload the image!', true);
            this.dialogRef.close(false);
          });
    } else {
      this.sendRequestToAddProduct(this.imageLocation.url);
    }
  }

  private sendRequestToAddProduct(url: string) {
    const addProductRequest: AddProductRequest = {
      product: {
        createdOn: null,
        imageLocation: {
          url
        },
        information: {
          title: this.getFormControls.title.value,
          shortDescription: this.getFormControls.shortDescription.value,
          longDescription: this.getFormControls.longDescription.value
        },
        price: {
          amount: this.getFormControls.amount.value,
          currency: this.getFormControls.currency.value
        },
        productId: this.id,
        ratingStatistics: null,
        version: this.version,
        categories: this.getFormControls.categories.value.map(catName => {
          return this.categories.filter(ct => ct.categoryName.name === catName)[0];
        }),
        stock: this.getFormControls.stock.value
      }
    };

    console.log('addProductRequest', addProductRequest);

    this.productService.addProduct(addProductRequest)
      .subscribe(productData => {
        console.log('new product added', productData.product);
        this.loading = false;
        this.alertService.openSnackBar('Product added successfully', false);
        this.dialogRef.close(true);
      }, error1 => {
        this.alertService.openSnackBar('Failed to add product', true);
        this.dialogRef.close(false);
      });
  }

  private editProduct() {
    // if imageUrl is not null then change it
    console.log('edit Product clicked');
    if (this.imageFile) {
      this.imageService.uploadImage(this.imageFile)
        .subscribe(
          data => {
            const request: EditProductRequest = {
              product: {
                createdOn: null,
                imageLocation: {
                  url: data.data.link
                },
                information: {
                  title: this.getFormControls.title.value,
                  shortDescription: this.getFormControls.shortDescription.value,
                  longDescription: this.getFormControls.longDescription.value
                },
                price: {
                  amount: this.getFormControls.amount.value,
                  currency: this.getFormControls.currency.value
                },
                productId: this.id,
                ratingStatistics: null,
                version: this.version,
                categories: this.getFormControls.categories.value.map(catName => {
                  return this.categories.filter(ct => ct.categoryName.name === catName)[0];
                }),
                stock: null
              }
            };

            console.log('editProductRequest', request);

            this.productService.editProduct(request, this.id.id)
              .subscribe(editResponse => {
                this.loading = false;
                this.newProduct = editResponse.product;
                this.alertService.openSnackBar('Product added successfully', false);
                console.log('new product after edit service', this.newProduct);
                this.dialogRef.close(true);
              }, error11 => {
                this.alertService.openSnackBar('Failed to add the product', true);
                this.dialogRef.close(false);
              });
          },
          error12 => {
            this.alertService.openSnackBar('Failed to upload the image!', true);
            this.dialogRef.close(false);
          });
    } else {
      const editProductRequest: EditProductRequest = {
        product: {
          createdOn: null,
          imageLocation: this.imageLocation,
          information: {
            title: this.getFormControls.title.value,
            shortDescription: this.getFormControls.shortDescription.value,
            longDescription: this.getFormControls.longDescription.value
          },
          price: {
            amount: this.getFormControls.amount.value,
            currency: this.getFormControls.currency.value
          },
          productId: this.id,
          ratingStatistics: null,
          version: this.version,
          categories: this.getFormControls.categories.value.map(catName => {
            return this.categories.filter(ct => ct.categoryName.name === catName)[0];
          }),
          stock: null
        }
      };

      console.log('editProductRequest', editProductRequest);
      this.productService.editProduct(editProductRequest, this.id.id)
        .subscribe(editResponse => {
          this.loading = false;
          this.newProduct = editResponse.product;
          console.log('new product after edit service', this.newProduct);
          this.alertService.openSnackBar('Product edited successfully', false);
          this.dialogRef.close(true);
        }, error21 => {
          this.alertService.openSnackBar('Failed to edit the product!', true);
          this.dialogRef.close(false);
        });
    }
  }

  editStock(id: ProductId, stock: Quantity) {
    const dialogRef = this.dialog.open(RestockDialogComponent, {
      width: '300px',
      height: '240px'
    });


    dialogRef.componentInstance.productId = id;
    dialogRef.componentInstance.oldStock = stock;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stock = dialogRef.componentInstance.newStock;
        this.productForm.controls.stock.setValue(this.stock.quantity);
      }
    });
  }

}
