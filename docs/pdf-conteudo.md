# Conteúdo para o PDF da Atividade

> Cole este conteúdo em um editor (Word/Google Docs) e exporte como PDF.
> Substitua os campos **<RM>** e **<NOME COMPLETO>**.

---

## Atividade Substitutiva · Global Solution

**Aluno:** Rafael Santos
**RM:** 560567

---

## 1. Descrição da plataforma

O **VisitFlow Imob** é uma plataforma integrada de gestão de visitas imobiliárias, criada para ajudar corretores e gerentes a organizarem roteiros de atendimento, acompanharem visitas agendadas e qualificarem clientes após cada saída.

A solução é composta por **app mobile**, **interface web** e **backend com API REST**. O app mobile é utilizado pelo corretor para consultar a agenda, visualizar roteiros, confirmar visitas e responder o quiz pós-visita. A interface web é utilizada pelo gerente para acompanhar indicadores, visualizar a equipe, analisar visitas e identificar clientes quentes.

### Para quem serve
Imobiliárias, equipes comerciais, corretores autônomos e gerentes que precisam controlar visitas imobiliárias de forma mais organizada e visual.

### Problema resolvido
A dificuldade de controlar visitas com múltiplos imóveis, principalmente quando um mesmo cliente visita diversas opções antes de decidir. A plataforma centraliza agenda, roteiro, imóveis, status, feedback e qualificação do cliente.

## 2. Justificativa do tema

O tema representa uma necessidade real do mercado imobiliário. Corretores lidam diariamente com diferentes clientes, imóveis, horários e retornos de atendimento. Quando uma visita envolve vários imóveis, o controle das informações se torna confuso sem um sistema centralizado para registrar o roteiro, confirmar a visita e qualificar o interesse do cliente. A plataforma resolve isso integrando app mobile, web e backend, permitindo que o corretor atualize as visitas durante a rotina e que o gerente tenha uma visão administrativa da equipe.

## 3. Justificativa de design e experiência do usuário

### Identidade visual
A identidade adota o conceito **"corretor premium / planta arquitetônica"**, traduzindo o universo
imobiliário de alto padrão (plantas baixas, roteiros em mapa e listagens premium). O elemento de
assinatura é o **roteiro de visita** representado como uma rota com pinos numerados — exatamente o que
o corretor percorre ao visitar vários imóveis com o mesmo cliente. Uma textura sutil de grade (tipo
planta baixa) reforça o tema na tela de login e na barra lateral. O resultado é uma interface baseada
em cards, com foco em produtividade (referências de Trello, Asana, Monday e ClickUp), porém com
personalidade própria que evita uma aparência genérica.

### Paleta de cores
| Cor | Hex | Uso |
|---|---|---|
| Verde-esmeralda profundo | `#0E3B2E` | Barra lateral, títulos, textos e ações primárias |
| Latão / ouro | `#C99A2E` | Acento de assinatura: item ativo, estrelas, cliente quente, pinos do roteiro |
| Areia / ouro claro | `#E8D8A8` | Badges e destaques suaves |
| Sage claro | `#ECEFE8` | Fundo geral da plataforma |
| Branco | `#FFFFFF` | Cards e áreas de leitura |
| Terracota / Vermelho | `#C2603F` / `#B23A2E` | Proposta em andamento / cancelamento |

O esmeralda transmite solidez e confiança (associado a valor e patrimônio); o latão/ouro evoca o
padrão "imóvel premium" e guia o olhar para as ações e oportunidades mais importantes; o sage claro dá
um fundo leve e sofisticado, distinto dos fundos neutros usuais; terracota e vermelho comunicam,
respectivamente, negociação em curso e cancelamento.

### Tipografia
- **Bricolage Grotesque** (display) — títulos e logotipo, conferindo um caráter arquitetônico e
  contemporâneo, usada com restrição.
- **Inter** (corpo) — leitura limpa e legível na interface.
- **JetBrains Mono** (dados) — números, preços, datas e métricas, reforçando precisão e leitura tabular.

### Navegação
Simples, com poucos níveis, botões claros e foco na produtividade. Na web, sidebar fixa com as seções principais; no mobile, navegação por abas (Início, Agenda, Quentes, Perfil).

### Acessibilidade
Contraste adequado, botões grandes, labels claros, ícones com texto, feedback visual após ações, HTML semântico e navegação por teclado na web.

## 4. Arquitetura técnica

A arquitetura possui três camadas: **app mobile**, **interface web** e **backend**. O app mobile e a web consomem a **mesma API REST**, disponibilizada pelo backend (Next.js Route Handlers). O backend autentica usuários (JWT), controla permissões por perfil, registra visitas, calcula notas e fornece dados para o dashboard.

- **Como o app se integra ao backend:** o app Expo faz requisições HTTP à API REST (`EXPO_PUBLIC_API_URL`), enviando o JWT no header `Authorization`.
- **Como a web se integra ao backend:** a interface React consome os mesmos endpoints `/api/*` do próprio Next.js, com o JWT em `localStorage`.
- **Como o backend disponibiliza dados:** via endpoints REST (`/api/auth`, `/api/clients`, `/api/properties`, `/api/visits`, `/api/dashboard`, etc.), que leem e gravam no PostgreSQL (Supabase).

O banco armazena usuários, clientes, imóveis, visitas, imóveis vinculados às visitas, respostas do quiz e notificações. Uma visita criada ou atualizada no app aparece imediatamente na web, garantindo sincronização entre corretor e gerente.

### Stack
- Web + API REST: **Next.js 16** (App Router) + Tailwind CSS
- App mobile: **React Native + Expo**
- Banco: **PostgreSQL (Supabase)**
- Autenticação: **JWT**
- Deploy: **Vercel** (web/API) + **Expo Go** (mobile)

## 5. Links

- **Repositório público (GitHub):** https://github.com/rafastos-io/visitflow-imob
- **Deploy (web/API):** https://visitflow-imob.vercel.app
