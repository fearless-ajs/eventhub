import { User } from '@app/rest/users/entities/user.entity';
import { AbstractEntity } from '@libs/database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'event_feeds' })
export class EventFeed extends AbstractEntity<EventFeed> {
  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'category', type: 'varchar', length: 255 })
  category: string;

  @Column({ name: 'start_date_time', type: 'timestamp' })
  startDateTime: Date;

  @Column({ name: 'end_date_time', type: 'timestamp' })
  endDateTime: Date;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'type', type: 'varchar', length: 255 })
  type: string; // Can be paid or free

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number; // If paid

  @Column({ name: 'expected_audience', type: 'varchar', length: 255 })
  expectedAudience: string; // Can be limited or unlimited

  @Column({ name: 'audience_limit', type: 'int', default: 0 })
  audienceLimit: number; // If limited

  @Column({ name: 'registration_deadline', type: 'timestamp' })
  registrationDeadline: Date;

  @Column({ name: 'expects_dresscode', type: 'boolean', default: false })
  expectsDresscode: boolean;

  @Column({ name: 'dresscode', type: 'varchar', length: 255, nullable: true })
  dresscode: string; // If expectsDresscode is true

  @ManyToOne(() => User, (user) => user.eventFeeds)
  user: User;
}
