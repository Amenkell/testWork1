import {ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserService} from '../services/user.service';
import {FormsModule} from '@angular/forms';
import {StatusTypeEnum} from '../models/status-type.enum';
import {User} from '../models/user.interface';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {

  protected users: User[] = [];
  protected filteredUsers: WritableSignal<User[]> = signal<User[]>([]);
  protected searchName: WritableSignal<string> = signal('');
  protected filterStatus: WritableSignal<StatusTypeEnum> = signal<StatusTypeEnum>(StatusTypeEnum.ALL);
  protected selectedUser: WritableSignal<User | null> = signal<User | null>(null);
  protected statusTypes: WritableSignal<string[]> = signal(Object.values(StatusTypeEnum));

  private userService: UserService = inject(UserService);

  constructor() {
    effect(() => {

      const searchVal = this.searchName().toLowerCase();
      const filterVal = this.filterStatus();
      let filteredUsers: User[] = this.users;

      if (filterVal === StatusTypeEnum.ACTIVE) {
        filteredUsers = filteredUsers.filter((u) => u.active);
      } else if (filterVal === StatusTypeEnum.INACTIVE) {
        filteredUsers = filteredUsers.filter((u) => !u.active);
      }

      if (searchVal) {
        filteredUsers = filteredUsers.filter((u) => u.name.toLowerCase().includes(searchVal));
      }

      this.filteredUsers.set(filteredUsers);

      if (!filteredUsers.some((u) => u.id === this.selectedUser()?.id)) {
        this.selectedUser.set(null);
      }
    });
  }

  public ngOnInit(): void {

    this.users = this.userService.getUsers()();
    this.filteredUsers.set(this.users);

  }

  selectUser(user: User): void {
    this.selectedUser.set(user);
  }
}
