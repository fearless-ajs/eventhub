import { Entity, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '@libs/database/abstract.entity';
import { User } from '@app/rest/users/entities/user.entity';
import { CartItem } from '@app/rest/cart-items/entities/cart-item.entity';

@Entity({ name: 'carts' })
export class Cart extends AbstractEntity<Cart>{
  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];
}
