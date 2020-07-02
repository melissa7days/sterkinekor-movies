import { Component, OnInit } from '@angular/core';
import {CartService} from '../cart.service';
import {MovieDescription} from '../movie'
import { MovieApiService } from '../movie-api.service';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { CheckoutService } from '../checkout.service';
import { NgForm } from '@angular/forms';
import { WebrequestService } from '../webrequest.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  item=[];
  total = 0;
  count=0;
  constructor(private cartService:CartService, private checkoutService:CheckoutService, private service: WebrequestService) { }
  
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

  onSubmit(form: NgForm) {
    this.insertRecord(form);
  }
  
  insertRecord(form: NgForm) {
    this.service.post().subscribe(
      res => {
         this.service.refreshList();
      },
      err => { console.log(err); }
    )
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
