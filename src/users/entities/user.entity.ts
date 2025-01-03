import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text", nullable: false})
    name: string;

    @Column({type: "text", nullable: false})
    role: string;
}