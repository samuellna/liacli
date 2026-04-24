"use client";

import React, { useState } from "react";

// Tipos de exame mockados
const TIPOS_EXAME = [
  "Hemograma",
  "Glicose",
  "Colesterol",
  "Triglicerídeos",
  "Creatinina",
];

export default function FormularioAgendamento() {
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    quantidade: "",
    data: "",
    hora: "",
    observacoes: "",
  });

  const [examesSelecionados, setExamesSelecionados] = useState<string[]>([]);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const gerarProtocolo = () => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let resultado = "";

    for (let i = 0; i < 6; i++) {
      resultado += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    }

    return resultado;
  };

  const gerenciarMudancaExame = (exame: string) => {
    if (examesSelecionados.includes(exame)) {
      setExamesSelecionados(
        examesSelecionados.filter((e) => e !== exame)
      );
    } else {
      setExamesSelecionados([...examesSelecionados, exame]);
    }
  };

  const manipularEnvio = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !dadosFormulario.nome ||
      !dadosFormulario.email ||
      !dadosFormulario.cpf ||
      examesSelecionados.length === 0 ||
      !dadosFormulario.data ||
      !dadosFormulario.hora
    ) {
      alert(
        "Por favor, preencha todos os campos obrigatórios e selecione ao menos um exame."
      );
      return;
    }

    const novoProtocolo = gerarProtocolo();
    setProtocolo(novoProtocolo);
    setModalAberto(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Solicitação de Agendamento
        </h1>

        <form onSubmit={manipularEnvio} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                className="mt-1 w-full p-2 border rounded-md bg-white text-gray-900"
                value={dadosFormulario.nome}
                onChange={(e) =>
                  setDadosFormulario({
                    ...dadosFormulario,
                    nome: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                required
                className="mt-1 w-full p-2 border rounded-md bg-white text-gray-900"
                value={dadosFormulario.email}
                onChange={(e) =>
                  setDadosFormulario({
                    ...dadosFormulario,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CPF *
              </label>
              <input
                type="text"
                required
                className="mt-1 w-full p-2 border rounded-md bg-white text-gray-900"
                value={dadosFormulario.cpf}
                onChange={(e) =>
                  setDadosFormulario({
                    ...dadosFormulario,
                    cpf: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone (Opcional)
              </label>
              <input
                type="tel"
                className="mt-1 w-full p-2 border rounded-md bg-white text-gray-900"
                value={dadosFormulario.telefone}
                onChange={(e) =>
                  setDadosFormulario({
                    ...dadosFormulario,
                    telefone: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tipos de Exame *
            </label>

            <div className="grid grid-cols-2 gap-2">
              {TIPOS_EXAME.map((exame) => (
                <label
                  key={exame}
                  className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600"
                    checked={examesSelecionados.includes(exame)}
                    onChange={() => gerenciarMudancaExame(exame)}
                  />
                  <span className="text-sm text-gray-600">
                    {exame}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Qtd Amostras *
              </label>
              <input
                type="number"
                min="1"
                required
                className="mt-1 w-full p-2 border rounded-md bg-white text-gray-900"
                value={dadosFormulario.quantidade}
                onChange={(e) =>
                  setDadosFormulario({
                    ...dadosFormulario,
                    quantidade: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data *
              </label>
              <input
                type="date"
                required
                className="mt-1 w-full p-2 border rounded-md bg-white text-gray-900"
                value={dadosFormulario.data}
                onChange={(e) =>
                  setDadosFormulario({
                    ...dadosFormulario,
                    data: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora *
              </label>
              <input
                type="time"
                required
                className="mt-1 w-full p-2 border rounded-md bg-white text-gray-900"
                value={dadosFormulario.hora}
                onChange={(e) =>
                  setDadosFormulario({
                    ...dadosFormulario,
                    hora: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              className="mt-1 w-full p-2 border rounded-md bg-white text-gray-900"
              rows={3}
              value={dadosFormulario.observacoes}
              onChange={(e) =>
                setDadosFormulario({
                  ...dadosFormulario,
                  observacoes: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Agendar
          </button>
        </form>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Sucesso!
            </h2>

            <p className="text-gray-600 mb-6">
              Sua solicitação foi enviada.
            </p>

            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <span className="text-sm text-gray-500 uppercase block font-medium">
                Protocolo
              </span>

              <span className="text-3xl font-mono font-bold text-blue-600">
                {protocolo}
              </span>
            </div>

            <button
              onClick={() => setModalAberto(false)}
              className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}