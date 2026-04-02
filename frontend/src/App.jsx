function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12 text-center">
        <span className="mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-300">
          BirdScan
        </span>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Descubra qual ave você está ouvindo através do canto.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Envie um áudio, receba a ave mais provável e acompanhe suas aves encontradas
          em uma interface simples, bonita e funcional.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            Enviar áudio
          </button>

          <button className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Ver aves encontradas
          </button>
        </div>
      </section>
    </main>
  )
}

export default App