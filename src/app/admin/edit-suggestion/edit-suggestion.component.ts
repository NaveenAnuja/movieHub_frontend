import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-suggestion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-suggestion.component.html',
  styleUrl: './edit-suggestion.component.css'
})
export class EditSuggestionComponent {
  @Input() suggestion: any;
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient
  ) { }

  updateSuggestion() {
    if (!this.suggestion?.comment?.trim()) {
      Swal.fire('Error!', 'Comment cannot be empty', 'error');
      return;
    }

    this.isLoading = true;
    
    const updateRequest = {
      comment: this.suggestion.comment.trim()
    };

    this.http.put(`${environment.apiBaseUrl}/suggestion/update/suggestion/${this.suggestion.id}`, updateRequest)
      .subscribe({
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
          Swal.fire('Error!', error.error?.message || 'Failed to update suggestion', 'error');
        },
        complete: () => this.isLoading = false
      });
  }
}