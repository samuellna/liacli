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
    {
      name: 'Hemograma',
      description: 'Exame de sangue completo',
      groups: [
        {
          groupName: 'Eritrograma',
          parameters: [
            {
              name: 'Hemácias',
              unit: 'Milhões/mm³',
              reference: 'Homens: 4,50–6,10 | Mulheres: 4,00–5,40',
            },
            {
              name: 'Hemoglobina',
              unit: 'g/dL',
              reference: 'Homens: 13,0–16,5 | Mulheres: 12,0–15,8',
            },
            {
              name: 'Hematócrito',
              unit: '%',
              reference: 'Homens: 36,0–54,0 | Mulheres: 33,0–47,8',
            },
            { name: 'VCM', unit: 'fL', reference: '80,0–98,0' },
            { name: 'HCM', unit: 'pg', reference: '26,8–32,9' },
            { name: 'CHCM', unit: 'g/dL', reference: '30,0–36,5' },
          ],
        },
        {
          groupName: 'Leucograma',
          parameters: [
            { name: 'Leucócitos', unit: '/mm³', reference: '3.600–11.000' },
            { name: 'Bastonetes', unit: '/mm³', reference: '0–550' },
            { name: 'Segmentados', unit: '/mm³', reference: '1.480–7.700' },
            { name: 'Eosinófilos', unit: '/mm³', reference: '0–550' },
            { name: 'Basófilos', unit: '/mm³', reference: '0–220' },
            {
              name: 'Linfócitos Típicos',
              unit: '/mm³',
              reference: '740–5.500',
            },
            { name: 'Monócitos', unit: '/mm³', reference: '37–1.100' },
          ],
        },
        {
          groupName: 'Série Plaquetária',
          parameters: [
            {
              name: 'Plaquetas',
              unit: '/mm³',
              reference: '150.000–450.000',
            },
          ],
        },
      ],
    },
    {
      name: 'Eletrocardiograma',
      description: 'Exame do coração',
      groups: [
        {
          groupName: 'ECG',
          parameters: [
            {
              name: 'Frequência Cardíaca',
              unit: 'bpm',
              reference: '60–100',
            },
            { name: 'Ritmo', unit: '—', reference: '' },
            { name: 'Intervalo PR', unit: 'ms', reference: '120–200' },
            { name: 'QRS', unit: 'ms', reference: '< 120' },
            { name: 'Intervalo QT', unit: 'ms', reference: '< 440' },
          ],
        },
      ],
    },
    {
      name: 'Glicemia',
      description: 'Medição de glicose no sangue',
      groups: [
        {
          groupName: 'Glicemia',
          parameters: [
            {
              name: 'Glicose',
              unit: 'mg/dL',
              reference: 'Jejum: 70–99 | 2h pós-prandial: < 140',
            },
          ],
        },
      ],
    },
  ];

  const examTypes: ExamType[] = [];

  for (const exam of examTypesData) {
    let existing = await examRepo.findOne({ where: { name: exam.name } });

    if (!existing) {
      existing = await examRepo.save(exam);
    } else if (!existing.groups) {
      await examRepo.update(existing.id, { groups: exam.groups });
      existing = { ...existing, groups: exam.groups };
    }

    examTypes.push(existing);
  }

  const [hemograma, ecg, glicemia] = examTypes;

  // ─── RESEARCHERS ──────────────────────────────────────────────────────────

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
    let existing = await researcherRepo.findOne({ where: { email: r.email } });

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
    { name: 'Pedro', email: 'pedro@lab.com', password: '123456', role: 'TECH' },
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

    let employee = await employeeRepo.findOne({ where: { email: emp.email } });

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

  const sampleCount = await sampleRepo.count();

  let samples: Sample[];

  if (sampleCount === 0) {
    samples = await sampleRepo.save([
      {
        // p1: hemograma + glicemia — DONE (todos os exames com resultado)
        researchProject: p1,
        animalsInThisShipment: 10,
        protocol: generateProtocol(),
        status: SampleStatus.DONE,
        approvalStatus: ApprovalStatus.APPROVED,
        approvedBy: e1,
        approvedAt: new Date(),
        scheduledAt: new Date(Date.now() + 86400000),
      },
      {
        // p1: hemograma + glicemia — ANALYZING (aprovada, sem resultado ainda)
        researchProject: p1,
        animalsInThisShipment: 8,
        protocol: generateProtocol(),
        status: SampleStatus.ANALYZING,
        approvalStatus: ApprovalStatus.APPROVED,
        approvedBy: e1,
        approvedAt: new Date(),
        scheduledAt: new Date(Date.now() + 86400000 * 5),
      },
      {
        // p2: glicemia + ecg — PENDING (aguardando aprovação)
        researchProject: p2,
        animalsInThisShipment: 5,
        protocol: generateProtocol(),
        status: SampleStatus.PENDING,
        approvalStatus: ApprovalStatus.PENDING,
        scheduledAt: new Date(Date.now() + 86400000 * 3),
      },
      {
        // p3: ecg — REJECTED
        researchProject: p3,
        animalsInThisShipment: 3,
        protocol: generateProtocol(),
        status: SampleStatus.REJECTED,
        approvalStatus: ApprovalStatus.REJECTED,
        approvedBy: e2,
        approvedAt: new Date(),
        scheduledAt: new Date(Date.now() + 86400000 * 2),
      },
    ]);
  } else {
    samples = await sampleRepo.find({
      relations: ['researchProject', 'researchProject.examTypes'],
    });
  }

  const [s1] = samples;

  // ─── SAMPLE RESULTS ───────────────────────────────────────────────────────
  // Apenas para s1 (DONE) — um resultado por examType do projeto p1 (hemograma + glicemia)

  const resultCount = await resultRepo.count();

  if (resultCount === 0) {
    await resultRepo.save([
      {
        sample: s1,
        examType: hemograma,
        observations:
          'Amostra levemente hemolisada; valores do eritrograma podem estar discretamente subestimados. Leucograma sem alterações significativas.',
        resultData: {
          Eritrograma: {
            Hemácias: '5,2',
            Hemoglobina: '14,1',
            Hematócrito: '42,0',
            VCM: '88,0',
            HCM: '29,5',
            CHCM: '33,5',
          },
          Leucograma: {
            Leucócitos: '7.200',
            Bastonetes: '180',
            Segmentados: '4.500',
            Eosinófilos: '220',
            Basófilos: '50',
            'Linfócitos Típicos': '1.800',
            Monócitos: '450',
          },
          'Série Plaquetária': {
            Plaquetas: '280.000',
          },
        },
      },
      {
        sample: s1,
        examType: glicemia,
        observacoes:
          'Animal em jejum de 12h confirmado antes da coleta. Glicose dentro do intervalo de referência para a espécie.',
        resultData: {
          Glicemia: {
            Glicose: '92',
          },
        },
      },
    ]);
  }

  console.log('🔥 Seed executado com sucesso!');
}
