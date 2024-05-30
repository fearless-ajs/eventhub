import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@libs/database/abstract.entity';
import { Cart } from '@app/rest/carts/entities/cart.entity';
import { UserServicePricingPlan } from '@app/rest/user-service-pricing-plans/entities/user-service-pricing-plan.entity';

@Entity({ name: 'cart_items'})
export class CartItem extends AbstractEntity<CartItem>{
  @Column({ name: 'quantity', type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => UserServicePricingPlan, (pricingPlan) => pricingPlan.cartItems)
  @JoinColumn({ name: 'pricingPlanId'})
  pricingPlan: UserServicePricingPlan;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;
}
