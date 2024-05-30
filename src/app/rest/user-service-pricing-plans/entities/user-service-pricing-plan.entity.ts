import { UserService } from "@app/rest/user-services/entities/user-service.entity";
import { AbstractEntity } from "@libs/database/abstract.entity";
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from '@app/rest/cart-items/entities/cart-item.entity';

@Entity({ name: 'user_service_pricing_plans' })
export class UserServicePricingPlan extends AbstractEntity<UserServicePricingPlan>{
    @Column({ name: 'item', type: 'varchar', length: 255 })
    item: string;

    @Column({  name: 'amount', type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(() => UserService, (service) => service.pricingPlans)
    service: UserService;

    @OneToMany(() => CartItem, (item) => item.pricingPlan)
    cartItems: CartItem[];
}
