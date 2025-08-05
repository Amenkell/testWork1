import {Injectable, Signal, signal} from '@angular/core';
import {User} from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private users = signal<User[]>([
    { id: 1, name: 'Иван Иванов', email: 'ivan@mail.com', active: true },
    { id: 2, name: 'Мария Петрова', email: 'maria@mail.com', active: false },
    { id: 3, name: 'Сергей Сидоров', email: 'sergey@mail.com', active: true },
    { id: 4, name: 'Анна Смирнова', email: 'anna@mail.com', active: false },
  ]);

  getUsers(): Signal<User[]> {
    return this.users.asReadonly();
  }

}
