import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../enviroment';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public userDetails = {
    email: '',
    password: ''
  };

  public userList: any[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  public logUser() {
    const loginPayload = {
      email: this.userDetails.email,
      password: this.userDetails.password
    };

    if (
      this.userDetails.email === environment.adminEmail &&
      this.userDetails.password === environment.adminPassword
    ) {
      Swal.fire({
        icon: 'success',
        title: 'Login Success !',
        text: 'Welcome Admin!',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/admin']);
      });
      return;
    }

    this.http.post(`${environment.apiBaseUrl}/user/login`, loginPayload).subscribe({
      next: (response: any) => {

        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        this.http.get(`${environment.apiBaseUrl}/user/search-by-email/${this.userDetails.email}`)
          .subscribe((data: any) => {
            localStorage.setItem('userData', JSON.stringify(data));

            Swal.fire({
              icon: 'success',
              title: 'Login Successful!',
              text: 'Welcome to my MovieHub.',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/popular']);
            });
          });

      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password.'
        });
      }
    });
  }


  public saveData() {
    this.http
      .get(`${environment.apiBaseUrl}/user/search-by-email/${this.userDetails.email}`)
      .subscribe((data: any) => {
        localStorage.setItem('userData', JSON.stringify(data));
        console.log('Saved user data:', data);
      });
  }

}
