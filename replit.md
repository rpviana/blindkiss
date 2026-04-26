# blindkiss

Site oficial da banda **blindkiss** (Porto, Portugal). Estética rua / fanzine / armazém industrial. Tema de pergaminho claro (#dddad3), títulos sangue (#910802), texto cinza-quente (#7d7573).

## Estrutura
Monorepo pnpm com 3 artefactos:
- **artifacts/api-server** (Node + Express): API REST em `/api/*`. Drizzle + Postgres. Auth por cookie HMAC.
- **artifacts/frontend** (React + Vite): site público + backoffice em `/admin`.
- **artifacts/mockup-sandbox**: ambiente para previews de componentes.

Bibliotecas partilhadas:
- `lib/api-spec`: OpenAPI 3.1 (fonte da verdade).
- `lib/api-client-react`, `lib/api-zod`: gerados via codegen a partir do OpenAPI.
- `lib/db`: schemas Drizzle (events, bkid_members, site_settings, content_blocks, tracks, admins).

## Páginas
- `/` Home — logo lábios+olho que segue o cursor, tagline, recrutamento WANTED, bio/manifesto, leitor cassete.
- `/archive` — eventos próximos / passados.
- `/bk-id` — formulário de adesão, gera serial `BK-YYYY-NNN` e cartão descarregável (html-to-image).
- `/admin` — login (default: `admin` / `blindkiss`), backoffice CMS: cores, glitch, recrutamento, eventos, membros, blocos de conteúdo, faixas.

## Variáveis de ambiente
- `DATABASE_URL` (postgres) — provisionado.
- `SESSION_SECRET` — para assinar cookies de sessão admin.

## Comandos chave
- `pnpm typecheck` — typecheck monorepo.
- `pnpm --filter @workspace/db run push` — aplicar schema à DB.
- `pnpm --filter @workspace/api-spec run codegen` — regenerar clients/schemas após editar OpenAPI.

## Notas
- Fotos (cartões BK-ID, posters de eventos) são guardadas como dataURL base64 em colunas TEXT (sem object storage no plano free).
- Cores aplicadas dinamicamente via CSS vars no `<html>` por `SettingsProvider`.
- Glitch mode ativa classe global no `<body>`.
- Seed automático corre no arranque do servidor: cria settings padrão, admin, blocos de conteúdo, 1 faixa demo e 3 eventos exemplo.
