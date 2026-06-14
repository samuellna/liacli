import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { Sample } from 'src/samples/samples.entity';
import { SampleResult } from 'src/sample_results/sample_results.entity';
import { ParameterGroups } from 'src/exam_types/exam_types.entity';

interface ProcessedParam {
  name: string;
  value: string;
  unit: string;
  reference: string;
}

interface ProcessedGroup {
  groupName: string;
  parameters: ProcessedParam[];
}

interface ProcessedResult {
  examTypeName: string;
  validated: boolean;
  grupos: ProcessedGroup[];
  observations: string;
}

interface PdfTemplateData {
  protocol: string;
  createdAt: string;
  status: string;
  approvalStatus: string;
  animalsInThisShipment: number;
  scheduledAt: string;
  researcher: {
    name: string;
    email: string;
    institution: string;
    phone: string;
    advisorName: string;
    level: string;
  };
  project: {
    title: string;
    course: string;
    researchLab: string;
    animalSpecies: string;
    totalAnimals: number;
    expectedShipments: number;
  };
  results: ProcessedResult[];
  emittedAt: string;
}

@Injectable()
export class PdfService {
  private readonly template: Handlebars.TemplateDelegate;

  constructor() {
    const templatePath = path.join(__dirname, 'templates', 'result.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    this.template = Handlebars.compile(templateSource);
  }

  async generateResultPdf(
    sample: Sample,
    results: SampleResult[],
  ): Promise<Buffer> {
    const data = this.buildTemplateData(sample, results);
    const html = this.template(data);
    return this.renderPdf(html);
  }

  private buildTemplateData(
    sample: Sample,
    results: SampleResult[],
  ): PdfTemplateData {
    const researcher = sample.researchProject.researcher;
    const project = sample.researchProject;

    const processedResults: ProcessedResult[] = results.map((result) => {
      const grupos = this.processGroups(
        result.examType.groups ?? [],
        result.resultData as Record<string, Record<string, string>>,
      );

      return {
        examTypeName: result.examType.name,
        validated: result.validated,
        grupos,
        observations: result.observations ?? '',
      };
    });

    return {
      protocol: sample.protocol,
      createdAt: this.formatDate(sample.createdAt),
      status: this.translateStatus(sample.status),
      approvalStatus: this.translateApprovalStatus(sample.approvalStatus),
      animalsInThisShipment: sample.animalsInThisShipment,
      scheduledAt: sample.scheduledAt
        ? this.formatDate(sample.scheduledAt)
        : '—',
      researcher: {
        name: researcher.name,
        email: researcher.email,
        institution: researcher.institution,
        phone: researcher.phone,
        advisorName: researcher.advisorName,
        level: this.translateResearchLevel(researcher.level),
      },
      project: {
        title: project.title,
        course: project.course,
        researchLab: project.researchLab,
        animalSpecies: project.animalSpecies,
        totalAnimals: project.totalAnimals,
        expectedShipments: project.expectedShipments,
      },
      results: processedResults,
      emittedAt: this.formatDateTime(new Date()),
    };
  }

  private processGroups(
    groups: ParameterGroups[],
    resultData: Record<string, Record<string, string>>,
  ): ProcessedGroup[] {
    return groups.map((group) => ({
      groupName: group.groupName ?? '',
      parameters: group.parameters.map((param) => ({
        name: param.name,
        value: resultData[group.groupName ?? '']?.[param.name] ?? '—',
        unit: param.unit ?? '',
        reference: param.reference ?? '',
      })),
    }));
  }

  private async renderPdf(html: string): Promise<Buffer> {
    const { default: puppeteer } = await import('puppeteer');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  private formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  private translateStatus(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Aguardando Coleta',
      COLLECTED: 'Coletada',
      ANALYZING: 'Em Análise',
      DONE: 'Concluída',
      REJECTED: 'Rejeitada',
    };
    return map[status] ?? status;
  }

  private translateApprovalStatus(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Aguardando Aprovação',
      APPROVED: 'Aprovada',
      REJECTED: 'Reprovada',
    };
    return map[status] ?? status;
  }

  private translateResearchLevel(level: string): string {
    const map: Record<string, string> = {
      SCIENTIFIC_INITIATION: 'Iniciação Científica',
      MASTERS: 'Mestrado',
      DOCTORATE: 'Doutorado',
      POST_DOCTORATE: 'Pós-Doutorado',
    };
    return map[level] ?? level;
  }
}
