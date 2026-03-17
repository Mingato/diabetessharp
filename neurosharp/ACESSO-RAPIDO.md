# Acesso rápido ao NeuroSharp (caminho mais fácil)

Você pode ver o site e o **app em modo demo** sem configurar banco de dados nem servidor.

---

## Passo a passo

### 1. Abrir o Terminal
- No Mac: `Cmd + Espaço`, digite **Terminal** e pressione Enter.

### 2. Entrar na pasta do projeto
```bash
cd ~/Desktop/neurosharp
```

### 3. Subir só o frontend (uma coisa só)
```bash
npm run dev:client
```

Espere aparecer algo como: **Local: http://localhost:5173/**

### 4. Abrir no navegador
- Abra o Chrome (ou Safari) e acesse: **http://localhost:5173**

---

## O que você pode ver

| Página | URL | O que é |
|--------|-----|--------|
| **Advertorial** | http://localhost:5173 | Página principal (CNN, artigo, CTAs) |
| **Quiz** | http://localhost:5173/quiz | Teste de risco cognitivo |
| **Login** | http://localhost:5173/login | Tela de login |

### Ver o app (Dashboard, Exercícios, Progresso) sem banco

1. Acesse: **http://localhost:5173/login**
2. Na caixa **“Don't have an account yet?”**, clique no botão:
   - **Enter demo mode — View app**
3. Você será levado ao **Dashboard** do app.
4. Use o menu para ir em **Exercises** e **Progress**.

No modo demo os números são de exemplo (nada é salvo em banco). Para usar com dados reais, é preciso configurar o PostgreSQL e rodar o servidor.

---

## Se der erro

- **“command not found: npm”** → Instale o Node.js em https://nodejs.org (versão LTS) e tente de novo.
- **Outro erro** → Rode primeiro `npm install` na pasta `neurosharp` e depois `npm run dev:client` de novo.
