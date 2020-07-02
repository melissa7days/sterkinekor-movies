import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartComponent } from './cart/cart.component';
import { Cart } from './Cart';
@Injectable({
  providedIn: 'root'
})
export class WebrequestService {

  readonly ROOT_URL;
  formData: Cart;
  list: Cart[];
  constructor(private http: HttpClient){
    this.ROOT_URL = "http://localhost:50382/api"
  }

   get(url:string){
     return this.http.get(`${this.ROOT_URL}/${url}`);
   }

   post(){
     return this.http.post(this.ROOT_URL + '/cart', this.formData);
   }
   refreshList(){
     this.http.get(this.ROOT_URL + '/cart')
     .toPromise()
     .then(res => this.list = res as Cart[]);
   }
}
