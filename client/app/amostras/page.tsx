"use client";

const amostrasMock = [
  {
    codigo: "AM001",
    exame: "Glicose",
    protocolo: "A1B2C3",
    pesquisador: "João Silva",
    data: "2026-05-10",
    status: "Em análise",
  },
  {
    codigo: "AM002",
    exame: "Hemograma",
    protocolo: "D4E5F6",
    pesquisador: "Maria Souza",
    data: "2026-05-08",
    status: "Concluído",
  },
  {
    codigo: "AM003",
    exame: "Hemograma",
    protocolo: "D4E5F6",
    pesquisador: "Maria Souza",
    data: "2026-05-08",
    status: "Pendente",
  },
];

export default function AmostrasPage() {
  function getStatusClass(status: string) {
    if (status === "Pendente") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Em análise") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Concluído") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Amostras</h1>

          <span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
            {amostrasMock.length} amostras
          </span>
        </div>
      </header>

      <section className="px-8 py-10">
        <h2 className="mb-6 text-3xl font-bold text-slate-900">
          Registro de Amostras
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Código
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Exame
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Protocolo
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pesquisador
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ação
                </th>
              </tr>
            </thead>

            <tbody>
              {amostrasMock.map((amostra) => (
                <tr
                  key={amostra.codigo}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {amostra.codigo}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {amostra.exame}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {amostra.protocolo}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {amostra.pesquisador}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {amostra.data}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        amostra.status
                      )}`}
                    >
                      {amostra.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <button
                      type="button"
                      onClick={() =>
                        console.log(
                          `Cadastrar resultado da amostra ${amostra.codigo}`
                        )
                      }
                      className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
                    >
                      Cadastrar resultado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}