import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { BookListComponent } from './components/book-list/book-list'; 
import { CartComponent } from './components/cart/cart'; 
import { CheckoutComponent } from './components/checkout/checkout'; 
import { ContactComponent } from './components/contact/contact';
import { InformationComponent } from './components/information/information';
import { FooterComponent } from './components/footer/footer';
import { ProfileComponent } from './components/profile/profile';



export const routes: Routes = [
  { 
    path: '', 
    component: BookListComponent,
  }, 
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'contact', component: ContactComponent } , 
  { path: 'info', component: InformationComponent } , 
  { path: 'profile', component: ProfileComponent }
  
];