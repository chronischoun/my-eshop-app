import { Component, inject, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { CartService } from '../services/cart.service';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  public cartService = inject(CartService);
  private bookService = inject(BookService);
  private router = inject(Router);

  public totalCount = computed(() => this.cartService.cartItems().length);

  onSearchChange(event: any) {
    const value = event.target.value;
    this.bookService.searchTerm.set(value);
  }

  onLogoClick() {
    this.bookService.searchTerm.set(''); 
    this.router.navigate(['/']);
  }
}