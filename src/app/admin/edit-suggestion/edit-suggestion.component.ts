import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../enviroment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-suggestion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-suggestion.component.html',
  styleUrls: ['./edit-suggestion.component.css'] // ✅ corrected (styleUrls not styleUrl)
})
export class EditSuggestionComponent {
  @Input() suggestion: any;
  isLoading = false;
  commentError = '';

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient
  ) { }

  validateComment(): boolean {
    if (!this.suggestion.comment || this.suggestion.comment.trim().length === 0) {
      this.commentError = 'Comment is required';
      return false;
    }
    
    if (this.suggestion.comment.length < 5) {
      this.commentError = 'Comment must be at least 5 characters';
      return false;
    }
    
    if (this.suggestion.comment.length > 50) {
      this.commentError = 'Comment cannot exceed 50 characters';
      return false;
    }
    
    this.commentError = '';
    return true;
  }

  updateSuggestion() {
    if (!this.validateComment()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: this.commentError,
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    this.isLoading = true;
    
    const updateRequest = {
      comment: this.suggestion.comment.trim()
    };

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.put(
      `${environment.apiBaseUrl}/suggestion/update/suggestion/${this.suggestion.id}`,
      updateRequest,
      { headers }
    ).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Suggestion updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.activeModal.close('updated');
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.error?.message || 'Failed to update suggestion',
          confirmButtonColor: '#0d6efd'
        });
      },
      complete: () => this.isLoading = false
    });
  }
}
