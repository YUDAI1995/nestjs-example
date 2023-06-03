import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({
    comment: 'userID',
  })
  readonly id: number;

  @Column('varchar', { comment: 'userName' })
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
