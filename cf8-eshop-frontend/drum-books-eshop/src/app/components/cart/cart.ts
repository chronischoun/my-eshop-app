import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, RouterLink } from '@angular/router'; 
import { CartService } from '../services/cart.service'; 

@Component({
  selector: 'app-cart',
  standalone: true,           
  imports: [CommonModule, RouterModule, RouterLink], 
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'] 
})
export class CartComponent {
  public cartService = inject(CartService);

  items = this.cartService.cartItems;
  total = this.cartService.totalAmount;

  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }

  clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartService.clearCart();
    }
  }
}