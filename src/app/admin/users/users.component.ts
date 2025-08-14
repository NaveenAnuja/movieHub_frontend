import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../enviroment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterLink, FormsModule, NgFor],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  public userList: any[] = [];
  public selectedUser: any = {};
  public userId: string = '';

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  public loadUsers() {
    this.http.get<any>(`${environment.apiBaseUrl}/user/view/users`)
      .subscribe({
        next: (data) => {
          if (data && data.users) {
            this.userList = Array.isArray(data.users) ? data.users : [];
          } else {
            this.userList = Array.isArray(data) ? data : [];
          }
        },
        error: (err) => {
          this.userList = [];
          Swal.fire({
            icon: 'error',
            title: 'Failed to load users',
            text: 'Please try again later',
            timer: 2000,
            showConfirmButton: true
          });
        }
      });
  }

  public deleteUsers(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiBaseUrl}/user/delete/user/${id}`, { responseType: 'text' })
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'User deleted successfully!',
                timer: 2000,
                showConfirmButton: true
              });
              this.loadUsers();
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Failed to delete user',
                text: 'Please try again later',
                timer: 2000,
                showConfirmButton: true
              });
            }
          });
      }
    });
  }

  public searchValue: string = '';

  public searchUsers() {
    if (!this.searchValue.trim()) {
      this.loadUsers();
      return;
    }

    if (!isNaN(Number(this.searchValue))) {
      this.searchUsersById(this.searchValue);
    } else if (this.searchValue) {
      this.searchUsersByEmail(this.searchValue);
    }

    this.searchValue = '';
  }

  private searchUsersById(id: string) {
    this.http.get<any>(`${environment.apiBaseUrl}/user/search-by-id/${id}`)
      .subscribe({
        next: (res) => {
          this.userList = Array.isArray(res) ? res : [res];
        },
        error: () => {
          Swal.fire({
            icon: 'warning',
            title: `User not found for ID: ${id}`,
            timer: 2000,
            showConfirmButton: true
          });
          this.loadUsers();
        }
      });
  }

  private searchUsersByEmail(email: string) {
    this.http.get<any>(`${environment.apiBaseUrl}/user/search-by-email/${email}`)
      .subscribe({
        next: (res) => {
          this.userList = Array.isArray(res) ? res : [res];
        },
        error: () => {
          Swal.fire({
            icon: 'warning',
            title: `User not found for email: ${email}`,
            timer: 2000,
            showConfirmButton: true
          });
          this.loadUsers();
        }
      });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }

  formatTime(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Time';
    }
  }

}