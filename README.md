# DiabetesSharp

App de acompanhamento para pessoas com diabetes de alta conversão — educação, controle glicêmico e adesão ao tratamento. Programa de 90 dias com funil de vendas (Advertorial → Quiz → Checkout → Upsells), pagamento via Cartpanda, e app com perguntas e respostas 24h sobre diabetes, assistente médica Sofia e área de receitas/lista de compras adaptadas para diabetes.

## Stack

- **Frontend:** React 19, TypeScript, Vite, React Router, tRPC React Query
- **Backend:** Express, tRPC, PostgreSQL
- **Pagamento:** Cartpanda (links em `shared/src/carpanda.ts`)

## Estrutura

```
neurosharp/
├── client/          # React 19 + Vite
├── server/          # Express + tRPC + PostgreSQL
├── shared/           # Tipos e links Cartpanda
└── package.json      # Workspaces
```

## Setup

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **PostgreSQL**
   - Crie um banco (ex.: `neurosharp`) e defina `DATABASE_URL`:
```bash
export DATABASE_URL="postgresql://user:pass@localhost:5432/diabetessharp"
```

3. **Rodar migração**
   ```bash
   npm run db:migrate
   ```
   (Executa `server/src/db/schema.sql`.)

4. **Cartpanda**
   - Crie os 6 produtos no Cartpanda e atualize os links em `shared/src/carpanda.ts`.
   - Configure os redirects de sucesso/skip conforme o spec.

5. **Desenvolvimento**
   ```bash
   npm run dev
   ```
   - Client: http://localhost:3000  
   - Server: http://localhost:4000  

6. **Produção**
   ```bash
   npm run build
   npm run start
   ```
   O servidor serve o client em produção a partir de `server/client-dist` (copie o build do client para lá ou configure o script de build).

## Rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Advertorial (lead nicho diabetes) |
| `/quiz` | Quiz de qualificação (tipo de diabetes, rotina, medicações) |
| `/checkout` | Checkout principal |
| `/checkout/success` | Sucesso + credenciais |
| `/login` | Login (email + senha gerada) |
| `/app/dashboard` | Dashboard (protegido) com visão geral da glicemia |
| `/app/exercises` | Educação em diabetes e Q&A 24h com Dr. AI |
| `/app/progress` | Progresso: glicemia, peso, circunferência abdominal, fotos |
| `/reviews` | Página de reviews |
| `/privacy`, `/terms`, `/refund-policy`, `/contact` | Legais e contato |
| `/affiliates` | Portal de afiliados (login + dashboard) |
| `/admin/orders` | Admin: pedidos e criar pedido de teste |
| `/admin/affiliates` | Admin: afiliados e criar afiliado |
| `/admin/support` | Admin: tickets de suporte |
| `/admin/settings` | Admin: webhook e redirects Cartpanda |

## Webhook Cartpanda

O endpoint **POST /api/cartpanda-webhook** já está implementado. Configure no Cartpanda o webhook de pagamento aprovado para:

- **URL:** `https://seu-dominio.com/api/cartpanda-webhook`
- **Corpo (JSON):** `{ "orderId": 123 }` ou `{ "order_id": 123 }`

O servidor cria o usuário (login/senha), marca o pedido como pago e preenche `generatedLogin`, para a página de sucesso exibir as credenciais.

## Variáveis de ambiente

- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — Porta do servidor (default 4000)
- `NODE_ENV` — `production` para servir o client e desabilitar detalhes de erro

## Primeiro usuário admin

Para acessar `/admin/*`, crie um usuário com role admin no PostgreSQL:

```sql
-- Troque 'admin@neurosharp.com' e 'sua_senha_segura' pelos valores desejados.
-- A senha deve ser hash bcrypt (ex.: use https://bcrypt-generator.com ou um script).
INSERT INTO users (email, password_hash, role) VALUES (
  'admin@neurosharp.com',
  '$2a$10$...',  -- hash bcrypt da senha
  'admin'
);
```

Depois faça login em `/login` com esse e-mail e senha; você será redirecionado para `/admin/orders`.

## Licença

Proprietário.
