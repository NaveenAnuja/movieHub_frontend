import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../../enviroment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  @Input() user: any;

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient
  ) {}

updateUser() {
  const updateRequest = {
    name: this.user.name,
    email: this.user.email 
  };

  this.http.put(`${environment.apiBaseUrl}/user/update/user/${this.user.id}`, updateRequest)
    .subscribe({
      next: () => {
        Swal.fire('Success!', 'User updated successfully', 'success');
        this.activeModal.close('updated');
      },
      error: (error) => {
        Swal.fire('Error!', error.error?.message || 'Failed to update user', 'error');
      }
    });
}

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  formatTime(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString();
  }
}