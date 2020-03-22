import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

interface Todo {
  description: string;
  id: string;
}

@Component({
  selector: 'rx-todo',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  todos$: BehaviorSubject<Todo[]> = new BehaviorSubject([]);
  currentTodoId$: BehaviorSubject<string> = new BehaviorSubject(null);
  currentTodoForm: FormGroup = this.fb.group({
    description: ['', Validators.required],
  });

  get todos() {
    return this.todos$.getValue();
  }

  get currentTodoId() { 
    return this.currentTodoId$.getValue();
  }

  private onCurrentTodoFormSubmit() {
    if (!this.currentTodoId) {
      this.saveItem(this.currentTodoForm.value);
    } else {
      this.editItem(Object.assign(
        this.currentTodoForm.value, 
        { id: this.currentTodoId }
      ));
    }
  }

  public onDeleteItem(item: Todo) {
    const updatedTodos = this.todos.filter(todo => todo.id !== item.id);
    this.todos$.next(updatedTodos);
  }

  public onEditItem(item: Todo) {
    this.currentTodoId$.next(item.id);
    this.currentTodoForm.patchValue(item);
  }

  private saveItem(item: Todo) {
    const id = (+new Date()).toString();
    const updatedTodos = [...this.todos, ...[Object.assign(item, {id})]];
    this.todos$.next(updatedTodos);
    this.currentTodoId$.next(null);
    this.currentTodoForm.reset();
  }

  private editItem(item: Todo) {
    const updatedTodos = this.todos.map(todo => {
      if (todo.id === item.id) {
        todo.description = item.description;
      }
      return todo;
    });
    this.todos$.next(updatedTodos);
    this.currentTodoId$.next(null);
    this.currentTodoForm.reset();
  }

  constructor(private fb: FormBuilder) { }
}
