export type Parametro = {
  id: string;
  nome: string;
  unidade: string;
  tipo: "number" | "text";
  referencia: string;
};

export type GrupoExame = {
  id: string;
  nome: string;
  metodo?: string;
  parametros: Parametro[];
};

export type ExameTemplate = {
  examNome: string;
  grupos: GrupoExame[];
};

export const exameTemplates: ExameTemplate[] = [
  {
    examNome: "Hemograma",
    grupos: [
      {
        id: "eritrograma",
        nome: "Eritrograma",
        parametros: [
          {
            id: "hemacias",
            nome: "Hemácias",
            unidade: "Milhões/mm³",
            tipo: "number",
            referencia:
              "Homens: 4,50–6,10 | Mulheres: 4,00–5,40 | Crianças: 4,07–5,37 | >70 anos: 3,90–5,36",
          },
          {
            id: "hemoglobina",
            nome: "Hemoglobina",
            unidade: "g/dl",
            tipo: "number",
            referencia:
              "Homens: 13,0–16,5 | Mulheres: 12,0–15,8 | Crianças: 10,5–14,0 | >70 anos: 11,5–15,1",
          },
          {
            id: "hematocrito",
            nome: "Hematócrito",
            unidade: "%",
            tipo: "number",
            referencia:
              "Homens: 36,0–54,0 | Mulheres: 33,0–47,8 | Crianças: 30,0–44,5 | >70 anos: 33,0–46,0",
          },
          {
            id: "vcm",
            nome: "VCM",
            unidade: "fL",
            tipo: "number",
            referencia: "80,0–98,0 (todas as faixas)",
          },
          {
            id: "hcm",
            nome: "HCM",
            unidade: "pg",
            tipo: "number",
            referencia:
              "Homens: 26,8–32,9 | Mulheres: 26,2–32,6 | Crianças: 23,2–31,7 | >70 anos: 27,0–31,0",
          },
          {
            id: "chcm",
            nome: "CHCM",
            unidade: "g/dl",
            tipo: "number",
            referencia: "30,0–36,5 (todas as faixas)",
          },
        ],
      },
      {
        id: "leucograma",
        nome: "Leucograma",
        parametros: [
          {
            id: "leucocitos",
            nome: "Leucócitos",
            unidade: "/mm³",
            tipo: "number",
            referencia: "Adultos: 3.600–11.000 | Crianças (<8 anos): 4.000–14.000",
          },
          {
            id: "bastonetes",
            nome: "Bastonetes",
            unidade: "/mm³",
            tipo: "number",
            referencia: "Adultos: 0–550 | Crianças: 0–450",
          },
          {
            id: "segmentados",
            nome: "Segmentados",
            unidade: "/mm³",
            tipo: "number",
            referencia: "Adultos: 1.480–7.700 | Crianças: 1.200–9.600",
          },
          {
            id: "eosinofilos",
            nome: "Eosinófilos",
            unidade: "/mm³",
            tipo: "number",
            referencia: "Adultos: 0–550 | Crianças: 0–550",
          },
          {
            id: "basofilos",
            nome: "Basófilos",
            unidade: "/mm³",
            tipo: "number",
            referencia: "Adultos: 0–220 | Crianças: 0–300",
          },
          {
            id: "linfocitos_tipicos",
            nome: "Linfócitos Típicos",
            unidade: "/mm³",
            tipo: "number",
            referencia: "Adultos: 740–5.500 | Crianças: 1.520–10.500",
          },
          {
            id: "linfocitos_atipicos",
            nome: "Linfócitos Atípicos",
            unidade: "/mm³",
            tipo: "number",
            referencia: "0",
          },
          {
            id: "monocitos",
            nome: "Monócitos",
            unidade: "/mm³",
            tipo: "number",
            referencia: "Adultos: 37–1.100 | Crianças: 40–1.100",
          },
        ],
      },
      {
        id: "serie_plaquetaria",
        nome: "Série Plaquetária",
        metodo: "Fônio",
        parametros: [
          {
            id: "plaquetas",
            nome: "Plaquetas",
            unidade: "/mm³",
            tipo: "number",
            referencia: "Adulto: 150.000–450.000 | Criança: 150.000–500.000",
          },
        ],
      },
    ],
  },
  {
    examNome: "Glicemia",
    grupos: [
      {
        id: "glicemia",
        nome: "Glicemia",
        parametros: [
          {
            id: "glicose",
            nome: "Glicose",
            unidade: "mg/dL",
            tipo: "number",
            referencia: "Jejum: 70–99 | 2h pós-prandial: < 140",
          },
        ],
      },
    ],
  },
  {
    examNome: "Eletrocardiograma",
    grupos: [
      {
        id: "ecg",
        nome: "ECG",
        parametros: [
          {
            id: "frequencia_cardiaca",
            nome: "Frequência Cardíaca",
            unidade: "bpm",
            tipo: "number",
            referencia: "60–100",
          },
          {
            id: "ritmo",
            nome: "Ritmo",
            unidade: "—",
            tipo: "text",
            referencia: "",
          },
          {
            id: "intervalo_pr",
            nome: "Intervalo PR",
            unidade: "ms",
            tipo: "number",
            referencia: "120–200",
          },
          {
            id: "qrs",
            nome: "QRS",
            unidade: "ms",
            tipo: "number",
            referencia: "< 120",
          },
          {
            id: "intervalo_qt",
            nome: "Intervalo QT",
            unidade: "ms",
            tipo: "number",
            referencia: "< 440",
          },
        ],
      },
    ],
  },
];

export function findTemplate(examNome: string): ExameTemplate | undefined {
  const nome = examNome.toLowerCase();
  return exameTemplates.find((t) => t.examNome.toLowerCase() === nome);
}
