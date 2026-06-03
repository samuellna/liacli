"use client";
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap" rel="stylesheet"></link>
import "./index.css";
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

  return (
    <div className="Teste">
      <header className="header">
        <h1 className="tituloHeader">Minhas Solicitações</h1>
      </header>
      <div  className="placeholder">
        <input
        type="text"
        placeholder="Digite o n° do protocolo"
        value={protocolo}
        onChange={(e)=>setProtocolo(e.target.value)}
        />
        <button onClick={handleBuscar}>Buscar</button>
      </div>

    </div>
  );
}