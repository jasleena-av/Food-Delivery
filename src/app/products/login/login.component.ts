import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username:any
  email:any
   
  
 


  loginform=this.registerfm.group({
    
    email: ['', [Validators.required, Validators.email]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9 ]*')]]
  })

  constructor(private api:ApiService,private registerfm:FormBuilder,private loginroute:Router){}

  

  loginclicked(){
    if(this.loginform.valid){
      let email=this.loginform.value.email
      let password=this.loginform.value.password
      
      this.api.login(email,password).subscribe((result:any)=>{
        console.log(result);
        

        if(result.email){
          this.username=result.email.email


          localStorage.setItem("email",result.email.email)
           // store currentUser in localstorage
          localStorage.setItem("token",result.token)  
          this.loginroute.navigateByUrl('products/'+this.username)

        }
        else{
          alert('Invalid Details')
        }
       
            
      },
      (result:any)=>{
        alert(result.error.message)
        
      }
      )
    }
    else{
      alert('Invalid Form')
    }
    
  }

}
