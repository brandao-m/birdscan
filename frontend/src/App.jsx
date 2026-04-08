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
      <main className="min-h-screen bg-emerald-50 text-slate-900">
        <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 shadow-2xl shadow-emerald-100/40">
            <div className="text-center">
              <span className="mb-4 inline-block rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
                BirdScan
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                Entrar
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Acesse sua conta para enviar áudios, identificar aves e acompanhar
                suas aves encontradas.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
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
                  className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
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
                  className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Entrando...' : 'Entrar no BirdScan'}
              </button>
            </form>

            {message && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-emerald-50 text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12">
        <header className="flex flex-col gap-4 border-b border-emerald-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-block rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
              BirdScan
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              Olá, {currentUser?.name}
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Envie um áudio para identificar uma ave e acompanhe suas aves encontradas.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-100"
          >
            Sair
          </button>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/40">
            <h2 className="text-xl font-semibold text-slate-900">Enviar áudio</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Faça o upload do canto da ave para receber a identificação mais provável.
            </p>

            <button className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
              Escolher áudio
            </button>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/40">
            <h2 className="text-xl font-semibold text-slate-900">Aves encontradas</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Veja o histórico das aves que você já encontrou no BirdScan.
            </p>

            <button className="mt-6 rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-100">
              Ver coleção
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App