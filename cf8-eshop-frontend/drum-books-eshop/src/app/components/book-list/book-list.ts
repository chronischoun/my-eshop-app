import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService, Book } from '../services/book.service';
import { PdfThumbnailComponent } from '../pdf-thumbnail/pdf-thumbnail'; 
import { CartService } from '../services/cart.service'; 
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, PdfThumbnailComponent], 
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss'
})
export class BookListComponent implements OnInit, OnDestroy {
  private bookService = inject(BookService); 
  private cartService = inject(CartService); 
  private router = inject(Router);
  
  public searchTerm = this.bookService.searchTerm;
  
  books = signal<Book[]>([]);
  isLoading = signal<boolean>(true);

  filteredBooks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const allBooks = this.books();

    if (!term) return allBooks;

    return allBooks.filter(book => 
      book.title.toLowerCase().includes(term) || 
      book.author?.toLowerCase().includes(term)
    );
  });

  private routerSubscription?: Subscription;

  ngOnInit(): void {
    this.loadBooks();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadBooks();
    });
  }

  loadBooks(): void {
    this.isLoading.set(true); 
    
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data ?? []); 
        this.isLoading.set(false);   
      },
      error: (err) => {
        console.error('Error fetching books:', err);
        this.books.set([]);
        this.isLoading.set(false);
      }
    });
  }

  addToCart(book: Book): void {
    this.cartService.addToCart(book);
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}