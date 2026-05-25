import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchersModule } from './researchers/researchers.module';
import { EmployeesModule } from './employees/employees.module';
import { ExamTypesModule } from './exam_types/exam_types.module';
import { SamplesModule } from './samples/samples.module';
import { SampleResultsModule } from './sample_results/sample_results.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ResearchersModule,
    EmployeesModule,
    ExamTypesModule,
    SamplesModule,
    SampleResultsModule,
    EmailModule,
  ],
})
export class AppModule {}
