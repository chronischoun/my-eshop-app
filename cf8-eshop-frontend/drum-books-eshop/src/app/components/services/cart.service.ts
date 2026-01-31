import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSignal = signal<any[]>([]);

  cartItems = this.cartItemsSignal.asReadonly();

  totalAmount = computed(() => 
    this.cartItemsSignal().reduce((acc, item) => acc + (item.price || 0), 0)
  );

  addToCart(book: any) {
    this.cartItemsSignal.update(items => [...items, book]);
  }

  removeFromCart(index: number) {
    this.cartItemsSignal.update(items => items.filter((_, i) => i !== index));
  }

  clearCart() {
    this.cartItemsSignal.set([]);
  }
}