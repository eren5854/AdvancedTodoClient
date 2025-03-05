import { Component } from '@angular/core';
import { LoginModel } from '../../models/login.model';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SwalService } from '../../services/swal.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  registerModel: UserModel = new UserModel();
  loginModel: LoginModel = new LoginModel();

  avatars: string[] = ["7309681.jpg", "7309683.jpg", "7309703.jpg"];

  showRegister:boolean = false;
  imageUrl:string = "";

  constructor(
    private http: HttpService,
    private router: Router,
    private swal: SwalService
  ){
    this.imageUrl = http.getImageUrl();
  }

  login(form: NgForm){
    if(form.valid){
      this.http.post("Auth/Login", this.loginModel, (res) => {
        console.log(res);
        // this.swal.callToast("Login Success", "success")
        localStorage.setItem("token", res.data.token);
        this.router.navigateByUrl("");
      });
    }
  }

  register(form:NgForm){
    if(form.valid){
      this.http.post("Auth/Register", this.registerModel, (res) => {
        console.log(res.data);
        this.swal.callToast(res.data);
        this.showRegister = false;
      });
    }
  }

  showRegisterPage(){
    this.showRegister = !this.showRegister;
  }
  selectAvatar(avatar:string){
    this.registerModel.avatar = avatar;
    console.log(this.registerModel.avatar);
    
  }
}
