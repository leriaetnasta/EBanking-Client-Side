import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AlertType } from '../alert-component/alert-component.component';
import { Customer } from '../models/customer.model';
import { CustomerServiceService } from '../services/customer-service.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers$!: Observable<Array<Customer>>;
  errorObj: Object | undefined;
  errorMsg: String | undefined;

  customersSearchformGroup: FormGroup | undefined ;
  constructor(private customerService: CustomerServiceService, private formBuilder: FormBuilder, private route :ActivatedRoute) { } // injection

  savedCustomerName: String | null = null;
  savingCustomerMessage: String|undefined;
  alertType!: AlertType;

  ngOnInit(): void {

    this.customersSearchformGroup = this.formBuilder.group({
      searchKeyword: this.formBuilder.control(""),
    });

    this.customers$ = this.customerService.getCustomersList().pipe(
      catchError(err => {
        this.errorMsg = err.message;
        this.errorObj = err;
        return throwError(err);
      })
    );

    this.savedCustomerName = this.route.snapshot.paramMap.get("cusomerName") ;
    this.savingCustomerMessage = "Customer "+this.savedCustomerName+ " was saved successfully!";
    this.alertType = this.savedCustomerName? AlertType.success : AlertType.info;
    console.log(this.savedCustomerName);
    }

    searchCustomers(){
      this.customers$ = this.customerService.getCustomersList(this.customersSearchformGroup?.value["searchKeyword"]);
    }

    deleteCustomer(customer: Customer){
      if(confirm("Want to delete customer "+ customer.name +"?"))
      console.log(this.customerService);
      this.customerService.removeCustomer(customer.id).subscribe({
        next: (resp: Object)=>{
          this.customers$ = this.customers$.pipe(
            map(data=>{
              let index = data.indexOf(customer);
              data.slice(index, 1);
              return data;
            })
          );
        },
        error: err=>{

          console.log(err);
        }
      });

  }


}
