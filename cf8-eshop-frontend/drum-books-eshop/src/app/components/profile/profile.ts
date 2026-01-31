import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html'
})
export class ProfileComponent {
  public authService = inject(AuthService);
  
  user$ = this.authService.user$;

  constructor() {
    this.user$.subscribe(user => {
      console.log('Current profile data:', user);
    });
  }
}