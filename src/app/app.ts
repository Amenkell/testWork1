import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  WritableSignal
} from '@angular/core';
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
export class App {

  private userService: UserService = inject(UserService);
  protected searchName: WritableSignal<string> = signal('');
  protected filterStatus: WritableSignal<StatusTypeEnum> = signal<StatusTypeEnum>(StatusTypeEnum.ALL);
  protected statusTypes: WritableSignal<string[]> = signal(Object.values(StatusTypeEnum));
  protected selectedUserSignal = signal<User | null>(null);
  private usersSignal = this.userService.getUsers();

  protected filteredUsers = computed(() => {
    const searchVal = this.searchName().toLowerCase();
    const filterVal = this.filterStatus();
    let filtered = this.usersSignal();

    if (filterVal === StatusTypeEnum.ACTIVE) {
      filtered = filtered.filter(u => u.active);
    } else if (filterVal === StatusTypeEnum.INACTIVE) {
      filtered = filtered.filter(u => !u.active);
    }

    if (searchVal) {
      filtered = filtered.filter(u => u.name.toLowerCase().includes(searchVal));
    }

    return filtered;
  });

  protected selectedUser = computed(() => {
    const current = this.selectedUserSignal();
    const filtered = this.filteredUsers();

    return filtered.some(u => u.id === current?.id) ? current : null;
  });

  selectUser(user: User): void {
    this.selectedUserSignal.set(user);
  }
}
