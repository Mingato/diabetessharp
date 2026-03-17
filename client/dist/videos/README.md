# Vídeos dos exercícios de memória (NeuroSharp)

Coloque aqui **os seus próprios vídeos** para cada exercício. Assim o app fica 100% seu, sem depender do YouTube.

## Nomes dos arquivos

Use o **id** do exercício como nome do arquivo. Formatos aceitos:

| Exercício        | Nome do arquivo      |
|------------------|----------------------|
| Memory Palace    | `memory_palace.mp4`  |
| Chunking         | `chunking.mp4`      |
| Dual N-Back      | `dual_nback.mp4`    |
| Spaced Repetition| `spaced_repetition.mp4` |
| Story Chain      | `story_chain.mp4`   |
| Mindfulness Recall | `mindfulness_recall.mp4` |
| Name & Face      | `name_face.mp4`     |
| Number–Shape    | `number_shape.mp4`  |
| Recall After Reading | `recall_after_reading.mp4` |
| Speed Cards      | `speed_cards.mp4`   |

Você pode usar **MP4** (recomendado) ou **WebM**. Exemplo: `memory_palace.mp4` ou `memory_palace.webm`.

## Como gravar

- Vídeos curtos (1–3 min) mostrando **como fazer** o exercício.
- Pode ser você explicando, telas com passos ou animações.
- Resolução sugerida: 720p ou 1080p.
- Se o arquivo não existir, o app mostra um aviso “Your video here” com o nome do arquivo esperado.

## Gerar vídeos placeholder (opcional)

Se tiver **ffmpeg** instalado, pode gerar vídeos placeholder com o nome do exercício na tela:

```bash
# Na raiz do projeto neurosharp
node scripts/generate-placeholder-videos.js
```

Isso cria um MP4 simples para cada exercício em `client/public/videos/`. Depois é só substituir pelos seus vídeos reais.
