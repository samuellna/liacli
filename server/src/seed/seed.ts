import { DataSource } from 'typeorm';
import { ExamType } from '../exam_types/exam_types.entity';
import { Researchers, ResearchLevel } from '../researchers/researchers.entity';
import { Employees } from '../employees/employees.entity';
import {
  Sample,
  SampleStatus,
  ApprovalStatus,
} from '../samples/samples.entity';
import { SampleResult } from '../sample_results/sample_results.entity';
import { ResearchProject } from '../researcher_projects/researcher_projects.entity';
import * as admin from 'firebase-admin';
import { generateProtocol } from 'src/utils/generate_protocol';

export async function runSeed(dataSource: DataSource) {
  const examRepo = dataSource.getRepository(ExamType);
  const researcherRepo = dataSource.getRepository(Researchers);
  const employeeRepo = dataSource.getRepository(Employees);
  const sampleRepo = dataSource.getRepository(Sample);
  const resultRepo = dataSource.getRepository(SampleResult);
  const projectRepo = dataSource.getRepository(ResearchProject);

  console.log('🌱 Iniciando seed...');

  // ─── EXAM TYPES ───────────────────────────────────────────────────────────

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

  // ─── RESEARCHERS ──────────────────────────────────────────────────────────
  // Novos campos: phone, advisorName, level

  const researchersData = [
    {
      name: 'Dr. João',
      email: 'joao@lab.com',
      institution: 'UFPE',
      phone: '81991110001',
      advisorName: 'Prof. Dr. Marcelo Lima',
      level: ResearchLevel.DOCTORATE,
    },
    {
      name: 'Dra. Ana',
      email: 'ana@lab.com',
      institution: 'UFRPE',
      phone: '81991110002',
      advisorName: 'Profa. Dra. Fernanda Costa',
      level: ResearchLevel.MASTERS,
    },
    {
      name: 'Dr. Carlos',
      email: 'carlos@externo.com',
      institution: 'Outra',
      phone: '81983244111',
      advisorName: 'Prof. Kiev Gama',
      level: ResearchLevel.SCIENTIFIC_INITIATION,
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

  // ─── EMPLOYEES ────────────────────────────────────────────────────────────

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

  // ─── RESEARCH PROJECTS ────────────────────────────────────────────────────

  const projectCount = await projectRepo.count();

  let projects: ResearchProject[];

  if (projectCount === 0) {
    projects = await projectRepo.save([
      {
        title:
          'Avaliação hematológica em ratos Wistar submetidos a dieta hiperlipídica',
        course: 'Programa de Pós-graduação em Nutrição — UFPE',
        researchLab: 'Laboratório de Fisiologia Animal — UFPE',
        animalSpecies: 'Rattus norvegicus (Wistar)',
        totalAnimals: 30,
        expectedShipments: 3,
        preferredDate: new Date(Date.now() + 86400000 * 10),
        researcher: r1,
        examTypes: [hemograma, glicemia],
      },
      {
        title:
          'Perfil bioquímico de coelhos em diferentes fases de crescimento',
        course: 'Mestrado em Zootecnia — UFRPE',
        researchLab: 'Laboratório de Produção Animal — UFRPE',
        animalSpecies: 'Oryctolagus cuniculus',
        totalAnimals: 20,
        expectedShipments: 2,
        preferredDate: new Date(Date.now() + 86400000 * 20),
        researcher: r2,
        examTypes: [glicemia, ecg],
      },
      {
        title: 'Monitoramento cardíaco em cães de grande porte',
        course: 'Iniciação Científica — Outra',
        researchLab: 'Lab. de Clínica de Pequenos Animais',
        animalSpecies: 'Canis lupus familiaris',
        totalAnimals: 10,
        expectedShipments: 1,
        preferredDate: new Date(Date.now() + 86400000 * 15),
        researcher: r3,
        examTypes: [ecg],
      },
    ]);
  } else {
    projects = await projectRepo.find({
      relations: ['researcher', 'examTypes'],
    });
  }

  const [p1, p2, p3] = projects;

  // ─── SAMPLES ──────────────────────────────────────────────────────────────
  // Campo researchProject adicionado (nullable para retrocompatibilidade)

  const sampleCount = await sampleRepo.count();

  let samples: Sample[];

  if (sampleCount === 0) {
    samples = await sampleRepo.save([
      {
        examType: hemograma,
        researcher: r1,
        researchProject: p1,
        protocol: generateProtocol(),
        status: SampleStatus.DONE,
        approvalStatus: ApprovalStatus.APPROVED,
        approvedBy: e1,
        approvedAt: new Date(),
        scheduledAt: new Date(Date.now() + 86400000),
      },
      {
        examType: ecg,
        researcher: r3,
        researchProject: p3,
        protocol: generateProtocol(),
        status: SampleStatus.REJECTED,
        approvalStatus: ApprovalStatus.REJECTED,
        approvedBy: e2,
        approvedAt: new Date(),
        scheduledAt: new Date(Date.now() + 86400000 * 2),
      },
      {
        examType: glicemia,
        researcher: r2,
        researchProject: p2,
        protocol: generateProtocol(),
        status: SampleStatus.PENDING,
        approvalStatus: ApprovalStatus.PENDING,
        scheduledAt: new Date(Date.now() + 86400000 * 3),
      },
      {
        examType: hemograma,
        researcher: r2,
        researchProject: p2,
        protocol: generateProtocol(),
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

  // ─── SAMPLE RESULTS ───────────────────────────────────────────────────────

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
