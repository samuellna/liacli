import { Controller, Get } from '@nestjs/common';
import { SamplesService } from './samples/samples.service';
import { SampleResultsService } from './sample_results/sample_results.service';

interface DashboardData {
  samples: {
    inAnalysis: number;
    pendingApproval: number;
    approvedPendingCollection: number;
    finished: number;
  };
  pendingApproval: {
    protocol: string;
    researcher: string;
    date: Date;
    firstTime: boolean;
  }[];
}

@Controller()
export class AppController {
  constructor(
    private readonly samplesService: SamplesService,
    private readonly sampleResultsService: SampleResultsService,
  ) {}

  @Get('')
  async getHello(): Promise<DashboardData> {
    const amountInAnalysis = await this.samplesService.findAmountInAnalysis();
    const amountPendingApproval =
      await this.samplesService.findAmountPendingApproval();
    const amountOfResults = await this.sampleResultsService.findAmountResults();
    const approvedPendingCollection =
      await this.samplesService.findAmountApprovedPendingCollection();

    const pendingApprovalSamples =
      await this.samplesService.findPendingApprovalSamples();

    const dashboardData: DashboardData = {
      samples: {
        inAnalysis: amountInAnalysis,
        pendingApproval: amountPendingApproval,
        approvedPendingCollection: approvedPendingCollection,
        finished: amountOfResults,
      },
      pendingApproval: pendingApprovalSamples, // Aqui você pode adicionar a lógica para preencher os dados de amostras pendentes de aprovação
    };

    return dashboardData;
  }
}
