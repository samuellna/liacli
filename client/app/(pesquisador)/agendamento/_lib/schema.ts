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

export const LEVEL_OPTIONS = [
  { value: "SCIENTIFIC_INITIATION", label: "Iniciação científica" },
  { value: "MASTERS", label: "Mestrado" },
  { value: "DOCTORATE", label: "Doutorado" },
  { value: "POST_DOCTORATE", label: "Pós-doutorado" },
  { value: "OTHER", label: "Outro" },
] as const;

export const sampleSchema = z.object({
  animalSpecies: z.string().min(1, "Informe a espécie animal"),
  totalAnimals: z.coerce.number().int().min(1, "Mínimo de 1 animal"),
  samples: z.array(z.string()).min(1, "Selecione pelo menos um exame"),
  expectedShipments: z.coerce.number().min(1, "Informe a previsão de remessas"),
});

export const schedulingSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().optional(),
  advisorName: z.string().optional(),
  level: z.string().min(1, "Selecione o nível acadêmico"),
  title: z.string().min(1, "Título da pesquisa é obrigatório"),
  course: z.string().optional(),
  researchLab: z.string().optional(),
  preferredDate: z.string().min(1, "Selecione uma semana disponível"),
  sample: z.array(sampleSchema).min(1, "Adicione as informações da amostra"),
  observations: z.string().optional(),
});

export type SchedulingFormData = z.infer<typeof schedulingSchema>;
export type SampleData = z.infer<typeof sampleSchema>;

export const DEFAULT_VALUES: SchedulingFormData = {
  email: "",
  name: "",
  phone: "",
  advisorName: "",
  level: "",
  title: "",
  course: "",
  researchLab: "",
  preferredDate: "",
  sample: [
    {
      animalSpecies: "",
      totalAnimals: 1,
      samples: [],
      expectedShipments: 1,
    },
  ],
  observations: "",
};
