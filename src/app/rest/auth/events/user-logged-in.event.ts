import { User } from '@app/rest/users/entities/user.entity';

export class UserLoggedInEvent {
  constructor(public readonly user: User) {}
}
