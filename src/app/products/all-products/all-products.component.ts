import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  allProducts:any=[]
  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.getallproducts()
    .subscribe((result:any)=>{
    
      this.allProducts =result
      console.log(this.allProducts);
      
      
    })
    
      
  }

}
