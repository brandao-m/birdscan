import { useEffect, useState } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [foundBirds, setFoundBirds] = useState([])
  const [isLoadingFoundBirds, setIsLoadingFoundBirds] = useState(false)

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
    setSelectedFile(null)
    setAnalysisResult(null)
    setFoundBirds([])
    setMessage('')
    setError('')
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    setAnalysisResult(null)
    setError('')
    setMessage('')
  }

  async function handleAudioUpload() {
    if (!selectedFile) {
      setError('Selecione um arquivo de áudio antes de enviar')
      return
    }

    setError('')
    setMessage('')
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('http://127.0.0.1:8000/analyses/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao enviar áudio')
      }

      setAnalysisResult(data)
      setMessage('Áudio enviado e analisado com sucesso.')
      await handleLoadFoundBirds()
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao enviar o áudio')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleLoadFoundBirds() {
    setError('')
    setIsLoadingFoundBirds(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/found-birds/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao carregar aves encontradas')
      }

      setFoundBirds(data)
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao buscar aves encontradas')
    } finally {
      setIsLoadingFoundBirds(false)
    }
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
              Identifique aves por áudio e acompanhe seu histórico.
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

            <div className="mt-6 space-y-4">
              <input
                type="file"
                accept=".mp3,.wav,.ogg,.webm,audio/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-200"
              />

              {selectedFile && (
                <p className="text-sm text-slate-600">
                  Arquivo selecionado: <span className="font-medium">{selectedFile.name}</span>
                </p>
              )}

              <button
                onClick={handleAudioUpload}
                disabled={isUploading || !selectedFile}
                className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? 'Enviando...' : 'Enviar áudio'}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/40">
            <h2 className="text-xl font-semibold text-slate-900">Resultado da identificação</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              O resultado da análise aparecerá aqui após o envio do áudio.
            </p>

            {analysisResult ? (
              <div className="mt-6 space-y-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div>
                  <p className="text-sm text-slate-500">Ave mais provável</p>
                  <h3 className="text-lg font-bold text-slate-900">
                    {analysisResult.bird.common_name}
                  </h3>
                  <p className="text-sm italic text-slate-600">
                    {analysisResult.bird.scientific_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Confiança</p>
                  <p className="text-base font-semibold text-emerald-700">
                    {(analysisResult.confidence * 100).toFixed(0)}%
                  </p>
                </div>

                {analysisResult.bird.image_url && (
                  <img
                    src={analysisResult.bird.image_url}
                    alt={analysisResult.bird.common_name}
                    className="w-full rounded-2xl object-cover"
                  />
                )}

                {analysisResult.bird.description && (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Descrição</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {analysisResult.bird.description}
                    </p>
                  </div>
                )}

                {analysisResult.bird.habitat && (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Habitat</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {analysisResult.bird.habitat}
                    </p>
                  </div>
                )}

                {analysisResult.bird.diet && (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Alimentação</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {analysisResult.bird.diet}
                    </p>
                  </div>
                )}

                {analysisResult.bird.distribution && (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Distribuição</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {analysisResult.bird.distribution}
                    </p>
                  </div>
                )}

                {analysisResult.bird.curiosity && (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Curiosidade</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {analysisResult.bird.curiosity}
                    </p>
                  </div>
                )}

                {analysisResult.alternatives && (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Outras possibilidades</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {analysisResult.alternatives}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-6 text-sm text-slate-500">
                Nenhuma análise realizada ainda.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Aves encontradas</h2>
              <p className="mt-2 text-sm text-slate-600">
                Veja as aves que você já encontrou com o BirdScan.
              </p>
            </div>

            <button
              onClick={handleLoadFoundBirds}
              disabled={isLoadingFoundBirds}
              className="rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingFoundBirds ? 'Carregando...' : 'Ver coleção'}
            </button>
          </div>

          {foundBirds.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {foundBirds.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
                >
                  {item.bird.image_url && (
                    <img
                      src={item.bird.image_url}
                      alt={item.bird.common_name}
                      className="mb-4 h-48 w-full rounded-2xl object-cover"
                    />
                  )}

                  <h3 className="text-lg font-bold text-slate-900">
                    {item.bird.common_name}
                  </h3>

                  <p className="text-sm italic text-slate-600">
                    {item.bird.scientific_name}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-800">Vezes encontrada:</span>{' '}
                      {item.times_found}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Primeira vez:</span>{' '}
                      {new Date(item.first_seen_at).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Última vez:</span>{' '}
                      {new Date(item.last_seen_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-6 text-sm text-slate-500">
              Nenhuma ave encontrada carregada ainda.
            </div>
          )}
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>
    </main>
  )
}

export default App