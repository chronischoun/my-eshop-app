import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Book {
  _id?: string;
  title: string;
  author?: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  pdfUuid?: string; 
  pdfUrl?: string;  
}
@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
private apiUrl = 'http://localhost:3000/api/products'

  public searchTerm = signal<string>('');

  getBooks(): Observable<Book[]> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    return this.http.get<Book[]>(this.apiUrl, { headers });
  }
}