import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../core/services/todo.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/ui/pagination/pagination.component';
import { SlidePanelComponent } from '../../shared/ui/slide-panel/slide-panel.component';
import { TodoCardComponent } from '../../shared/components/todo-card/todo-card.component';
import { CreateTodoRequest, ITodo, TodoStatusMapping, UpdateTodoRequest } from '../../core';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    SlidePanelComponent,
    TodoCardComponent,
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  todos: ITodo[] = [];
  isSlidePanelOpen = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  totalRecords = 0;
  todoForm: FormGroup;
  todoStatus = TodoStatusMapping;
  editingTodoId?: number;

  constructor(private todoService: TodoService, private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: [1, [Validators.required]],
    });
  }

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

  openSlidePanel(todo?: ITodo): void {
    if (todo) {
      this.editingTodoId = todo.id;
      this.todoForm.patchValue(todo);
    } else {
      this.editingTodoId = undefined;
      this.todoForm.reset({
        status: 1, // Default status
      });
    }
    this.isSlidePanelOpen = true;
  }
  onCloseSlidePanel(): void {
    this.isSlidePanelOpen = false;
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      if (this.editingTodoId) {
        const updateRequest: UpdateTodoRequest = {
          title: formValue.title,
          description: formValue.description,
          status: formValue.status,
        };
        this.todoService
          .updateTodo(this.editingTodoId, updateRequest)
          .subscribe({
            next: (response) => {
              console.log('Todo updated:', response);
              this.loadTodos(this.currentPage, this.pageSize);
              this.onCloseSlidePanel();
            },
            error: (err) => {
              console.error('Error updating todo:', err);
            },
          });
      } else {
        const newTodo: CreateTodoRequest = {
          title: formValue.title,
          description: formValue.description,
          status: formValue.status,
        };
        this.todoService.createTodo(newTodo).subscribe({
          next: (response) => {
            console.log('Todo created:', response);
            this.loadTodos(this.currentPage, this.pageSize);
            this.onCloseSlidePanel();
          },
          error: (err) => {
            console.error('Error creating todo:', err);
          },
        });
      }
    }
  }
  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: (response) => {
        console.log('Todo deleted:', response);
        this.loadTodos(this.currentPage, this.pageSize);
      },
      error: (err) => {
        console.error('Error deleting todo:', err);
      },
    });
  }
}
