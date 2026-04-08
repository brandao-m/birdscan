import { useEffect, useState } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('birdscan_token')
    const savedUser = localStorage.getItem('birdscan_user')

    if (savedToken) {
      setToken(savedToken)
    }

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  async function handleLogin(event) {
    event.preventDefault()

    setMessage('')
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao fazer login')
      }

      localStorage.setItem('birdscan_token', data.access_token)

      const userData = {
        user_id: data.user_id,
        name: data.name,
        email: data.email,
      }

      localStorage.setItem('birdscan_user', JSON.stringify(userData))

      setToken(data.access_token)
      setCurrentUser(userData)
      setMessage('')
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.message || 'Ocorreu um erro inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('birdscan_token')
    localStorage.removeItem('birdscan_user')

    setToken('')
    setCurrentUser(null)
    setMessage('')
    setError('')
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
            <div className="text-center">
              <span className="mb-4 inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-300">
                BirdScan
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight">
                Entrar
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Acesse sua conta para enviar áudios, identificar e acompanhar
                suas aves encontradas.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-200"
                  htmlFor="email"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-200"
                  htmlFor="password"
                >
                  Senha
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Entrando...' : 'Entrar no BirdScan'}
              </button>
            </form>

            {message && (
              <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-300">
              BirdScan
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              Olá, {currentUser?.name}
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Envie um áudio para identificar uma ave e acompanhe suas aves encontradas.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sair
          </button>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold">Enviar áudio</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Faça o upload do canto da ave para receber a identificação mais provável.
            </p>

            <button className="mt-6 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
              Escolher áudio
            </button>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold">Aves encontradas</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Veja o histórico das aves que você já encontrou no BirdScan.
            </p>

            <button className="mt-6 rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Ver coleção
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App