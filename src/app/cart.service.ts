import { Injectable } from '@angular/core';
import { Movie } from './movies';
import {CartComponent} from '../app/cart/cart.component';
import {Cart} from '../app/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items=[];
  total = 0;
  value:Cart;
  
  constructor() { }

  addToCart(movie:any,quantity:number,price:number){ 

    var _totalCost = price * quantity;
    var _quantity = Number(quantity);
    var _flag =false;
    this.total += price*quantity;

    for (let index = 0; index < this.items.length; index++) {
      if( this.items[index].id == movie.imdbID)
      {
       var _num =Number(this.items[index].quantity); 
       this.items[index].quantity = Number(_quantity+_num);
       this.items[index].totalCost += _totalCost;
       _flag = true;
       break;
      }
    }

  if(!_flag)
  {
    this.setCart(movie,quantity,_totalCost,50);
  }

}

  setCart(cart:any,quantity:number,totalCost:number,price:number){
    this.value = {
      id:cart.imdbID,
      itemCost:price,
      title:cart.Title,
      quantity:quantity,
      totalCost:totalCost
    }
    this.items.push(this.value);
  }

  getItems()
  {
    return this.items;
  }

  clearCart(){
    this.total =0;
    this.items.splice(0,this.items.length);
  }

  removeItem(movie:any){
    this.items.splice(this.items.lastIndexOf(movie),1);
    this.total = this.total - movie.totalCost;
  }
}
