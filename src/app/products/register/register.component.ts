import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  detailsform=this.registerfm.group({
    username:['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    email: ['', [Validators.required, Validators.email]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9 ]*')]]
  })

  constructor(private api:ApiService,private registerfm:FormBuilder,private registerroute:Router){}

  registerbtn(){
    // console.log('hello');
    
    if(this.detailsform.valid){
      let username=this.detailsform.value.username
      let email=this.detailsform.value.email
      let password=this.detailsform.value.password
      
      this.api.register(username,email,password).subscribe((result:any)=>{
        
        console.log(result);
        alert('registered succefully')
         this.registerroute.navigateByUrl('products')
        
        
        
        
        
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
