import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service'; 
import { RouterModule, RouterLink, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements OnInit {
  public cartService = inject(CartService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router); 
  
  cartItems = this.cartService.cartItems;
  private backendApiUrl = 'http://localhost:3000/api/pdf';
  private userApiUrl = 'http://localhost:3000/api/users';

  ngOnInit() {
    console.log('Checkout initialized. Items:', this.cartItems());
  }

  downloadFile(item: any) {
    // Χρησιμοποιούμε το pdfUuid που ορίσαμε στο Product model
    const pdfUuid = item.pdfUuid; 

    if (!pdfUuid) {
      console.error('Missing PDF UUID for item:', item);
      alert('Σφάλμα: Δεν βρέθηκε το αναγνωριστικό (UUID) του αρχείου.');
      return;
    }

    // 1. Κατασκευή του URL για το download
    const fileUrl = `${this.backendApiUrl}/download/${pdfUuid}`;
    console.log('Attempting download via UUID:', fileUrl);
    
    // Άνοιγμα σε νέο tab για να ξεκινήσει το download από τον browser
    window.open(fileUrl, '_blank');

    // 2. Αποθήκευση στη Βιβλιοθήκη του χρήστη (αν είναι συνδεδεμένος)
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      console.log('Syncing to user library - UUID:', pdfUuid); 

      // Στέλνουμε το pdfUuid στο backend για να ξέρει ποιο αρχείο να συσχετίσει με τον χρήστη
      this.http.post(`${this.userApiUrl}/save-pdf`, { pdfId: pdfUuid }, { headers })
        .subscribe({
          next: (res: any) => {
            console.log('Library updated:', res);
            this.authService.refreshUser(); // Ανανέωση των στοιχείων χρήστη
            alert('Το βιβλίο προστέθηκε στη βιβλιοθήκη σας!'); 
          },
          error: (err) => {
            console.error('Library update failed:', err);
          }
        });
    }
  }

  clearAll() {
    if(confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }
}