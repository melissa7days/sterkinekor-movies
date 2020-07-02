import { Injectable } from '@angular/core';
import { WebrequestService } from './webrequest.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private webReqService:WebrequestService) { }

 
}
