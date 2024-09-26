import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;

  topay:any

  allproducts:any=[]
  cartTotalprice:number=0

  proceedtopaymentbtnclickedatatus:boolean=false
  username:string=""
  flat:string=""
  street:string=""
  state:string=""
  offerClickstatus:boolean=false
  discountClickedstatus:boolean=false
  showSuccess:boolean=false
  showCancel:boolean=false
  showError:boolean =false
  showPaypal:boolean=false


  addressForm=this.fb.group({
    username:[''],
    flat:[''],
    street:[''],
    state:['']
   })

  constructor(private api:ApiService,private fb:FormBuilder){



  }

  ngOnInit(): void {
    this.api.getcart()
    .subscribe(
      // 200
      (result:any)=>{
      console.log(result);
      this.allproducts=result
      console.log(this.allproducts);
      this.getCartTotal()

      // paypal
      this.initConfig()
      
      
      
    },
    // 400
    (result:any)=>{
    console.log(result.error);
    }

    )
    
  }

  getCartTotal(){
    let total =0
    this.allproducts.forEach((item:any)=>{
      total += item.grandTotal
      this.cartTotalprice = Math.ceil(total)
      this.topay=this.cartTotalprice+57

    })
    
  }

  removeItem(product:any){
    this.api.removecartitem(product).subscribe((result:any)=>{
      this.allproducts =result

      // update cart total price
       this.getCartTotal()
      // update cart total count
        this.api.cartcount()

    },
    (result:any)=>{
      alert(result.error)
    }
    
    )
  }

  emptycart(){
    this.api.emptycart().subscribe((result:any)=>{
      this.allproducts=[]
      this.getCartTotal()
      this.api.cartcount()
    },
    (result:any)=>{
      alert(result.error)
    })
  }

  increment(product:any){
    this.api.incCartItem(product).subscribe(
      (result:any)=>{
      this.allproducts=result
      // update cart total price
      this.getCartTotal()

    },
    (result:any)=>{
      alert(result.error)
    })
  }

  

  decrement(product:any){
    this.api.decCartItem(product).subscribe((result:any)=>{
      this.allproducts =result
      // update cart total price
      this.getCartTotal()

    },
    (result:any)=>{
      alert(result.error)
    })
  }

  submitBtnClicked(){
    if(this.addressForm.valid){
      this.proceedtopaymentbtnclickedatatus=true
      this.username=this.addressForm.value.username||""
      this.flat=this.addressForm.value.flat||""
      this.street=this.addressForm.value.street||""
      this.state=this.addressForm.value.state||""

    }
    else{
      alert("invalid form")
    }
  }

  offerClicked(){
    this.offerClickstatus=true

  }

  discount10(){
   let discount= Math.ceil(this.topay*10/100)
   this.topay-=discount
   this.discountClickedstatus=true

  }

   makepayment(){
    this.showPaypal=true

   }

  discount50(){
    let discount= Math.ceil(this.topay*50/100)
    this.topay-=discount
    this.discountClickedstatus=true
 
  }



  private initConfig(): void {
    let amount=this.cartTotalprice.toString()
    this.payPalConfig = {
    currency: 'USD',
    clientId: 'sb',
    createOrderOnClient: (data:any) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: amount
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: amount,
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    
      this.showSuccess = true;
       this.emptycart()
      // hide showpaypal
      this.showPaypal=false
      // hide proceedtopaymnt
      this.proceedtopaymentbtnclickedatatus=false
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
      this.showCancel=true
      // hide paypal div
      this.showPaypal=false
    },
    onError: err => {
      console.log('OnError', err);
      this.showError=true
      this.showPaypal=false
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };


  }


}
