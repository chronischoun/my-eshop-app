import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // Inject το PLATFORM_ID για να ξέρουμε αν τρέχουμε σε browser ή server
  private platformId = inject(PLATFORM_ID); 
  
  private authUrl = 'http://localhost:3000/api/auth/login'; 
  private userUrl = 'http://localhost:3000/api/users'; 

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    // Εκτελούμε τον έλεγχο μόνο αν είμαστε στον browser
    if (isPlatformBrowser(this.platformId)) {
      if (this.isLoggedIn()) {
        this.refreshUser();
      }
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(this.authUrl, credentials).pipe(
      tap((res: any) => {
        // Αποθήκευση μόνο αν είμαστε στον browser
        if (res.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          this.refreshUser();
        }
      })
    );
  }

  refreshUser() {
    // Αν δεν είμαστε σε browser, σταμάτα (για να μην χτυπάει το localStorage)
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get(`${this.userUrl}/profile`, { headers })
      .subscribe({
        next: (user) => {
          console.log('User Subject updated:', user);
          this.userSubject.next(user); // Ενημερώνει αυτόματα το προφίλ
        },
        error: (err) => {
          console.error('Could not refresh user:', err);
          if (err.status === 401) this.logout();
        }
      });
  }

  getUserProfile(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.userUrl}/profile`, { headers });
    }
    return new Observable();
  }

  isLoggedIn(): boolean {
    // Έλεγχος πλατφόρμας για αποφυγή ReferenceError
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.userSubject.next(null);
  }
}