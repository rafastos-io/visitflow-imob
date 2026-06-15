# VisitFlow Imob, especificação para Vibe Coding

## 1. Objetivo do projeto

Criar uma plataforma integrada de gestão de visitas imobiliárias para corretores e gerentes.

A plataforma deve ter:

- App mobile para o corretor gerenciar sua agenda, roteiros de visita e feedback pós-visita.
- Interface web administrativa para o gerente acompanhar equipe, visitas, clientes quentes e indicadores.
- Backend funcional com API REST.
- Banco de dados persistente.
- Autenticação com dois perfis de usuário: `GERENTE` e `CORRETOR`.
- Deploy completo.
- Repositório público no GitHub.

O projeto deve simular um produto real, com arquitetura coerente e integração demonstrável entre app mobile, web e backend.

---

## 2. Nome do produto

Nome sugerido: **VisitFlow Imob**

### Slogan

Gestão inteligente de visitas imobiliárias.

### Outras opções de nome

- RotaVisita
- ImobFlow
- TourImob
- VisitHub

---

## 3. Contexto e problema

Corretores de imóveis costumam ter dificuldade para controlar a agenda de visitas, principalmente quando o roteiro com um cliente envolve mais de um imóvel.

No mercado imobiliário, é comum que um corretor visite de 3 a 7 imóveis com o mesmo cliente antes de conseguir uma proposta. Essas visitas podem acontecer em uma única tarde ou em vários dias diferentes.

Sem um sistema centralizado, informações importantes podem se perder, como:

- Quais imóveis foram visitados.
- Qual cliente visitou cada imóvel.
- Qual foi o retorno do cliente.
- Qual imóvel gerou mais interesse.
- Qual visita virou oportunidade quente.
- Qual corretor está com mais visitas.
- Quais clientes precisam de follow-up.
- Quais visitas foram marcadas, confirmadas, realizadas ou canceladas.

A plataforma resolve esse problema criando um fluxo visual, simples e rastreável para gerenciar visitas imobiliárias.

---

## 4. Descrição da plataforma

O **VisitFlow Imob** é uma plataforma integrada de gestão de visitas imobiliárias, criada para ajudar corretores e gerentes a organizarem roteiros de atendimento, acompanharem visitas agendadas e qualificarem clientes após cada saída.

O corretor usa o app mobile para:

- Ver sua agenda.
- Consultar visitas do dia, semana e mês.
- Visualizar os imóveis do roteiro.
- Confirmar ou cancelar visitas.
- Atualizar o status da visita.
- Responder um quiz rápido após a visita.
- Ver clientes quentes.

O gerente usa a interface web para:

- Acompanhar a equipe.
- Visualizar um dashboard administrativo.
- Ver visitas por status.
- Analisar desempenho por corretor.
- Identificar clientes quentes.
- Consultar imóveis mais visitados.
- Ver relatórios simples.

O diferencial da plataforma é a atualização inteligente pós-visita. Após a data agendada, o sistema identifica automaticamente que a visita deveria ter ocorrido e exibe um questionário rápido para o corretor informar se a visita foi efetivada e qual foi o nível de interesse do cliente.

A partir das respostas, o sistema gera uma nota de 0 a 5 estrelas:

- `0`: visita não realizada ou sem aderência.
- `1`: cliente pouco interessado.
- `2`: interesse fraco.
- `3`: interesse moderado.
- `4`: cliente quente.
- `5`: proposta ou forte intenção de compra.

Clientes com nota 4 ou 5 devem entrar automaticamente na etapa de **Clientes Quentes**.

---

## 5. Perfis de usuário

A plataforma terá apenas dois perfis de acesso.

### 5.1 Gerente

O gerente pode:

- Ver todos os corretores da sua equipe.
- Ver todas as visitas da equipe.
- Ver todos os clientes da equipe.
- Ver dashboard geral.
- Filtrar visitas por corretor, status, período, cliente ou imóvel.
- Ver clientes quentes.
- Analisar média de estrelas por corretor.
- Ver quantidade de visitas marcadas, confirmadas e realizadas.
- Acompanhar oportunidades em proposta.

### 5.2 Corretor

O corretor pode:

- Ver apenas suas próprias visitas.
- Ver apenas seus próprios clientes.
- Criar visitas.
- Montar roteiros com múltiplos imóveis.
- Confirmar visitas.
- Cancelar ou reagendar visitas.
- Responder quiz pós-visita.
- Ver clientes quentes sob sua responsabilidade.
- Ver sua agenda.

---

## 6. Fluxo principal da visita

1. Corretor cadastra um cliente.
2. Corretor seleciona os imóveis do roteiro.
3. Corretor define data e horário da visita.
4. Sistema cria a visita com status `MARCADA`.
5. Sistema exibe a visita no Kanban.
6. Corretor confirma a visita.
7. Sistema altera status para `CONFIRMADA`.
8. Após a data da visita, o sistema exibe um pop-up ou alerta pedindo atualização.
9. Corretor informa se a visita foi realizada.
10. Corretor responde o quiz pós-visita.
11. Sistema calcula a nota da visita de 0 a 5.
12. Se a nota for 4 ou 5, o cliente entra em `CLIENTE_QUENTE`.
13. Se houver proposta, a visita entra em `PROPOSTA_EM_ANDAMENTO`.
14. Gerente acompanha tudo pelo dashboard web.

---

## 7. Kanban da plataforma

A interface deve ter um Kanban moderno, com cards simples e rápidos, inspirado em Trello, Asana, Monday e ClickUp.

### Colunas do Kanban

- Visitas Marcadas
- Visitas Confirmadas
- Visitas Realizadas
- Clientes Quentes
- Proposta em Andamento

### Informações do card

Cada card deve exibir:

- Nome do cliente.
- Nome do corretor.
- Data e horário da visita.
- Quantidade de imóveis no roteiro.
- Status atual.
- Nota em estrelas, quando houver.
- Indicador de prioridade.
- Botão de ação rápida.

### Exemplo de card

```text
Cliente: Mariana Alves
Corretor: João Pereira
Roteiro: 5 imóveis
Data: 18/06, 14h
Status: Confirmada
Nota: ainda não avaliada
```

---

## 8. Sistema de notas

A nota da visita deve ser calculada com base no quiz pós-visita.

| Nota | Significado | Ação sugerida |
|---|---|---|
| 0 estrelas | Visita não realizada ou cliente sem aderência | Registrar motivo e encerrar ou reagendar |
| 1 estrela | Cliente pouco interessado | Follow-up baixo |
| 2 estrelas | Interesse fraco, mas ainda existe possibilidade | Reavaliar perfil |
| 3 estrelas | Interesse moderado | Enviar novas opções |
| 4 estrelas | Cliente quente | Prioridade para follow-up |
| 5 estrelas | Proposta ou forte intenção de compra | Avançar para negociação |

Regra obrigatória:

- Se a nota for `4` ou `5`, marcar o cliente como quente.
- Se o corretor informar que existe proposta, marcar como proposta em andamento.

---

## 9. Quiz pós-visita

O quiz deve ser rápido, direto e fácil de responder no celular.

### Perguntas sugeridas

#### 1. A visita foi realizada?

- Sim
- Não
- Parcialmente

#### 2. Quantos imóveis foram visitados?

- 1
- 2 a 3
- 4 a 5
- Mais de 5

#### 3. O cliente demonstrou interesse em algum imóvel?

- Não
- Pouco
- Médio
- Alto

#### 4. Algum imóvel gerou possibilidade de proposta?

- Sim
- Não

#### 5. Qual foi a percepção geral do cliente?

- Não gostou dos imóveis
- Gostou parcialmente
- Gostou, mas quer ver novas opções
- Gostou muito
- Quer fazer proposta

#### 6. Observações do corretor

Campo de texto curto.

### Regra sugerida para cálculo de nota

- Se a visita não foi realizada: nota 0.
- Se o interesse foi baixo: nota 1 ou 2.
- Se o interesse foi médio: nota 3.
- Se o interesse foi alto: nota 4.
- Se existe possibilidade de proposta ou intenção clara de compra: nota 5.

---

## 10. Funcionalidades do app mobile

O app mobile deve ser focado no corretor.

### Telas principais

| Tela | Função |
|---|---|
| Login | Acesso do corretor ou gerente |
| Home | Resumo das visitas do dia |
| Agenda | Lista de visitas por dia, semana e mês |
| Roteiro da visita | Exibe cliente, imóveis, horários e endereços |
| Detalhe do imóvel | Mostra dados básicos do imóvel |
| Atualizar visita | Confirma, cancela, reagenda ou finaliza uma visita |
| Quiz pós-visita | Qualifica a visita após a data |
| Clientes quentes | Lista clientes com nota 4 ou 5 |
| Perfil | Dados do usuário logado |

### Funcionalidades obrigatórias no app

- Login funcional.
- Consumo real da API REST.
- Listagem de visitas vindas do backend.
- Cadastro de visita.
- Atualização de status da visita.
- Envio das respostas do quiz para o backend.
- Exibição da nota calculada.
- Visualização de clientes quentes.

---

## 11. Funcionalidades da interface web

A interface web será focada no gerente, mas também pode funcionar para o corretor com permissões limitadas.

### Telas principais

| Tela | Função |
|---|---|
| Login | Acesso seguro |
| Dashboard | Indicadores gerais da operação |
| Kanban | Acompanhamento visual das visitas |
| Corretores | Lista da equipe |
| Clientes | Consulta e cadastro de clientes |
| Imóveis | Cadastro e identificação dos imóveis |
| Relatórios | Visitas por período, corretor e status |
| Clientes quentes | Oportunidades com maior chance de proposta |
| Configurações | Dados básicos do usuário |

### Indicadores do dashboard

- Total de visitas marcadas.
- Total de visitas confirmadas.
- Total de visitas realizadas.
- Total de visitas canceladas.
- Quantidade de clientes quentes.
- Quantidade de propostas em andamento.
- Taxa de visita realizada.
- Média de estrelas por corretor.
- Imóveis mais visitados.
- Corretores com mais visitas realizadas.

---

## 12. Identificação dos imóveis

Os imóveis devem ser cadastrados e identificados dentro da plataforma.

### Campos sugeridos para imóvel

- ID do imóvel.
- Título do imóvel.
- Endereço.
- Bairro.
- Cidade.
- Tipo do imóvel.
- Metragem.
- Dormitórios.
- Suítes.
- Vagas.
- Valor.
- Status.
- Link externo, opcional.
- Observações.

### Exemplo de imóvel

```json
{
  "id": "prop_001",
  "title": "Apartamento 136 m² na Vila Mariana",
  "address": "Rua Bagé, Vila Mariana",
  "city": "São Paulo",
  "type": "Apartamento",
  "area": 136,
  "bedrooms": 3,
  "suites": 1,
  "parkingSpaces": 3,
  "price": 2500000,
  "status": "Disponível"
}
```

---

## 13. Arquitetura técnica

### Estrutura geral

```text
App Mobile
   |
   | Consome API REST
   v
Backend
   |
   | Consulta e grava dados
   v
Banco de Dados

Interface Web
   |
   | Consome a mesma API REST
   v
Backend
```

### Stack sugerida

| Camada | Tecnologia recomendada |
|---|---|
| App mobile | React Native com Expo |
| Interface web | React com Vite |
| Backend | Node.js com Express |
| Banco de dados | PostgreSQL no Supabase |
| Autenticação | JWT |
| Deploy web | Vercel |
| Deploy backend | Render ou Railway |
| Repositório | GitHub público |

### Observação de implementação

Para simplificar a entrega individual, manter o projeto como MVP funcional. Evitar excesso de funcionalidades que dificultem a finalização.

---

## 14. Estrutura sugerida do repositório

```text
visitflow-imob/
  README.md
  backend/
    package.json
    src/
      server.js
      routes/
      controllers/
      services/
      middlewares/
      database/
      models/
  web/
    package.json
    src/
      main.jsx
      App.jsx
      pages/
      components/
      services/
      styles/
  mobile/
    package.json
    App.js
    src/
      screens/
      components/
      services/
      navigation/
      styles/
  docs/
    projeto.pdf
    arquitetura.md
```

---

## 15. Banco de dados

### Tabelas principais

| Tabela | Finalidade |
|---|---|
| users | Gerentes e corretores |
| teams | Equipes de corretores |
| clients | Clientes atendidos |
| properties | Imóveis disponíveis |
| visits | Visitas agendadas |
| visit_properties | Imóveis vinculados a cada visita |
| visit_feedbacks | Respostas do quiz pós-visita |
| notifications | Avisos, lembretes e pop-ups |

---

## 16. Modelo de dados sugerido

### users

```sql
id uuid primary key
name text not null
email text unique not null
password_hash text not null
role text check (role in ('GERENTE', 'CORRETOR')) not null
manager_id uuid null
created_at timestamp default now()
```

### clients

```sql
id uuid primary key
name text not null
phone text
email text
notes text
broker_id uuid references users(id)
created_at timestamp default now()
```

### properties

```sql
id uuid primary key
title text not null
address text
neighborhood text
city text
type text
area numeric
bedrooms integer
suites integer
parking_spaces integer
price numeric
status text default 'Disponível'
created_at timestamp default now()
```

### visits

```sql
id uuid primary key
client_id uuid references clients(id)
broker_id uuid references users(id)
manager_id uuid references users(id)
scheduled_at timestamp not null
status text check (status in ('MARCADA', 'CONFIRMADA', 'REALIZADA', 'CLIENTE_QUENTE', 'PROPOSTA_EM_ANDAMENTO', 'CANCELADA')) default 'MARCADA'
score integer default null
notes text
created_at timestamp default now()
updated_at timestamp default now()
```

### visit_properties

```sql
id uuid primary key
visit_id uuid references visits(id)
property_id uuid references properties(id)
visit_order integer
created_at timestamp default now()
```

### visit_feedbacks

```sql
id uuid primary key
visit_id uuid references visits(id)
was_completed boolean
visited_count text
interest_level text
has_proposal_intent boolean
general_perception text
notes text
score integer
created_at timestamp default now()
```

### notifications

```sql
id uuid primary key
user_id uuid references users(id)
visit_id uuid references visits(id)
title text not null
message text not null
read boolean default false
created_at timestamp default now()
```

---

## 17. API REST

### Autenticação

```text
POST /auth/register
POST /auth/login
GET /auth/me
```

### Usuários

```text
GET /users
GET /users/:id
PUT /users/:id
DELETE /users/:id
```

### Clientes

```text
GET /clients
POST /clients
GET /clients/:id
PUT /clients/:id
DELETE /clients/:id
```

### Imóveis

```text
GET /properties
POST /properties
GET /properties/:id
PUT /properties/:id
DELETE /properties/:id
```

### Visitas

```text
GET /visits
POST /visits
GET /visits/:id
PUT /visits/:id
DELETE /visits/:id
PATCH /visits/:id/status
```

### Quiz pós-visita

```text
POST /visits/:id/feedback
GET /visits/:id/feedback
```

### Dashboard

```text
GET /dashboard/manager
GET /dashboard/broker
GET /dashboard/hot-clients
GET /dashboard/visits-by-status
GET /dashboard/visits-by-broker
```

### Notificações

```text
GET /notifications
PATCH /notifications/:id/read
```

---

## 18. Regras de permissão

### Gerente

- Pode ver todos os dados dos corretores vinculados a ele.
- Pode ver dashboard geral.
- Pode ver todos os clientes e visitas da equipe.
- Pode cadastrar imóveis.
- Pode filtrar por corretor.

### Corretor

- Pode ver apenas seus próprios dados.
- Pode criar clientes para si.
- Pode criar visitas para seus próprios clientes.
- Pode atualizar apenas suas próprias visitas.
- Pode responder quiz apenas das próprias visitas.

---

## 19. Regras de negócio

### Visita pós-data

Quando a data e hora da visita forem menores que a data e hora atual e o status ainda estiver como `MARCADA` ou `CONFIRMADA`, o sistema deve exibir um aviso para o corretor atualizar a visita.

Exemplo de alerta:

```text
Você possui uma visita que já deveria ter sido realizada. Atualize o status e responda o quiz pós-visita.
```

### Cliente quente

Quando uma visita receber nota 4 ou 5:

- Atualizar status da visita para `CLIENTE_QUENTE`.
- Exibir o cliente na lista de clientes quentes.
- Destacar o card no Kanban.

### Proposta em andamento

Quando o corretor marcar que existe possibilidade de proposta:

- A nota deve ser 5.
- O status deve ser `PROPOSTA_EM_ANDAMENTO`.

### Visita cancelada

Se a visita não for realizada:

- Registrar motivo do cancelamento.
- Atribuir nota 0.
- Manter histórico.

---

## 20. Design e experiência do usuário

### Referências visuais

A interface deve seguir uma estética inspirada em:

- Trello
- Asana
- Monday
- ClickUp

### Estilo visual

- Minimalista.
- Moderno.
- Limpo.
- Focado em cards.
- Focado em produtividade.
- Com poucos elementos por tela.
- Com botões claros e ações rápidas.

### Paleta de cores

A paleta deve seguir as cores enviadas como referência.

| Cor | Hex aproximado | Uso sugerido |
|---|---:|---|
| Grafite escuro | `#5D5D5A` | Menu, títulos, textos principais |
| Laranja | `#FEA45C` | Botões principais, alertas e ações importantes |
| Pêssego | `#FFCCAA` | Cards secundários, badges e destaques suaves |
| Creme | `#FEF9F0` | Fundo geral da plataforma |
| Branco | `#FFFFFF` | Cards, modais e áreas de leitura |

### Aplicação das cores

- Fundo geral: creme claro.
- Cards: branco.
- Menu lateral: grafite.
- Botões principais: laranja.
- Badges e alertas suaves: pêssego.
- Clientes quentes: laranja com destaque visual.
- Textos principais: grafite escuro.

### Tipografia

Usar fonte moderna e limpa.

Sugestões:

- Inter
- Poppins
- Roboto

Recomendação: **Inter**.

---

## 21. Componentes de interface

### Componentes web

- Sidebar lateral.
- Header com busca e filtros.
- Cards de indicadores.
- Kanban com colunas.
- Card de visita.
- Modal de criação de visita.
- Modal de feedback pós-visita.
- Tabela de clientes.
- Tabela de imóveis.
- Filtro por corretor.
- Filtro por status.
- Filtro por período.

### Componentes mobile

- Tela de login.
- Lista de visitas.
- Card de visita.
- Tela de detalhe da visita.
- Lista de imóveis do roteiro.
- Tela de quiz.
- Botões de confirmação.
- Alertas pós-visita.
- Lista de clientes quentes.

---

## 22. Sugestão de layout web

### Dashboard

- Sidebar fixa à esquerda.
- Cards de indicadores no topo.
- Gráfico simples de visitas por status.
- Lista de clientes quentes.
- Kanban logo abaixo ou em tela dedicada.

### Kanban

Colunas horizontais:

1. Visitas Marcadas
2. Visitas Confirmadas
3. Visitas Realizadas
4. Clientes Quentes
5. Proposta em Andamento

Cada coluna deve conter cards de visitas.

### Tela de imóveis

- Tabela com imóveis cadastrados.
- Busca por bairro, tipo e valor.
- Botão de cadastrar imóvel.

---

## 23. Sugestão de layout mobile

### Home do corretor

- Saudação.
- Total de visitas do dia.
- Próxima visita.
- Alerta de visita pendente de atualização.
- Botão para ver agenda.

### Agenda

- Lista de visitas agrupadas por data.
- Status em badge.
- Botão para abrir detalhe.

### Detalhe da visita

- Dados do cliente.
- Data e horário.
- Lista de imóveis do roteiro.
- Botões:
  - Confirmar visita.
  - Cancelar visita.
  - Responder quiz.

### Quiz

- Uma pergunta por vez.
- Barra de progresso.
- Botão próximo.
- Resultado final com nota em estrelas.

---

## 24. Recursos de acessibilidade

Implementar:

- Contraste adequado entre texto e fundo.
- Botões grandes e fáceis de clicar.
- Labels claros em todos os campos.
- Ícones acompanhados de texto.
- Feedback visual após salvar, editar ou excluir.
- Mensagens de erro objetivas.
- Navegação simples.
- Uso de HTML semântico na web.
- Possibilidade de navegação por teclado na web.
- Textos alternativos em ícones importantes.

---

## 25. Entregáveis do projeto

O projeto final deve conter:

- App mobile funcional.
- Interface web funcional.
- Backend com API REST.
- Banco de dados persistente.
- Autenticação com gerente e corretor.
- Dashboard administrativo.
- Kanban de visitas.
- Quiz pós-visita.
- Sistema de nota de 0 a 5.
- Deploy do backend.
- Deploy da interface web.
- Repositório público no GitHub.
- Documento PDF explicando a proposta, design e arquitetura.

---

## 26. MVP recomendado para entrega individual

Para garantir que o projeto seja possível dentro do prazo, priorizar este MVP:

### Obrigatório

- Login.
- Dois perfis: gerente e corretor.
- Cadastro de clientes.
- Cadastro de imóveis.
- Cadastro de visitas com múltiplos imóveis.
- Kanban de status.
- Quiz pós-visita.
- Nota de 0 a 5.
- Dashboard simples.
- Consumo da mesma API pelo app e pela web.

### Opcional, se houver tempo

- Envio real de e-mail.
- Notificações push.
- Integração com Google Calendar.
- Drag and drop no Kanban.
- Relatórios avançados.
- Exportação em CSV.

### Simulação aceitável

Se não houver tempo para envio real de e-mail ou push, criar registros de notificação no banco e exibir alertas/pop-ups dentro do sistema.

---

## 27. Prompt master para Vibe Coding

Use este prompt para orientar a criação do projeto:

```text
Crie uma plataforma full stack chamada VisitFlow Imob.

A plataforma é um sistema integrado de gestão de visitas imobiliárias para corretores e gerentes.

O sistema deve ter três partes:

1. App mobile para corretores.
2. Interface web administrativa para gerentes.
3. Backend com API REST e banco de dados.

A plataforma deve ter dois perfis de usuário:

- GERENTE: pode visualizar todos os dados da equipe, dashboard, Kanban, clientes, imóveis, visitas, clientes quentes e indicadores.
- CORRETOR: pode visualizar e gerenciar apenas seus próprios clientes e visitas.

O problema que o produto resolve é o controle de visitas imobiliárias. Um corretor normalmente visita de 3 a 7 imóveis com um cliente antes de conseguir uma proposta. Essas visitas podem acontecer em uma tarde ou em vários dias. O sistema deve organizar cliente, corretor, imóveis, data, status da visita e feedback pós-visita.

Funcionalidades obrigatórias:

- Login com autenticação.
- Cadastro de usuários com role GERENTE ou CORRETOR.
- Cadastro de clientes.
- Cadastro de imóveis.
- Cadastro de visitas.
- Cada visita pode ter um ou mais imóveis vinculados.
- Kanban com as colunas: Visitas Marcadas, Visitas Confirmadas, Visitas Realizadas, Clientes Quentes e Proposta em Andamento.
- Atualização de status da visita.
- Quiz pós-visita.
- Cálculo de nota da visita de 0 a 5 estrelas.
- Se a nota for 4 ou 5, marcar o cliente como quente.
- Se houver intenção de proposta, mover para Proposta em Andamento.
- Dashboard com indicadores gerais.
- API REST consumida pela web e pelo mobile.

Quiz pós-visita:

1. A visita foi realizada? Sim, Não ou Parcialmente.
2. Quantos imóveis foram visitados? 1, 2 a 3, 4 a 5 ou Mais de 5.
3. O cliente demonstrou interesse em algum imóvel? Não, Pouco, Médio ou Alto.
4. Algum imóvel gerou possibilidade de proposta? Sim ou Não.
5. Qual foi a percepção geral do cliente? Não gostou dos imóveis, Gostou parcialmente, Gostou mas quer ver novas opções, Gostou muito ou Quer fazer proposta.
6. Observações do corretor.

Regras de nota:

- Visita não realizada: 0.
- Interesse baixo: 1 ou 2.
- Interesse médio: 3.
- Interesse alto: 4.
- Possibilidade de proposta: 5.

Design:

A interface deve ser moderna, minimalista e baseada em cards, com referência visual em Trello, Asana, Monday e ClickUp.

Paleta de cores:

- Grafite escuro: #5D5D5A
- Laranja: #FEA45C
- Pêssego: #FFCCAA
- Creme: #FEF9F0
- Branco: #FFFFFF

Usar fonte Inter.

Tecnologias sugeridas:

- Web: React com Vite.
- Mobile: React Native com Expo.
- Backend: Node.js com Express.
- Banco de dados: PostgreSQL ou SQLite para MVP.
- Autenticação: JWT.

Crie uma estrutura organizada de projeto com pastas separadas para backend, web e mobile.

O backend deve expor endpoints REST para autenticação, usuários, clientes, imóveis, visitas, feedbacks, notificações e dashboard.

A web deve ter dashboard, Kanban, clientes, imóveis, corretores e relatórios.

O mobile deve ter login, home do corretor, agenda, detalhe da visita, roteiro de imóveis, quiz pós-visita e clientes quentes.

Priorize um MVP funcional, limpo e demonstrável, com dados reais persistidos no banco.
```

---

## 28. Prompt para criar primeiro o backend

```text
Comece criando o backend do VisitFlow Imob com Node.js e Express.

Crie uma API REST com autenticação JWT, dois perfis de usuário, GERENTE e CORRETOR, e as entidades users, clients, properties, visits, visit_properties, visit_feedbacks e notifications.

Implemente as rotas:

- POST /auth/register
- POST /auth/login
- GET /auth/me
- GET /clients
- POST /clients
- PUT /clients/:id
- DELETE /clients/:id
- GET /properties
- POST /properties
- PUT /properties/:id
- DELETE /properties/:id
- GET /visits
- POST /visits
- GET /visits/:id
- PATCH /visits/:id/status
- POST /visits/:id/feedback
- GET /dashboard/manager
- GET /dashboard/broker
- GET /notifications

Inclua regras de permissão:

- Gerente vê dados da equipe.
- Corretor vê apenas dados próprios.

Inclua a lógica de cálculo de nota pós-visita e atualização automática para cliente quente quando a nota for 4 ou 5.
```

---

## 29. Prompt para criar a interface web

```text
Crie a interface web do VisitFlow Imob usando React com Vite.

A interface deve consumir a API REST do backend.

Crie as telas:

- Login
- Dashboard
- Kanban de visitas
- Clientes
- Imóveis
- Corretores
- Clientes quentes
- Relatórios simples

Use design moderno, minimalista e baseado em cards.

Referências: Trello, Asana, Monday e ClickUp.

Paleta:

- #5D5D5A
- #FEA45C
- #FFCCAA
- #FEF9F0
- #FFFFFF

Fonte: Inter.

O dashboard deve mostrar:

- Total de visitas marcadas.
- Total de visitas confirmadas.
- Total de visitas realizadas.
- Total de clientes quentes.
- Total de propostas.
- Média de estrelas por corretor.

O Kanban deve ter as colunas:

- Visitas Marcadas
- Visitas Confirmadas
- Visitas Realizadas
- Clientes Quentes
- Proposta em Andamento

Cada card deve mostrar cliente, corretor, data, quantidade de imóveis, status e nota.
```

---

## 30. Prompt para criar o app mobile

```text
Crie o app mobile do VisitFlow Imob usando React Native com Expo.

O app será usado principalmente pelo corretor.

Crie as telas:

- Login
- Home do corretor
- Agenda
- Detalhe da visita
- Roteiro de imóveis
- Atualizar visita
- Quiz pós-visita
- Clientes quentes
- Perfil

O app deve consumir a mesma API REST da interface web.

A Home deve mostrar:

- Visitas do dia.
- Próxima visita.
- Alertas de visitas pendentes de atualização.
- Atalho para clientes quentes.

A tela de detalhe da visita deve mostrar:

- Nome do cliente.
- Telefone do cliente.
- Data e horário.
- Status.
- Lista de imóveis do roteiro.
- Botões para confirmar, cancelar ou responder quiz.

O quiz pós-visita deve ter uma pergunta por vez e, ao final, enviar as respostas para a API e exibir a nota de 0 a 5 estrelas.

Use visual moderno, limpo, com cards e botões grandes.

Paleta:

- #5D5D5A
- #FEA45C
- #FFCCAA
- #FEF9F0
- #FFFFFF

Fonte: Inter ou padrão equivalente do sistema.
```

---

## 31. Texto para README do GitHub

```text
# VisitFlow Imob

VisitFlow Imob é uma plataforma integrada de gestão de visitas imobiliárias para corretores e gerentes.

O projeto foi desenvolvido como atividade individual da Global Solution, com o objetivo de demonstrar integração entre app mobile, interface web, backend com API REST e deploy completo.

## Problema

Corretores de imóveis costumam visitar vários imóveis com um mesmo cliente antes de gerar uma proposta. Sem um sistema centralizado, é difícil controlar agenda, roteiros, imóveis visitados, retorno do cliente e oportunidades quentes.

## Solução

A plataforma organiza visitas imobiliárias em um fluxo visual com Kanban, agenda, roteiros, quiz pós-visita, nota de qualificação e dashboard administrativo.

## Perfis

- Gerente: acompanha equipe, indicadores, visitas e clientes quentes.
- Corretor: gerencia suas próprias visitas, clientes e feedbacks.

## Tecnologias

- Web: React com Vite
- Mobile: React Native com Expo
- Backend: Node.js com Express
- Banco de dados: PostgreSQL ou SQLite
- Autenticação: JWT

## Funcionalidades

- Login
- Cadastro de clientes
- Cadastro de imóveis
- Cadastro de visitas
- Kanban de visitas
- Quiz pós-visita
- Nota de 0 a 5 estrelas
- Clientes quentes
- Dashboard administrativo
- API REST

## Deploy

Inserir aqui o link do deploy da interface web.

## Backend

Inserir aqui o link do deploy da API.
```

---

## 32. Texto para o PDF da atividade

### Descrição da plataforma

O VisitFlow Imob é uma plataforma integrada de gestão de visitas imobiliárias, criada para ajudar corretores e gerentes a organizarem roteiros de atendimento, acompanharem visitas agendadas e qualificarem clientes após cada saída.

A solução é composta por app mobile, interface web e backend com API REST. O app mobile é utilizado pelo corretor para consultar agenda, visualizar roteiros, confirmar visitas e responder o quiz pós-visita. A interface web é utilizada pelo gerente para acompanhar indicadores, visualizar a equipe, analisar visitas e identificar clientes quentes.

### Para quem serve

A plataforma serve para imobiliárias, equipes comerciais, corretores autônomos e gerentes que precisam controlar visitas imobiliárias de forma mais organizada e visual.

### Problema resolvido

O sistema resolve a dificuldade de controlar visitas com múltiplos imóveis, principalmente quando um mesmo cliente visita diversas opções antes de tomar uma decisão. A plataforma centraliza agenda, roteiro, imóveis, status, feedback e qualificação do cliente.

### Justificativa do tema

O tema foi escolhido por representar uma necessidade real do mercado imobiliário. Corretores lidam diariamente com diferentes clientes, imóveis, horários e retornos de atendimento. Quando uma visita envolve vários imóveis, o controle das informações pode se tornar confuso, principalmente quando não existe um sistema centralizado para registrar o roteiro, confirmar a visita e qualificar o interesse do cliente.

A plataforma proposta busca resolver esse problema por meio de uma solução integrada entre app mobile, interface web e backend. O app permite que o corretor atualize as visitas de forma rápida, diretamente durante sua rotina de atendimento. A interface web oferece ao gerente uma visão administrativa da equipe, com indicadores, Kanban e acompanhamento de clientes quentes.

### Justificativa de design

A identidade visual foi pensada para transmitir organização, produtividade e clareza. A interface segue referências de plataformas modernas como Trello, Asana, Monday e ClickUp, utilizando cards, Kanban, dashboards e ações rápidas.

A paleta de cores utiliza grafite escuro, laranja, pêssego, creme e branco. O grafite transmite seriedade e organização, o laranja destaca ações importantes, o pêssego cria áreas de apoio visual e o creme traz leveza para o fundo da aplicação.

A tipografia sugerida é Inter, por ser uma fonte moderna, limpa e adequada para interfaces digitais. A navegação foi pensada para ser simples, com poucos níveis, botões claros e foco na produtividade do usuário.

### Arquitetura técnica

A arquitetura da solução é composta por três camadas principais: app mobile, interface web e backend. O app mobile e a interface web consomem a mesma API REST, disponibilizada pelo backend. O backend é responsável por autenticar usuários, armazenar dados, controlar permissões, registrar visitas, calcular notas e fornecer informações para o dashboard.

O banco de dados armazena usuários, clientes, imóveis, visitas, imóveis vinculados às visitas, respostas do quiz e notificações. A integração entre as partes permite que uma visita criada ou atualizada no app também apareça na interface web, garantindo sincronização entre corretor e gerente.

---

## 33. Checklist final de entrega

Antes de entregar, conferir:

- [ ] Repositório público no GitHub.
- [ ] Backend rodando localmente.
- [ ] Backend publicado em Render, Railway ou serviço equivalente.
- [ ] Web publicada na Vercel ou serviço equivalente.
- [ ] App mobile rodando no Expo.
- [ ] Login funcionando.
- [ ] Perfil gerente funcionando.
- [ ] Perfil corretor funcionando.
- [ ] API REST documentada no README.
- [ ] Kanban funcionando.
- [ ] Quiz pós-visita funcionando.
- [ ] Dashboard exibindo dados reais da API.
- [ ] Banco de dados persistente.
- [ ] PDF final com descrição, justificativa, design, arquitetura, GitHub e deploy.

