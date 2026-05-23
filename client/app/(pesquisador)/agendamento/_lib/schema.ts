import { z } from "zod";

export const EXAM_OPTIONS = [
  { id: "ureia", label: "Uréia" },
  { id: "creatinina", label: "Creatinina" },
  { id: "tgo", label: "TGO" },
  { id: "tgp", label: "TGP" },
  { id: "tp", label: "TP" },
  { id: "ttpa", label: "TTPA" },
  {
    id: "hemograma_sem",
    label: "Hemograma sem contagem diferencial (sem leitura de lâmina)",
  },
  {
    id: "hemograma_com",
    label: "Hemograma com contagem diferencial (com leitura de lâmina)",
  },
  { id: "outro", label: "Outro" },
] as const;

export const NIVEL_OPTIONS = [
  { value: "ic", label: "Iniciação científica" },
  { value: "mestrado", label: "Mestrado" },
  { value: "doutorado", label: "Doutorado" },
  { value: "pos_doutorado", label: "Pós-doutorado" },
  { value: "outro", label: "Outro" },
] as const;

export const sampleSchema = z.object({
  especieAnimal: z.string().min(1, "Informe a espécie animal"),
  totalAnimais: z.coerce
    .number()
    .int()
    .min(1, "Mínimo de 1 animal"),
  exames: z.array(z.string()).min(1, "Selecione pelo menos um exame"),
  outroExame: z.string().optional(),
  previsaoRemessas: z.string().min(1, "Informe a previsão de remessas"),
});

export const schedulingSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  nome: z.string().min(1, "Nome é obrigatório"),
  telefone: z.string().optional(),
  orientador: z.string().optional(),
  nivel: z.string().min(1, "Selecione o nível acadêmico"),
  tituloProjeto: z.string().min(1, "Título da pesquisa é obrigatório"),
  cursoPrograma: z.string().optional(),
  laboratorio: z.string().optional(),
  semana: z.string().min(1, "Selecione uma semana disponível"),
  amostras: z.array(sampleSchema).min(1, "Adicione pelo menos uma amostra"),
  observacoes: z.string().optional(),
});

export type SchedulingFormData = z.infer<typeof schedulingSchema>;
export type SampleData = z.infer<typeof sampleSchema>;
