import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../core/services/todo.service'; // Adjust import path
import { TodoCardComponent } from '../../shared/components/todo-card/todo-card.component';
import { ITodo } from '../../core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/ui/pagination/pagination.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodoCardComponent, PaginationComponent, CommonModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  todos: ITodo[] | null = [];

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos(this.currentPage, this.pageSize);
  }

  loadTodos(page: number, pageSize: number): void {
    this.todoService.getAllTodos(page, pageSize).subscribe({
      next: (response) => {
        if (response.data) {
          this.todos = response.data;
          this.currentPage = response.pageNumber;
          this.totalPages = response.totalPages;
          this.totalRecords = response.totalRecords;
        }
      },
      error: (err) => {
        console.error('Error loading todos', err);
      },
    });
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTodos(this.currentPage, this.pageSize);
    }
  }
}
