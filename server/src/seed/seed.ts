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

export async function runSeed(dataSource: DataSource) {
  const examRepo = dataSource.getRepository(ExamType);
  const researcherRepo = dataSource.getRepository(Researchers);
  const employeeRepo = dataSource.getRepository(Employees);
  const sampleRepo = dataSource.getRepository(Sample);
  const resultRepo = dataSource.getRepository(SampleResult);

  const hasData = await examRepo.count();
  if (hasData > 0) {
    console.log('Seed já executado.');
    return;
  }

  // Exam Types
  const [hemograma, ecg, glicemia] = await examRepo.save([
    { name: 'Hemograma', description: 'Exame de sangue completo' },
    { name: 'Eletrocardiograma', description: 'Exame do coração' },
    { name: 'Glicemia', description: 'Medição de glicose no sangue' },
  ]);

  // Researchers
  const [r1, r2, r3] = await researcherRepo.save([
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
  ]);

  // Employees
  const [e1, e2] = await employeeRepo.save([
    {
      name: 'Maria',
      email: 'maria@lab.com',
      role: 'ADMIN',
    },
    {
      name: 'Pedro',
      email: 'pedro@lab.com',
      role: 'TECH',
    },
  ]);

  // Samples
  const samples = await sampleRepo.save([
    // Aprovado com resultado
    {
      examType: hemograma,
      patientOrResearcher: r1,
      protocol: randomUUID(),
      status: SampleStatus.DONE,
      approvalStatus: ApprovalStatus.APPROVED,
      approvedBy: e1,
      approvedAt: new Date(),
      scheduledAt: new Date(Date.now() + 86400000),
    },

    // Rejeitado
    {
      examType: ecg,
      patientOrResearcher: r3,
      protocol: randomUUID(),
      status: SampleStatus.REJECTED,
      approvalStatus: ApprovalStatus.REJECTED,
      approvedBy: e2,
      approvedAt: new Date(),
      scheduledAt: new Date(Date.now() + 86400000 * 2),
    },

    // Pendente
    {
      examType: glicemia,
      patientOrResearcher: r2,
      protocol: randomUUID(),
      status: SampleStatus.PENDING,
      approvalStatus: ApprovalStatus.PENDING,
      scheduledAt: new Date(Date.now() + 86400000 * 3),
    },

    // Em análise
    {
      examType: hemograma,
      patientOrResearcher: r2,
      protocol: randomUUID(),
      status: SampleStatus.ANALYZING,
      approvalStatus: ApprovalStatus.APPROVED,
      approvedBy: e1,
      approvedAt: new Date(),
      scheduledAt: new Date(Date.now() + 86400000),
    },
  ]);

  // Sample Results
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

  console.log('🔥 Seed COMPLETO executado com sucesso!');
}
