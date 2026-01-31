import { Component, Input, ChangeDetectorRef, afterNextRender, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-thumbnail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="thumbnail-wrapper">
      <img *ngIf="thumbnail" [src]="thumbnail" class="thumbnail" alt="PDF Preview" />
      <div *ngIf="!thumbnail" class="placeholder">
        <div class="spinner"></div>
        <span class="loading-text">Loading</span>
      </div>
    </div>
  `,
  styles: [`
    .thumbnail-wrapper { 
      width: 100%; 
      height: 250px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: #f8f9fa; 
      border-radius: 8px; 
      border: 1px solid #eee;
      overflow: hidden;
    }
    .thumbnail { width: 100%; height: 100%; object-fit: contain; }
    .spinner { width: 24px; height: 24px; border: 3px solid #f3f3f3; border-top: 3px solid #e31b23; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class PdfThumbnailComponent {
  @Input() pdfUrl!: string;
  thumbnail: string | null = null;

  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  constructor() {
    afterNextRender(() => {
      this.generateThumbnail();
    });
  }

  async generateThumbnail() {
    if (!this.pdfUrl || this.pdfUrl.includes('undefined')) return;
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const loadingTask = pdfjsLib.getDocument({ url: this.pdfUrl, verbosity: 0 });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.6 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await (page as any).render({ canvasContext: context, viewport }).promise;
        this.zone.run(() => {
          this.thumbnail = canvas.toDataURL('image/png');
          this.cdr.detectChanges();
        });
      }
      pdf.destroy();
    } catch (error) {
      console.error('PDF Preview Error:', error);
    }
  }
}