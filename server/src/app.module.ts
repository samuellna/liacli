import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchersModule } from './researchers/researchers.module';
import { EmployeesModule } from './employees/employees.module';
import { ExamTypesModule } from './exam_types/exam_types.module';
import { SamplesModule } from './samples/samples.module';
import { SampleResultsModule } from './sample_results/sample_results.module';
import { EmailModule } from './email/email.module';
import { ResearchProjectsModule } from './researcher_projects/researcher_projects.module';
import { FirebaseModule } from './auth/firebase.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ResearchersModule,
    EmployeesModule,
    ExamTypesModule,
    SamplesModule,
    SampleResultsModule,
    EmailModule,
    ResearchProjectsModule,
  ],
})
export class AppModule {}
