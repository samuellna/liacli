import { DataSource } from 'typeorm';
import { ExamType } from '../exam_types/exam_types.entity';
import { Researchers } from '../researchers/researchers.entity';
import { Employees } from '../employees/employees.entity';
import {
  Sample,
  SampleStatus,
  ApprovalStatus,
} from '../samples/samples.entity';
import { SampleResult } from '../sample_results/sample_results.entity';
import { randomUUID } from 'crypto';
import admin from '../auth/admin';

export async function runSeed(dataSource: DataSource) {
  const examRepo = dataSource.getRepository(ExamType);
  const researcherRepo = dataSource.getRepository(Researchers);
  const employeeRepo = dataSource.getRepository(Employees);
  const sampleRepo = dataSource.getRepository(Sample);
  const resultRepo = dataSource.getRepository(SampleResult);

  console.log('🌱 Iniciando seed...');

  // EXAM TYPES
  const examTypesData = [
    { name: 'Hemograma', description: 'Exame de sangue completo' },
    { name: 'Eletrocardiograma', description: 'Exame do coração' },
    { name: 'Glicemia', description: 'Medição de glicose no sangue' },
  ];

  const examTypes: ExamType[] = [];

  for (const exam of examTypesData) {
    let existing = await examRepo.findOne({ where: { name: exam.name } });

    if (!existing) {
      existing = await examRepo.save(exam);
    }

    examTypes.push(existing);
  }

  const [hemograma, ecg, glicemia] = examTypes;

  // RESEARCHERS
  const researchersData = [
    {
      name: 'Dr. João',
      email: 'joao@lab.com',
      institution: 'UFPE',
    },
    {
      name: 'Dra. Ana',
      email: 'ana@lab.com',
      institution: 'UFRPE',
    },
    {
      name: 'Dr. Carlos',
      email: 'carlos@externo.com',
      institution: 'Outra',
    },
  ];

  const researchers: Researchers[] = [];

  for (const r of researchersData) {
    let existing = await researcherRepo.findOne({
      where: { email: r.email },
    });

    if (!existing) {
      existing = await researcherRepo.save(r);
    }

    researchers.push(existing);
  }

  const [r1, r2, r3] = researchers;

  // EMPLOYEES
  const employeesData = [
    {
      name: 'Maria',
      email: 'maria@lab.com',
      password: '123456',
      role: 'ADMIN',
    },
    {
      name: 'Pedro',
      email: 'pedro@lab.com',
      password: '123456',
      role: 'TECH',
    },
  ];

  const employees: Employees[] = [];

  for (const emp of employeesData) {
    let userRecord;

    try {
      userRecord = await admin.auth().getUserByEmail(emp.email);
    } catch {
      userRecord = await admin.auth().createUser({
        email: emp.email,
        password: emp.password,
      });
    }

    let employee = await employeeRepo.findOne({
      where: { email: emp.email },
    });

    if (!employee) {
      employee = await employeeRepo.save({
        name: emp.name,
        email: emp.email,
        role: emp.role,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        userId: userRecord.uid,
      });
    }

    employees.push(employee);
  }

  const [e1, e2] = employees;

  // SAMPLES
  const sampleCount = await sampleRepo.count();

  let samples: Sample[];

  if (sampleCount === 0) {
    samples = await sampleRepo.save([
      {
        examType: hemograma,
        researcher: r1,
        protocol: randomUUID(),
        status: SampleStatus.DONE,
        approvalStatus: ApprovalStatus.APPROVED,
        approvedBy: e1,
        approvedAt: new Date(),
        scheduledAt: new Date(Date.now() + 86400000),
      },
      {
        examType: ecg,
        researcher: r3,
        protocol: randomUUID(),
        status: SampleStatus.REJECTED,
        approvalStatus: ApprovalStatus.REJECTED,
        approvedBy: e2,
        approvedAt: new Date(),
        scheduledAt: new Date(Date.now() + 86400000 * 2),
      },
      {
        examType: glicemia,
        researcher: r2,
        protocol: randomUUID(),
        status: SampleStatus.PENDING,
        approvalStatus: ApprovalStatus.PENDING,
        scheduledAt: new Date(Date.now() + 86400000 * 3),
      },
      {
        examType: hemograma,
        researcher: r2,
        protocol: randomUUID(),
        status: SampleStatus.ANALYZING,
        approvalStatus: ApprovalStatus.APPROVED,
        approvedBy: e1,
        approvedAt: new Date(),
        scheduledAt: new Date(Date.now() + 86400000),
      },
    ]);
  } else {
    samples = await sampleRepo.find();
  }

  // SAMPLE RESULTS
  const resultCount = await resultRepo.count();

  if (resultCount === 0) {
    await resultRepo.save([
      {
        sample: samples[0],
        resultData: {
          hemoglobina: 13.5,
          leucocitos: 7000,
        },
        createdAt: new Date(),
      },
    ]);
  }

  console.log('🔥 Seed executado com sucesso!');
}
