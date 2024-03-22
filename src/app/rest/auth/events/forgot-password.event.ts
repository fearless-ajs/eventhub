import { User } from '@app/rest/users/entities/user.entity';

export class ForgotPasswordEvent {
  constructor(
    public readonly user: User,
    public readonly token: number,
  ) {}
}
