import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SimpleProduct} from '../_models/_value/product/SimpleProduct';
import {InventoryService} from '../_services/inventory.service';
import {MatDialogRef} from '@angular/material/dialog';
import {AlertService} from '../_services';
import {Quantity} from '../_models/_value/product/Quantity';
import {ProductId} from '../_models/_value/product/ProductId';

@Component({
  selector: 'app-restock-dialog',
  templateUrl: './restock-dialog.component.html',
  styleUrls: ['./restock-dialog.component.css']
})
export class RestockDialogComponent implements OnInit {

  stockForm: FormGroup;
  submitted = false;
  loading = false;

  productId: ProductId;
  oldStock: Quantity;
  newStock: Quantity;

  constructor(private formBuilder: FormBuilder,
              private inventoryService: InventoryService,
              private alertService: AlertService,
              private dialogRef: MatDialogRef<RestockDialogComponent>) {
  }

  ngOnInit(): void {
    this.stockForm = this.formBuilder.group({
      stock: [this.oldStock.quantity, Validators.compose([Validators.required, Validators.min(0)])]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.stockForm.invalid) {
      this.alertService.openSnackBar('Invalid form!', true);
      return;
    }

    this.loading = true;

    this.inventoryService.restock(this.productId.id, this.stockForm.controls.stock.value)
      .subscribe(data => {
        this.alertService.openSnackBar('Product restocked successfully', false);
        this.newStock = {
          quantity: this.stockForm.controls.stock.value
        };
        this.dialogRef.close(true);
      }, error => {
        this.alertService.openSnackBar('Failed to restock the product', true);
        this.dialogRef.close(false);
      });
  }
}
