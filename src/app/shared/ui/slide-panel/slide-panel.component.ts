import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-panel.component.html',
  styleUrls: ['./slide-panel.component.scss'],
  animations: [
    trigger('fadeSlideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class SlidePanelComponent {
  @Input() isOpen = false;
  @Input() headerText = 'Slide Panel Header';
  @Output() onClose = new EventEmitter();

  onClosePanel() {
    this.onClose.emit(false);
  }
}
