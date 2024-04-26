import { UserService } from "@app/rest/user-services/entities/user-service.entity";
import { AbstractEntity } from "@libs/database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({ name: 'user_service_images' })
export class UserServiceImage extends AbstractEntity<UserServiceImage>{
    @Column({ name: 'url', type: 'varchar', length: 255 })
    url: string;
    
    @ManyToOne(() => UserService, (service) => service.images)
    service: UserService;
}
