# 🐦 BirdScan

Aplicação full-stack que identifica aves a partir do canto enviado pelo usuário, retornando a espécie mais provável junto com informações detalhadas e histórico de descobertas.

---

## 🚀 Sobre o projeto

O **BirdScan** foi desenvolvido com o objetivo de simular uma experiência real de identificação de aves por áudio.

O usuário envia um arquivo de som, o sistema realiza a análise (simulada neste MVP) e retorna:

- a ave mais provável  
- nível de confiança  
- informações completas sobre a espécie  
- histórico das aves já encontradas  

---

## 🧠 Funcionalidades

- 🔐 Autenticação com JWT  
- 📤 Upload de áudio autenticado  
- 🧩 Identificação simulada de aves  
- 📊 Exibição de resultado com:
  - nome popular  
  - nome científico  
  - imagem  
  - descrição  
  - habitat  
  - alimentação  
  - distribuição  
  - curiosidade  
  - nível de confiança  
  - alternativas possíveis  
- 🗂 Histórico de aves encontradas por usuário  
- 🔄 Atualização automática da coleção após nova identificação  
- 💾 Persistência de sessão no frontend  

---

## 🛠️ Tecnologias utilizadas

### Backend
- Python  
- FastAPI  
- SQLModel  
- PostgreSQL  
- JWT (autenticação)  

### Frontend
- React  
- Vite  
- Tailwind CSS  

---

## 📂 Estrutura do projeto

```
birdscan/
backend/
    app/
        api/
        core/
        db/
        models/
        schemas/
        services/
        main.py
    uploads/

frontend/
    src/
        App.jsx
        index.css
```

---

## ⚙️ Como rodar o projeto

### 🔹 Backend

```
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn app.main:app --reload
```
### Backend disponível em:
```
http://127.0.0.1:8000
```
### Swagger:
```
http://127.0.0.1:8000/docs
```

---

### 🔹 Frontend
```
cd frontend

npm install
npm run dev
```
### Frontend disponível em:
```
http://localhost:5173
```

---

🔑 Fluxo da aplicação
1. Usuário realiza login
2. Seleciona um arquivo de áudio
3. Envia o áudio para o backend
4. O sistema retorna a ave mais provável
5. As informações da ave são exibidas
6. A ave é adicionada automaticamente à coleção do usuário

---

🧪 Observação importante

A identificação de aves neste projeto é simulada.

A lógica atual seleciona uma ave aleatória do banco de dados para representar o resultado da análise.

O projeto foi estruturado para permitir integração futura com modelos reais de reconhecimento de áudio (ex: BirdNET).

---

### Autor

Marcus Brandão
Desenvolvedor Backend 

GitHub: https://github.com/brandao-m

