# Refatoração de Interface — NeuroSharp  
## Padrão Apple HIG & Design Systems 2025/2026

---

## 1. DIAGNÓSTICO

### Estado atual da interface

A interface parte de uma base funcional (tema escuro, accent dourado, componentes reutilizáveis), mas falha em transmitir **qualidade premium** e aderência a guidelines de alto padrão.

**Tipografia**
- Hierarquia pouco clara: uso de `text-sm` e `text-lg` sem escala consistente; faltam níveis bem definidos (título vs corpo vs metadado).
- Letter-spacing apenas em `.font-display`; títulos grandes sem ajuste editorial (-0.02em a -0.04em).
- Line-height genérico (1.6 no body); sem distinção entre títulos (1.2) e corpo (1.5+).

**Espaçamento**
- Padding e margens irregulares (ex.: `p-3`, `p-4`, `mb-6`) sem sistema baseado em múltiplos de 4/8px.
- Cards e listas com pouco “respiro” (ex.: `p-4`, `gap-3`), gerando sensação de aperto.
- Áreas de toque em alguns botões (ex.: “A”, “A+”, links) abaixo do mínimo recomendado de 44px.

**Cores e sombras**
- Sombras fortes (`0 2px 12px rgba(0,0,0,0.3)`) que parecem “pesadas” e não suaves.
- Falta de níveis de elevação (baixa/média/alta) com opacidade reduzida e blur.
- Tokens de cor úteis, mas sem nomenclatura semântica (surface-primary, text-secondary, etc.).

**Micro-interações**
- Transições com `transition-all` ou duração única; sem especificação de propriedades (transform, opacity, box-shadow).
- Hover em cards com `translateY(-2px)` sem curva de easing consistente (ex.: cubic-bezier tipo “spring”).
- Loading com spinner genérico em vez de skeleton com shimmer.

**Componentes**
- Botões com `min-height: 44px` em parte dos casos; links e botões de tema com área de toque pequena.
- Cards com borda + sombra marcadas ao mesmo tempo; border-radius variável sem escala definida.
- Inputs com focus adequado (ring), mas sem tokens de duração/easing padronizados.

**Acessibilidade**
- Falta de `focus-visible` explícito com ring na cor do accent em vários controles (nav, theme, font size).
- Poucos `aria-label` e `aria-pressed` em botões de tema e itens de navegação.
- Ausência de `prefers-reduced-motion`: animações continuam ativas para quem prefere menos movimento.

**Resumo:** A interface funciona, mas soa genérica: espaçamento apertado, tipografia sem hierarquia clara, sombras duras, transições pouco refinadas e acessibilidade incompleta. Não comunica o nível de um produto “artesanal” de estúdio de design.

---

## 2. PLANO DE REFATORAÇÃO

### Tipografia
- Introduzir escala fluida: 12 / 14 / 16 / 20 / 24 / 32 / 48px com variáveis CSS (`--text-xs` a `--text-3xl`).
- Definir line-height por uso: 1.2 (títulos), 1.5 (corpo), 1.625 (corpo relaxado).
- Aplicar letter-spacing negativo em títulos (`--tracking-heading`, `--tracking-heading-lg`).
- Limitar a 3 níveis visuais por seção (título, corpo, metadado) usando peso, tamanho e opacidade.

### Espaçamento
- Adotar grid de 8px: 4, 8, 12, 16, 24, 32, 48, 64, 96px (`--space-1` a `--space-24`).
- Aumentar padding em cards (24–32px), gaps entre seções (24–32px) e entre itens de lista (16–24px).
- Garantir mínimo 44×44px em todos os alvos de toque (botões, links de nav, theme, font size).

### Cores e sombras
- Criar tokens semânticos: `--color-surface-primary`, `--color-surface-elevated`, `--color-text-primary/secondary/tertiary`, `--color-border-subtle`, `--color-accent`.
- Substituir sombras fortes por elevações suaves e difusas (opacidade 0.04–0.08).
- Manter accent vibrante apenas em CTAs e estados ativos; superfícies em tons neutros/dessaturados.

### Micro-interações
- Transições apenas em `transform`, `opacity`, `box-shadow`, `border-color` (150–300ms).
- Curvas: `cubic-bezier(0.25, 1, 0.5, 1)` para sensação “spring”; evitar `transition: all`.
- Hover em cards: `translateY(-1px)` ou `-2px` + elevação de sombra.
- Substituir spinner por skeleton com animação de shimmer.

### Componentes
- Botões: border-radius 8–12px, padding 12px 24px mínimo, focus-visible com ring no accent.
- Cards: border-radius 12–16px, borda 1px sutil, padding 24–32px; não combinar borda forte com sombra forte.
- Nav: item ativo com transição suave; sidebar/header com `backdrop-filter: blur(20px) saturate(180%)`.
- Inputs: min-height 44px, focus com ring 3px no accent.

### Acessibilidade
- Contraste mínimo 4.5:1 (texto normal) e 3:1 (texto grande) — WCAG AA.
- Focus visível em todos os interativos: `focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]` + offset.
- ARIA: `aria-label` em ícones de ação, `aria-pressed` em toggles, `aria-current` onde fizer sentido, `role="main"` e `role="banner"`.
- Respeitar `prefers-reduced-motion`: desativar ou reduzir animações quando o usuário preferir.

---

## 3. CÓDIGO REFATORADO

O código foi aplicado nos seguintes arquivos:

- **`src/index.css`** — Design system: tokens semânticos (surfaces, text, borders, accent), escala tipográfica e de espaçamento, sombras suaves (elevation low/mid/high), transições com propriedades e curvas definidas, `prefers-reduced-motion`, skeleton com shimmer, classes `.glass-card`, `.stat-card`, `.btn`, `.input-field` atualizadas.
- **`src/components/AppLayout.tsx`** — Sidebar e header com glassmorphism (`backdrop-blur`, `backdrop-saturate`), espaçamento em grid de 8px, `SidebarNavLink` e `BottomNavItem` com `focus-visible` e `aria-label`/estados; botões de tema com `aria-pressed` e área de toque 44px; `role="banner"` e `role="main"`.
- **`src/pages/app/Dashboard.tsx`** — Componente `DashboardSkeleton` com shimmer no lugar do spinner; uso de `stat-card` e hierarquia tipográfica (título, corpo, terciário); espaçamento aumentado (`space-y-8`, `gap-4`/`gap-6`, `p-6`); links e botões com `min-h-[44px]` e `focus-visible`; `aria-hidden` em ícones decorativos e `role="list"` na lista de tarefas.

---

## 4. JUSTIFICATIVA DE DESIGN

**Hierarquia e minimalismo (Apple HIG)**  
Cada seção passa a ter no máximo 3 níveis visuais (título, corpo, metadado), reduzindo ruído e facilitando a varredura visual. O uso de peso, tamanho e opacidade (e não só tamanho) segue a recomendação do HIG de criar hierarquia clara sem excesso de elementos.

**Espaço em branco e grid (Fitts, legibilidade)**  
Mais padding e margens previsíveis (múltiplos de 8px) aumentam a legibilidade e a sensação de “respiro”. Áreas de toque mínimas de 44px melhoram a usabilidade em mobile e reduzem erros de clique (Lei de Fitts).

**Sombras e profundidade**  
Sombras suaves e difusas (opacidade baixa) comunicam elevação sem parecer “pesadas”, alinhadas a design systems atuais (Material 3, Apple). Evitar borda forte + sombra forte no mesmo elemento reduz competição visual.

**Motion e feedback (Jakob, feedback imediato)**  
Transições limitadas a `transform` e `opacity` mantêm performance (GPU) e sensação de fluidez. Curvas tipo spring (e.g. `cubic-bezier(0.25, 1, 0.5, 1)`) dão feedback “vivo” sem exagero. Skeleton em vez de spinner melhora a percepção de velocidade (usuário vê estrutura da tela enquanto carrega).

**Acessibilidade e inclusão**  
Focus visível e ARIA corretos garantem uso por teclado e leitores de tela. `prefers-reduced-motion` respeita preferências de usuários sensíveis a movimento. Contraste adequado (tokens primary/secondary/tertiary) atende WCAG AA.

**Resultado**  
A interface passa a transmitir coerência, respiro e atenção ao detalhe — alinhada a um produto de estúdio de design de alto padrão, sem parecer genérica ou “gerada por IA”.
