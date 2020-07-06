import { Component, OnInit } from '@angular/core';
import {CartService} from '../cart.service';
import {MovieDescription} from '../movie'
import { MovieApiService } from '../movie-api.service';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { HttpClient } from '@angular/common/http';
import { CartLogic } from '../cartLogic';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  item=[];
  total = 0;
  count=0;
  id=0;
  constructor(private cartService:CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.item = this.cartService.getItems();
    this.total = this.cartService.total;
    this.numberOfItems();

  }

  ngAfterContentChecked()
  {
    this.total = this.cartService.total;
    this.numberOfItems();
  }

  removeItem(item:any) : void {
    this.cartService.removeItem(item);
  }

  clearCart():void{
 
    this.cartService.clearCart();
  }

  numberOfItems()
  {
     this.count = this.item.length;
  }

  

}
