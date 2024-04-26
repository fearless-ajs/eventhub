import { UserServiceImage } from "@app/rest/user-service-images/entities/user-service-image.entity";
import { UserServicePricingPlan } from "@app/rest/user-service-pricing-plans/entities/user-service-pricing-plan.entity";
import { User } from "@app/rest/users/entities/user.entity";
import { AbstractEntity } from "@libs/database/abstract.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: 'user_services' })
export class UserService extends AbstractEntity<UserService>{
    @Column({ name: 'name', type: 'varchar', length: 255 })
    name: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ name: 'category', type: 'varchar', length: 255 })
    category: string;

    @ManyToOne(() => User, (user) => user.services)
    user: User;

    @OneToMany(() => UserServicePricingPlan, (pricingPlan) => pricingPlan.service, { cascade: true })
    pricingPlans: UserServicePricingPlan[];

    @OneToMany(() => UserServiceImage, (image) => image.service, { cascade: true })
    images: UserServiceImage[];
}
