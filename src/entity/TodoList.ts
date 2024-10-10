import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class TodoLists {

    @PrimaryGeneratedColumn()
    to_do_id?: number

    @Column()
    subject: string

    @Column()
    reserved_time: string

    @Column()
    modified_time: string

    @Column()
    brief: string

    @Column()
    level: number

    @Column()
    author: string

    @Column()
    content: string

    @Column('simple-array')
    attachments:string[]
}
