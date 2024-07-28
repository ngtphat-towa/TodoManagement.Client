// todo-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ITodo } from '../../../core';
import { TodoStatus } from '../../../core/enums'; // Adjust import path

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss'],
})
export class TodoCardComponent {
  @Input() todo!: ITodo;

  TodoStatus = TodoStatus; // Expose enum to the template

  getBorderClass(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.Opening:
        return 'border-gray-200';
      case TodoStatus.Progressing:
        return 'border-blue-100';
      case TodoStatus.Testing:
        return 'border-red-200';
      case TodoStatus.Done:
        return 'border-green-200';
      case TodoStatus.Rejected:
        return 'border-yellow-300';
      default:
        return '';
    }
  }
}
