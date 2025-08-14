import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../enviroment';

@Component({
  selector: 'app-editform',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './editform.component.html',
  styleUrls: ['./editform.component.css'] 
})
export class EditformComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  public data = {
    id: '',
    name: '',
    email: '',
  };

  ngOnInit(): void {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      this.data = JSON.parse(storedUser);
    }
    console.log("Loaded user data:", this.data);
  }

  public updateUsers() {
    this.http.put(
      `${environment.apiBaseUrl}/user/update/user/${this.data.id}`,
      this.data
    ).subscribe(() => {
      localStorage.setItem("userData", JSON.stringify(this.data));
      Swal.fire({
        icon: 'success',
        title: 'User updated successfully!',
        timer: 2000,
        showConfirmButton: true
      }).then(() => {
        this.router.navigate(['/popular']);
      });
    });
  }
}
