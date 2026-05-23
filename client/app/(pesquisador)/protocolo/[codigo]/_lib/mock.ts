import type { AppointmentData } from "./types";

const DEMO_CONCLUIDO: AppointmentData = {
  protocolo: "DEMO01",
  agendamentoStatus: "aprovado",
  analiseStatus: "concluido",
  dataSubmissao: "12/05/2026 às 09:14",
  semana: "19/05 – 21/05/2026",
  ultimaAtualizacao: "23/05/2026 às 17:30",
  laudoUrl: "#laudo-demo",
  pesquisador: {
    nome: "Ana Paula Rodrigues",
    email: "ana.rodrigues@ufpe.edu.br",
    telefone: "(81) 98765-4321",
    orientador: "Prof. Dr. Carlos Menezes",
    nivel: "Doutorado",
    tituloProjeto: "Avaliação hepática em modelos murinos de esteatose não alcoólica",
    cursoPrograma: "Programa de Pós-graduação em Ciências Biológicas — UFPE",
    laboratorio: "Laboratório de Bioquímica Animal — CB/UFPE",
  },
  amostras: [
    {
      id: "a1",
      especieAnimal: "Rattus norvegicus",
      totalAnimais: 24,
      exames: ["tgo", "tgp", "ureia", "creatinina"],
      previsaoRemessas: "3 remessas ao longo de 4 meses",
    },
    {
      id: "a2",
      especieAnimal: "Rattus norvegicus",
      totalAnimais: 12,
      exames: ["hemograma_com", "tp", "ttpa"],
      previsaoRemessas: "2 remessas mensais",
    },
  ],
  observacoes:
    "Animais do grupo controle e grupo tratado devem ser identificados individualmente nas embalagens. Amostras de sangue coletadas após jejum de 12h.",
  timeline: [
    {
      id: "t1",
      icon: "send",
      label: "Solicitação enviada",
      description: "Formulário preenchido e enviado pelo pesquisador.",
      date: "12/05/2026 às 09:14",
      completed: true,
      current: false,
    },
    {
      id: "t2",
      icon: "inbox",
      label: "Recebida pela clínica",
      description: "Solicitação registrada e em análise pela equipe LIACLI.",
      date: "12/05/2026 às 11:00",
      completed: true,
      current: false,
    },
    {
      id: "t3",
      icon: "calendar-check",
      label: "Agendamento confirmado",
      description: "Semana confirmada pela coordenação do laboratório.",
      date: "13/05/2026 às 09:15",
      completed: true,
      current: false,
    },
    {
      id: "t4",
      icon: "package",
      label: "Amostras recebidas",
      description: "Recebimento confirmado pelo técnico responsável.",
      date: "19/05/2026 às 10:30",
      completed: true,
      current: false,
    },
    {
      id: "t5",
      icon: "microscope",
      label: "Em análise laboratorial",
      description: "Análise concluída conforme protocolo interno.",
      date: "21/05/2026 às 14:00",
      completed: true,
      current: false,
    },
    {
      id: "t6",
      icon: "file-check",
      label: "Laudo disponível",
      description: "Laudo técnico emitido e disponível para download.",
      date: "23/05/2026 às 17:30",
      completed: true,
      current: false,
    },
  ],
};

const DEMO_EM_ANALISE: AppointmentData = {
  protocolo: "DEMO02",
  agendamentoStatus: "aprovado",
  analiseStatus: "em_analise",
  dataSubmissao: "09/05/2026 às 14:22",
  semana: "19/05 – 21/05/2026",
  ultimaAtualizacao: "21/05/2026 às 10:30",
  pesquisador: {
    nome: "Bruno Soares Lima",
    email: "b.soares@ce.ufpe.br",
    telefone: "(81) 91234-5678",
    orientador: "Profa. Dra. Maria Fernanda Costa",
    nivel: "Mestrado",
    tituloProjeto: "Resposta imunológica em ratos Wistar submetidos a modelo experimental de diabetes",
    cursoPrograma: "Mestrado em Ciências da Saúde — UFPE",
    laboratorio: "Laboratório de Imunofisiologia — CCB/UFPE",
  },
  amostras: [
    {
      id: "a1",
      especieAnimal: "Rattus norvegicus (Wistar)",
      totalAnimais: 18,
      exames: ["hemograma_sem", "ureia", "creatinina", "tgo", "tgp"],
      previsaoRemessas: "4 remessas em 6 meses",
    },
  ],
  timeline: [
    {
      id: "t1",
      icon: "send",
      label: "Solicitação enviada",
      description: "Formulário preenchido e enviado pelo pesquisador.",
      date: "09/05/2026 às 14:22",
      completed: true,
      current: false,
    },
    {
      id: "t2",
      icon: "inbox",
      label: "Recebida pela clínica",
      description: "Solicitação registrada e em análise pela equipe LIACLI.",
      date: "09/05/2026 às 16:00",
      completed: true,
      current: false,
    },
    {
      id: "t3",
      icon: "calendar-check",
      label: "Agendamento confirmado",
      description: "Semana confirmada pela coordenação do laboratório.",
      date: "12/05/2026 às 08:45",
      completed: true,
      current: false,
    },
    {
      id: "t4",
      icon: "package",
      label: "Amostras recebidas",
      description: "Recebimento confirmado pelo técnico responsável.",
      date: "19/05/2026 às 10:30",
      completed: true,
      current: false,
    },
    {
      id: "t5",
      icon: "microscope",
      label: "Em análise laboratorial",
      description: "Análises em andamento. Previsão de conclusão: 26/05/2026.",
      date: "21/05/2026 às 09:00 (previsão: 26/05)",
      completed: false,
      current: true,
    },
    {
      id: "t6",
      icon: "file-check",
      label: "Laudo disponível",
      description: "Aguardando conclusão das análises.",
      date: "Aguardando",
      completed: false,
      current: false,
    },
  ],
};

const DEMO_PENDENTE: AppointmentData = {
  protocolo: "DEMO03",
  agendamentoStatus: "pendente",
  analiseStatus: "aguardando",
  dataSubmissao: "15/05/2026 às 16:48",
  semana: "02/06 – 04/06/2026",
  ultimaAtualizacao: "15/05/2026 às 16:48",
  pesquisador: {
    nome: "Carla Mendes Oliveira",
    email: "carla.oliveira@dce.ufpe.br",
    orientador: "Prof. Dr. João Paulo Ferreira",
    nivel: "Iniciação científica",
    tituloProjeto: "Análise bioquímica em modelos de hiperlipidemia induzida",
    laboratorio: "Laboratório de Nutrição Experimental — CCS/UFPE",
  },
  amostras: [
    {
      id: "a1",
      especieAnimal: "Rattus norvegicus",
      totalAnimais: 10,
      exames: ["ureia", "creatinina", "tgo", "tgp"],
      previsaoRemessas: "2 remessas",
    },
  ],
  timeline: [
    {
      id: "t1",
      icon: "send",
      label: "Solicitação enviada",
      description: "Formulário preenchido e enviado pelo pesquisador.",
      date: "15/05/2026 às 16:48",
      completed: true,
      current: false,
    },
    {
      id: "t2",
      icon: "inbox",
      label: "Aguardando análise da clínica",
      description: "Solicitação em fila de análise pela coordenação LIACLI.",
      date: "Em análise",
      completed: false,
      current: true,
    },
    {
      id: "t3",
      icon: "calendar-check",
      label: "Agendamento confirmado",
      description: "Aguardando confirmação.",
      date: "Aguardando",
      completed: false,
      current: false,
    },
    {
      id: "t4",
      icon: "package",
      label: "Amostras recebidas",
      description: "—",
      date: "Aguardando",
      completed: false,
      current: false,
    },
    {
      id: "t5",
      icon: "microscope",
      label: "Em análise laboratorial",
      description: "—",
      date: "Aguardando",
      completed: false,
      current: false,
    },
    {
      id: "t6",
      icon: "file-check",
      label: "Laudo disponível",
      description: "—",
      date: "Aguardando",
      completed: false,
      current: false,
    },
  ],
};

const DEMO_REJEITADO: AppointmentData = {
  protocolo: "DEMO04",
  agendamentoStatus: "rejeitado",
  analiseStatus: "aguardando",
  dataSubmissao: "10/05/2026 às 11:05",
  semana: "26/05 – 28/05/2026",
  ultimaAtualizacao: "11/05/2026 às 14:20",
  pesquisador: {
    nome: "Diego Alves Santos",
    email: "diego.alves@ccen.ufpe.br",
    nivel: "Doutorado",
    tituloProjeto: "Estudo farmacocinético de compostos bioativos em modelos animais",
    cursoPrograma: "Doutorado em Farmácia — UFPE",
    laboratorio: "Laboratório de Farmacologia Experimental",
  },
  amostras: [
    {
      id: "a1",
      especieAnimal: "Mus musculus",
      totalAnimais: 30,
      exames: ["hemograma_com", "tgo", "tgp", "tp", "ttpa"],
      previsaoRemessas: "5 remessas em 8 meses",
    },
  ],
  observacoes: "Reunião de alinhamento com o responsável pelas parcerias necessária antes da confirmação.",
  timeline: [
    {
      id: "t1",
      icon: "send",
      label: "Solicitação enviada",
      description: "Formulário preenchido e enviado pelo pesquisador.",
      date: "10/05/2026 às 11:05",
      completed: true,
      current: false,
    },
    {
      id: "t2",
      icon: "inbox",
      label: "Recebida pela clínica",
      description: "Solicitação registrada e avaliada pela equipe LIACLI.",
      date: "10/05/2026 às 14:00",
      completed: true,
      current: false,
    },
    {
      id: "t3",
      icon: "x-circle",
      label: "Agendamento não aprovado",
      description:
        "A semana solicitada não está disponível. Entre em contato pelo WhatsApp (081 21268579) para reagendar.",
      date: "11/05/2026 às 14:20",
      completed: false,
      current: true,
    },
  ],
};

const DEMOS: Record<string, AppointmentData> = {
  DEMO01: DEMO_CONCLUIDO,
  DEMO02: DEMO_EM_ANALISE,
  DEMO03: DEMO_PENDENTE,
  DEMO04: DEMO_REJEITADO,
};

const VALID_PROTOCOL_RE = /^[A-Z0-9]{6,8}$/;

export type LookupResult =
  | { kind: "found"; data: AppointmentData }
  | { kind: "pending_new"; protocolo: string }
  | { kind: "not_found" };

export function lookupProtocol(rawCode: string): LookupResult {
  const code = rawCode.toUpperCase().trim();

  const demo = DEMOS[code];
  if (demo) return { kind: "found", data: demo };

  if (VALID_PROTOCOL_RE.test(code))
    return { kind: "pending_new", protocolo: code };

  return { kind: "not_found" };
}

export const EXAM_LABELS: Record<string, string> = {
  ureia: "Uréia",
  creatinina: "Creatinina",
  tgo: "TGO",
  tgp: "TGP",
  tp: "TP",
  ttpa: "TTPA",
  hemograma_sem: "Hemograma sem contagem diferencial",
  hemograma_com: "Hemograma com contagem diferencial",
  outro: "Outro",
};
