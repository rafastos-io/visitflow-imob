# Conteúdo para o PDF da Atividade

> Cole este conteúdo em um editor (Word/Google Docs) e exporte como PDF.
> Substitua os campos **<RM>** e **<NOME COMPLETO>**.

---

## Atividade Substitutiva · Global Solution

**Aluno:** <NOME COMPLETO>
**RM:** <RM>

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
Estética moderna, minimalista e baseada em cards, inspirada em Trello, Asana, Monday e ClickUp, com foco em produtividade e clareza.

### Paleta de cores
| Cor | Hex | Uso |
|---|---|---|
| Grafite escuro | `#5D5D5A` | Menu, títulos, textos principais |
| Laranja | `#FEA45C` | Botões principais, alertas, destaques |
| Pêssego | `#FFCCAA` | Badges e cards secundários |
| Creme | `#FEF9F0` | Fundo geral |
| Branco | `#FFFFFF` | Cards e áreas de leitura |

O grafite transmite seriedade e organização; o laranja destaca ações importantes; o pêssego cria áreas de apoio visual; o creme traz leveza ao fundo.

### Tipografia
**Inter** — fonte moderna, limpa e adequada para interfaces digitais.

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
- Web + API REST: **Next.js 15** (App Router) + Tailwind CSS
- App mobile: **React Native + Expo**
- Banco: **PostgreSQL (Supabase)**
- Autenticação: **JWT**
- Deploy: **Vercel** (web/API) + **Expo Go** (mobile)

## 5. Links

- **Repositório público (GitHub):** <inserir link>
- **Deploy (web/API):** <inserir link>
