import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './information.html',
  styleUrl: './information.scss'
})
export class InformationComponent {
  public lastUpdated = new Date().getFullYear();
}