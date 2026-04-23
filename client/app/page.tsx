"use client";

import Image from "next/image";

export default function Home() {
  const handlePesquisador = () => console.log("Fluxo do pesquisador");
  const handleFuncionario = () => console.log("Fluxo do funcionário");

  return (
    <div className="font-sans bg-slate-50 text-slate-900 min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="flex items-center px-6 md:px-14 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow">
              LI
            </div>
            <span className="font-bold text-sm tracking-wide">LIACLI</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative min-h-screen flex items-center px-6 md:px-14 pt-28 pb-16 overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          {/* Glow */}
          <div className="absolute -top-40 -right-40 w-125 h-125 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-125 h-125 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col xl:flex-row items-center gap-12">
            {/* Texto */}
            <article className="flex-1 max-w-lg text-center xl:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Gestão de análises clínicas
              </h1>
              <p className="text-white/80 mb-8 text-lg">
                Controle exames, acompanhe resultados e otimize o fluxo do seu
                laboratório com eficiência e segurança.
              </p>
              <div className="flex flex-wrap gap-3 justify-center xl:justify-start">
                <button
                  onClick={handlePesquisador}
                  className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30"
                >
                  Sou Pesquisador
                </button>

                <button
                  onClick={handleFuncionario}
                  className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition"
                >
                  Sou Funcionário
                </button>
              </div>
            </article>

            {/* Imagem */}
            <aside className="flex-1 w-full max-w-xl">
              <div className="relative w-full h-95 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/labratory-image.jpg"
                  alt="Laboratório de análises clínicas"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-transparent to-transparent" />
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white/40 text-center py-6 px-6 md:px-14 text-sm">
        © 2025 LIACLI — Sistema de Gestão de Análises Laboratoriais
      </footer>
    </div>
  );
}
