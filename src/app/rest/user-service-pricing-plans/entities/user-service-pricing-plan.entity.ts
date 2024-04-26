import { UserService } from "@app/rest/user-services/entities/user-service.entity";
import { AbstractEntity } from "@libs/database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({ name: 'user_service_pricing_plans' })
export class UserServicePricingPlan extends AbstractEntity<UserServicePricingPlan>{
    @Column({ name: 'item', type: 'varchar', length: 255 })
    item: string;

    @Column({  name: 'amount', type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(() => UserService, (service) => service.pricingPlans)
    service: UserService;
}
