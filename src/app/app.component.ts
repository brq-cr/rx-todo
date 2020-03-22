import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  currentTodoForm = this.fb.group({
    description: ['', Validators.required],
  });

  get todosState() {
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
    const newTodoState = this.todosState.filter(todo => todo.id !== item.id);
    this.todos$.next(newTodoState);
  }

  public onEditItem(item: Todo) {
    this.currentTodoId$.next(item.id);
    this.currentTodoForm.patchValue(item);
  }

  private saveItem(item: Todo) {
    item.id = (+new Date()).toString();
    this.todos$.next([...this.todosState, ...[item]]);
    this.currentTodoId$.next(null);
    this.currentTodoForm.reset();
  }

  private editItem(item: Todo) {
    const newTodoState = this.todosState.map(todo => {
      if (todo.id === item.id) {
        todo.description = item.description;
      }
      return todo;
    });
    this.todos$.next(newTodoState);
    this.currentTodoId$.next(null);
    this.currentTodoForm.reset();
  }

  constructor(private fb: FormBuilder) { }
}
