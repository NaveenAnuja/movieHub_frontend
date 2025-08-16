import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../enviroment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  public user: any = {
    id: "",
    name: "",
    email: "",
    password: ""
  };

  public showPassword = false; 

  constructor(private http: HttpClient, private router: Router) { }

   togglePassword() {
    this.showPassword = !this.showPassword;
  }

  public addUser() {
    if (!this.user.password || this.user.password.length < 6 || this.user.password.length > 10) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password Length !',
        text: 'Please enter a password between 6 and 10 characters'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Please enter a valid email address',
      });
      return;
    }

    this.http.get(`${environment.apiBaseUrl}/user/view/users`).subscribe((data: any) => {
      console.log('API returned:', data);

      const userList = Array.isArray(data) ? data : [];

      const duplicateEmailUser = userList.find(
        (existingUser: any) => existingUser.email === this.user.email
      );

      if (duplicateEmailUser) {
        Swal.fire({
          icon: 'error',
          title: 'This email is already registered !',
          text: 'Please use a different email or sign up.'
        });
      } else {

        this.http.post(`${environment.apiBaseUrl}/user/register/user`, this.user)
          .subscribe(() => {
            this.saveData();
            Swal.fire({
              icon: 'success',
              title: 'User Added Successfully',
              text: 'Welcome to my MovieHub.',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/login']);
            });
          });
      }
    });
  }

  public saveData() {
    this.http.get(`${environment.apiBaseUrl}/user/search-by-email/${this.user.email}`)
      .subscribe((data: any) => {
        localStorage.setItem("userData", JSON.stringify(data));
      });
  }
}
