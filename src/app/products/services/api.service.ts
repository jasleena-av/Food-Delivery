
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  cartItemCount =new BehaviorSubject(0)

  constructor(private http:HttpClient) {
     this.cartcount()
   }

  BASE_URL= 'http://localhost:3200'

  register(username:any,email:any,password:any){

    const body={
      username,
      email,
      password
      

    }
    return this.http.post(`${this.BASE_URL}/products/register`,body)
  }

  login(email:any,password:any){
    // req body
    const body={
      email,
      password
    }
    // make api call to server for register
    return this.http.post('http://localhost:3000/products/login',body)
  }


  getallproducts(){
    // api
    return this.http.get(`${this.BASE_URL}/products/all-products`)
  }

  viewproduct(id:any){
    // api
    return this.http.get(`${this.BASE_URL}/products/view-product/${id}`)
  }

  

  // add to cart api/add-product
  addtocart(product:any){
    // get id,title,image,price,quantity
    const body={
      id:product.id,
      title:product.title,
      price:product.price,
      image:product.image,
      quantity:product.quantity

    }
    // api
    return this.http.post(`${this.BASE_URL}/cart/add-item`,body)
  }

  getcart(){
    return this.http.get(`${this.BASE_URL}/cart/get-item`)

  }
  cartcount(){
    this.getcart().subscribe((result:any)=>{
      this.cartItemCount.next(result.length)

    })
  }

  removecartitem(id:any){
    return this.http.delete(`${this.BASE_URL}/cart/remove-item/${id}`)
  }

  emptycart(){
    return this.http.delete(`${this.BASE_URL}/cart/remove-all-item`)

  }
  incCartItem(id:any){
    return this.http.get(`${this.BASE_URL}/cart/increment-item/${id}`)
  }

  decCartItem(id:any){
    return this.http.get(`${this.BASE_URL}/cart/decrement-item/${id}`)

  }
  


}
