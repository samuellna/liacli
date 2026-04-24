"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function DashboardClient({ data }: any) {
  const params = useSearchParams();
  const router = useRouter();

  const statusFiltro = params.get("status");

  const listaFiltrada = statusFiltro
    ? data.solicitacoes.filter((s: any) => s.status === statusFiltro)
    : data.solicitacoes;

  // 🔁 toggle filtro
  function handleFilter(status: string) {
    if (statusFiltro === status) {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard?status=${status}`);
    }
  }

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">

      {/* VOLTAR + FILTRO ATIVO */}
      {statusFiltro && (
        <div className="flex items-center gap-4 mb-2">

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <p className="text-sm text-gray-600">
            Filtro ativo: <strong>{statusFiltro}</strong>
          </p>

        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card title="Pendentes" value={data.cards.pendentes} />
        <Card title="Em análise" value={data.cards.analise} />
        <Card title="Concluídas" value={data.cards.concluidas} />
        <Card title="Taxa" value={`${data.cards.taxa}%`} />

      </div>

      {/* TABELA + LATERAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* TABELA */}
        <div className="lg:col-span-2 bg-white border border-blue-100 p-4 rounded-2xl shadow-sm">

          <h2 className="font-semibold mb-4 text-blue-900">
            Solicitações
          </h2>

          <table className="w-full text-sm">
            <thead className="text-gray-700 font-semibold text-left">
              <tr>
                <th className="py-2">Protocolo</th>
                <th>Pesquisador</th>
                <th>Tipo</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {listaFiltrada.map((item: any) => (
                <Row key={item.protocolo} {...item} />
              ))}
            </tbody>
          </table>

        </div>

        {/* LATERAL */}
        <div className="bg-white border border-blue-100 p-4 rounded-2xl shadow-sm">

          <h2 className="font-semibold mb-4 text-blue-900">
            Filtrar por Status
          </h2>

          <Progress label="Pendentes" value={data.cards.pendentes} onClick={handleFilter} active={statusFiltro} />
          <Progress label="Em análise" value={data.cards.analise} onClick={handleFilter} active={statusFiltro} />
          <Progress label="Concluídas" value={data.cards.concluidas} onClick={handleFilter} active={statusFiltro} />

        </div>

      </div>
    </div>
  );
}

// 🧩 CARD
function Card({ title, value }: any) {
  return (
    <div className="bg-white border border-blue-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition">
      <p className="text-blue-600 text-sm font-medium">{title}</p>
      <h2 className="text-3xl font-bold text-blue-900">{value}</h2>
    </div>
  );
}

// 🧩 ROW
function Row({ protocolo, pesquisador, tipo, status }: any) {
  return (
    <tr className="border-t text-gray-900 hover:bg-gray-50">

      <td className="py-3 font-semibold">{protocolo}</td>
      <td>{pesquisador}</td>
      <td>{tipo}</td>

      <td>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          {status}
        </span>
      </td>

    </tr>
  );
}

// 🧩 PROGRESS
function Progress({ label, value, onClick, active }: any) {
  const isActive = active === label;

  return (
    <div
      onClick={() => onClick(label)}
      className={`mb-4 cursor-pointer transition ${
        isActive ? "scale-[1.02]" : ""
      }`}
    >
      <div className="flex justify-between text-sm mb-1">
        <span className={isActive ? "text-blue-700 font-bold" : "text-gray-600"}>
          {label}
        </span>
        <span className="font-semibold text-blue-700">{value}</span>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className={`h-2 rounded-full ${
            isActive ? "bg-blue-800" : "bg-blue-600"
          }`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}