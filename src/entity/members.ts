import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Members {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userName: string

    @Column()
    password: string

    @Column()
    permissions: string
}
