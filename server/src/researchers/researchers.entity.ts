import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'researchers' })
export class Researchers {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @Column('varchar', { length: 100, nullable: false })
  email: string;

  @Column('varchar', { length: 100, nullable: false })
  institution: string;

  @Column('varchar', { length: 100, nullable: false })
  createdAt: string;
}
