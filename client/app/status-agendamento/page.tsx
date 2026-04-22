"use client";

import { useState } from "react";

type Agendamento = {
  protocolo: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  exames: string[];
  quantidadeAmostras: number;
  data: string;
  hora: string;
  status: "Marcado" | "Em análise" | "Concluído" | "Recusado";
};

const agendamentoMock: Agendamento = {
  protocolo: "A1B2C3",
  nome: "João Silva",
  email: "joao@email.com",
  cpf: "123.456.789-00",
  telefone: "81999999999",
  exames: ["Hemograma", "Glicose"],
  quantidadeAmostras: 2,
  data: "2026-05-10",
  hora: "10:00",
  status: "Em análise",
};

export default function StatusAgendamentoPage() {
  const [protocolo, setProtocolo] = useState("");
  const [resultado, setResultado] = useState<Agendamento | null>(null);
  const [erro, setErro] = useState("");

  const handleBuscar = () => {
    const protocoloFormatado = protocolo.trim();

    if (protocoloFormatado === agendamentoMock.protocolo) {
      setResultado(agendamentoMock);
      setErro("");
    } else {
      setResultado(null);
      setErro("Protocolo não encontrado");
    }
  };

  return null; // interface será feita pela outra pessoa
}