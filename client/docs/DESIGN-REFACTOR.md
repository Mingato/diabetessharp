# Refatoração de UI/UX — DiabetesSharp

## 1. DIAGNÓSTICO

### Estado atual
O Design System em `index.css` já segue boa parte dos princípios HIG (tokens semânticos, escala 4/8px, sombras suaves, `prefers-reduced-motion`). Ainda assim, a interface não atinge um padrão de excelência por:

**Tipografia**
- Hierarquia em algumas telas usa apenas tamanho (ex.: `text-sm` para títulos de card) sem contraste claro de peso/opacidade entre título, corpo e metadado.
- Letter-spacing editorial (`--tracking-heading`) existe mas não é aplicado de forma consistente nos títulos de seção.
- Line-height generoso (1.5 corpo, 1.2 títulos) está definido, porém blocos de texto às vezes usam `leading-relaxed` sem padrão único para corpo longo.

**Espaçamento**
- Uso misto de valores Tailwind (`p-4 sm:p-6`, `gap-3 sm:gap-4`) e tokens CSS (`var(--space-6)`); falta de padronização em seções (ex.: entre bloco de métricas e cards).
- Área de conteúdo principal não tem `max-width` explícito para leitura ideal (≈ 65–72 caracteres); `max-w-4xl` no main é grande para texto corrido.
- Alguns elementos interativos no mobile (Theme/Text size) usam `min-h-[40px]` em vez do mínimo HIG de 44px.

**Cores e sombras**
- Paleta semântica está correta; bordas às vezes usam `--color-border` (legacy) em vez de `--color-border-subtle`/`--color-border-default`.
- Cards e stat-cards já usam sombras suaves; em alguns componentes ainda aparece `shadow-lg` genérico (ex.: logo no sidebar) que pode ser substituído por token de elevação.

**Micro-interações**
- Vários componentes usam `transition-all` (ExercisesPage, SofiaPage, PhotosPage, NutritionPage, LearnPage, DrMarcusPage, AppLayout), o que viola a regra de animar apenas `transform` e `opacity` para performance e previsibilidade.
- Durações hardcoded (`duration-200`, `duration-300`) em vez de variáveis (`--duration-normal`, `--duration-slow`).
- Hover em cards (glass-card) está bom; em list items e botões secundários falta às vezes `translateY(-1px)` ou elevação de sombra explícita.

**Componentes**
- **Stat card:** no HTML o `.value` vem antes do `.label`; visualmente a ordem está invertida (label em cima) via CSS, mas a ordem no DOM e leitores de tela fica confusa; além disso o `.label` usa `margin-top` quando deveria estar acima do value com `margin-bottom` no label.
- **Botões:** primários estão sólidos e com hover correto; links “Open Q&A →” usam `hover:underline` mas poderiam ter transição de opacidade/underline mais refinada.
- **Navegação:** sidebar e bottom nav têm focus-visible; indicador ativo no bottom nav (barra no topo) poderia ter transição de opacidade/scale ao trocar de rota.
- **Inputs:** já têm 44px e focus ring; falta documentar uso de `--shadow-focus` como ring consistente (3px accent com opacidade).

**Acessibilidade**
- Contraste de texto secundário/terciário no dark deve ser verificado (WCAG AA 4.5:1 para texto normal).
- `aria-live` no banner de demo está correto; cards de tarefas poderiam ter `aria-label` no conjunto “Today’s program” e contador “X of Y done” com `aria-live="polite"` se forem atualizados dinamicamente.
- Navegação por teclado funciona; falta garantir que modais e listas longas tenham foco preso e Escape para fechar onde aplicável.

**Ruído visual**
- Emojis em títulos (🩸, 📊, 🏆) são decorativos; devem ter `aria-hidden` e não substituir texto acessível.
- Bordas duplas (card + inner list item com borda) em “Today’s program” podem ser reduzidas a apenas divisores ou fundo sutil no item.

---

## 2. PLANO DE REFATORAÇÃO

### Tipografia
- Aplicar `letter-spacing: var(--tracking-heading)` em todos os títulos de seção (h2/h3) dentro do app.
- Padronizar níveis: **nível 1** = `font-display`, `text-xl`/`text-2xl`, `font-bold`; **nível 2** = `text-base`/`text-lg`, `font-semibold`; **nível 3** = `text-sm`/`text-xs`, `color-text-secondary`/`tertiary`.
- Corpo de texto: `text-sm` ou `text-base` com `leading-relaxed` (1.625) e cor `--color-text-secondary` para descrições.

### Espaçamento
- Substituir valores arbitrários por tokens: `--space-4` a `--space-8` entre seções; `--space-3`/`--space-4` entre elementos relacionados; `--space-6`/`--space-8` entre grupos principais.
- Garantir `min-height: 44px` (ou `var(--touch-min)`) em todos os controles interativos no mobile.
- Definir `max-width` para conteúdo textual longo (ex.: 680px) onde fizer sentido, mantendo `max-w-4xl` no main para o layout geral.

### Cores e sombras
- Padronizar bordas em `--color-border-subtle` (default) e `--color-border-default` (hover/strong).
- Remover `shadow-lg` genérico do logo; usar `--shadow-elevation-low` ou `mid`.
- Garantir que estados de foco usem `--shadow-focus` (0 0 0 3px accent/soft).

### Micro-interações
- Trocar todos os `transition-all` por transições explícitas: `transform`, `opacity`, `box-shadow`, `border-color`, `color` com duração `var(--duration-normal)` e `var(--ease-spring)` ou `var(--ease-out)`.
- Usar `transition` do design system (já definido em CSS) nos componentes base (glass-card, btn, stat-card).
- Bottom nav indicador ativo: animar com `opacity` + `transform` ao mudar de rota.

### Componentes
- **Stat card:** reordenar DOM para `label` → `value`; ajustar estilo para label em cima (font-size terciário, margin-bottom) e value como destaque.
- **Cards de tarefa (Dashboard):** reduzir borda dupla; usar apenas fundo `--color-surface-hover` com border-radius e padding generoso; botão CTA com área de toque 44px.
- **Links de ação:** transição de `opacity` e `text-decoration` em 200ms; focus-visible com ring 3px.
- **Navegação:** manter 44px em itens; adicionar transição no indicador ativo (underline/pill).

### Acessibilidade
- Revisar contraste de `--color-text-secondary` e `--color-text-tertiary` no tema dark (e light) para ≥ 4.5:1 (normal) e ≥ 3:1 (large).
- Adicionar `aria-label` em seções (ex.: “Today’s program, 2 of 4 tasks completed”); manter `aria-hidden` em emojis decorativos.
- Garantir que todos os botões e links tenham `focus-visible:ring` com token do design system.
- Manter e reforçar `prefers-reduced-motion` em animações.

---

## 3. CÓDIGO REFATORADO

*(Implementado em `index.css`, `Dashboard.tsx` e ajustes pontuais em `AppLayout.tsx` e outros arquivos referenciados no plano.)*

---

## 4. JUSTIFICATIVA DE DESIGN

- **Hierarquia tipográfica (HIG):** Títulos com peso e letter-spacing distintos reduzem carga cognitiva e guiam o olhar; no máximo 3 níveis por seção evita ruído e segue o princípio de clareza.
- **Espaçamento generoso (White space):** Múltiplos de 8px e seções bem separadas melhoram escaneabilidade e sensação de qualidade (Lei de Hick: menos elementos por bloco).
- **Touch 44px (Apple HIG):** Áreas de toque mínimas reduzem erros de clique e atendem a usuários com mobilidade reduzida.
- **Transições explícitas (Performance):** Animar apenas `transform` e `opacity` (e em menor grau `box-shadow`/`border-color`) mantém 60fps e evita reflow; `transition-all` é custoso e imprevisível.
- **Contraste e focus (WCAG):** Contraste adequado e focus visível garantem usabilidade para baixa visão e navegação por teclado, alinhados a a11y e HIG.
- **Redução de bordas e sombras pesadas:** Um único nível de elevação (sombra suave + borda sutil) por card evita aparência “pesada” e mantém profundidade legível (Design Systems 2025).
- **Motion reduzido:** Respeitar `prefers-reduced-motion` é inclusivo e obrigatório em guidelines de acessibilidade.
