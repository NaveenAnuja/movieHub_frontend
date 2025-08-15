import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(private router: Router) {} 

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']); 
  }
}