import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employees {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('varchar', { length: 255 })
  role: string;
}
