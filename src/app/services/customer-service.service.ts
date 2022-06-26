import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {
  constructor(private http: HttpClient) { }

  public getCustomersList(keyword: String="", page:number=0, size:number=5) : Observable<Array<Customer>>{ // any for result datatype
    let link = environment.backendBaseURL + `/customers?page=${page}&size=${size}&keyword=${keyword}`;
    console.log(link);

    return this.http.get<Array<Customer>>(link);

  }

  public saveCustomer(customer: Customer): Observable<Customer>{ // retourne client cree
    return this.http.post<Customer>( environment.backendBaseURL+"/customers", customer);
// dans le backend on le rend un costumer
  }

  public removeCustomer(customerId: String){
    return this.http.delete( environment.backendBaseURL+"/customers/"+ customerId);

  }

}


