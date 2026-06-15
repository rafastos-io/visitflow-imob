-- VisitFlow Imob - dados mocados (seed)
-- Senha de todos os usuarios: 123456
-- Rodar DEPOIS de 0001_init.sql. Idempotente (limpa antes de inserir).

truncate notifications, visit_feedbacks, visit_properties, visits, clients, properties, users restart identity cascade;

-- ===== usuarios =====
-- hash bcrypt de "123456"
insert into users (id, name, email, password_hash, role, manager_id) values
  ('11111111-1111-1111-1111-111111111111', 'Carlos Mendes', 'gerente@visitflow.com', '$2a$10$s81JVKX6ev7JN.BI.6.62.QjwsJnni/14QTrocE86.8nHLU4f1aji', 'GERENTE', null),
  ('22222222-2222-2222-2222-222222222222', 'Joao Pereira',  'joao@visitflow.com',    '$2a$10$s81JVKX6ev7JN.BI.6.62.QjwsJnni/14QTrocE86.8nHLU4f1aji', 'CORRETOR', '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333333', 'Ana Souza',     'ana@visitflow.com',     '$2a$10$s81JVKX6ev7JN.BI.6.62.QjwsJnni/14QTrocE86.8nHLU4f1aji', 'CORRETOR', '11111111-1111-1111-1111-111111111111');

-- ===== clientes =====
insert into clients (id, name, phone, email, notes, broker_id) values
  ('cccccccc-0000-0000-0000-000000000001', 'Mariana Alves',    '(11) 98888-0001', 'mariana@email.com',  'Busca apto 3 dorm.', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-0000-0000-0000-000000000002', 'Roberto Lima',     '(11) 98888-0002', 'roberto@email.com',  'Investidor.',        '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-0000-0000-0000-000000000003', 'Fernanda Costa',   '(11) 98888-0003', 'fernanda@email.com', 'Primeira compra.',   '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-0000-0000-0000-000000000004', 'Paulo Henrique',   '(11) 98888-0004', 'paulo@email.com',    'Quer casa condominio.', '33333333-3333-3333-3333-333333333333'),
  ('cccccccc-0000-0000-0000-000000000005', 'Juliana Reis',     '(11) 98888-0005', 'juliana@email.com',  'Urgencia mudanca.',  '33333333-3333-3333-3333-333333333333'),
  ('cccccccc-0000-0000-0000-000000000006', 'Marcos Vinicius',  '(11) 98888-0006', 'marcos@email.com',   'Aceita financiar.',  '33333333-3333-3333-3333-333333333333');

-- ===== imoveis =====
insert into properties (id, title, address, neighborhood, city, type, area, bedrooms, suites, parking_spaces, price, status) values
  ('dddddddd-0000-0000-0000-000000000001', 'Apartamento 136 m2 na Vila Mariana', 'Rua Bage, 120',     'Vila Mariana', 'Sao Paulo', 'Apartamento', 136, 3, 1, 3, 2500000, 'Disponivel'),
  ('dddddddd-0000-0000-0000-000000000002', 'Casa 220 m2 em Moema',               'Al. dos Anapurus',  'Moema',        'Sao Paulo', 'Casa',        220, 4, 2, 4, 3800000, 'Disponivel'),
  ('dddddddd-0000-0000-0000-000000000003', 'Cobertura 180 m2 em Pinheiros',      'Rua dos Pinheiros', 'Pinheiros',    'Sao Paulo', 'Cobertura',   180, 3, 2, 2, 3200000, 'Disponivel'),
  ('dddddddd-0000-0000-0000-000000000004', 'Apartamento 65 m2 no Tatuape',       'Rua Tuiuti, 800',   'Tatuape',      'Sao Paulo', 'Apartamento', 65,  2, 1, 1, 720000,  'Disponivel'),
  ('dddddddd-0000-0000-0000-000000000005', 'Studio 38 m2 na Republica',          'Av. Sao Joao, 500', 'Republica',    'Sao Paulo', 'Studio',      38,  1, 0, 0, 410000,  'Disponivel'),
  ('dddddddd-0000-0000-0000-000000000006', 'Sobrado 160 m2 em Santana',          'Rua Voluntarios',   'Santana',      'Sao Paulo', 'Sobrado',     160, 3, 1, 2, 1350000, 'Disponivel'),
  ('dddddddd-0000-0000-0000-000000000007', 'Apartamento 92 m2 no Brooklin',      'Rua Michigan',      'Brooklin',     'Sao Paulo', 'Apartamento', 92,  3, 1, 2, 1180000, 'Disponivel'),
  ('dddddddd-0000-0000-0000-000000000008', 'Casa em Condominio 300 m2',          'Estr. Granja',      'Granja Viana', 'Cotia',     'Casa',        300, 4, 3, 4, 2900000, 'Disponivel');

-- ===== visitas (cobrindo todos os status do Kanban) =====
-- Joao (corretor 1)
insert into visits (id, client_id, broker_id, manager_id, scheduled_at, status, score, notes) values
  ('eeeeeeee-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', now() + interval '2 days', 'MARCADA', null, 'Roteiro com 3 imoveis.'),
  ('eeeeeeee-0000-0000-0000-000000000002', 'cccccccc-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', now() + interval '1 day',  'CONFIRMADA', null, 'Cliente confirmou.'),
  ('eeeeeeee-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', now() - interval '5 days', 'REALIZADA', 3, 'Interesse moderado.'),
  ('eeeeeeee-0000-0000-0000-000000000004', 'cccccccc-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', now() - interval '7 days', 'CLIENTE_QUENTE', 4, 'Cliente quente.'),
  ('eeeeeeee-0000-0000-0000-000000000005', 'cccccccc-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', now() - interval '3 days', 'PROPOSTA_EM_ANDAMENTO', 5, 'Quer fazer proposta.'),
  ('eeeeeeee-0000-0000-0000-000000000006', 'cccccccc-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', now() - interval '10 days', 'CANCELADA', 0, 'Cliente desistiu.'),
  -- visita vencida ainda MARCADA (dispara alerta pos-data)
  ('eeeeeeee-0000-0000-0000-000000000007', 'cccccccc-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', now() - interval '1 day',  'MARCADA', null, 'Precisa atualizar.'),
-- Ana (corretor 2)
  ('eeeeeeee-0000-0000-0000-000000000008', 'cccccccc-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', now() + interval '3 days', 'MARCADA', null, null),
  ('eeeeeeee-0000-0000-0000-000000000009', 'cccccccc-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', now() - interval '2 days', 'CONFIRMADA', null, 'Vencida, atualizar.'),
  ('eeeeeeee-0000-0000-0000-000000000010', 'cccccccc-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', now() - interval '6 days', 'REALIZADA', 3, null),
  ('eeeeeeee-0000-0000-0000-000000000011', 'cccccccc-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', now() - interval '4 days', 'CLIENTE_QUENTE', 4, 'Muito interessado.'),
  ('eeeeeeee-0000-0000-0000-000000000012', 'cccccccc-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', now() - interval '8 days', 'PROPOSTA_EM_ANDAMENTO', 5, 'Proposta enviada.');

-- ===== roteiros (visit_properties) =====
insert into visit_properties (visit_id, property_id, visit_order) values
  ('eeeeeeee-0000-0000-0000-000000000001', 'dddddddd-0000-0000-0000-000000000001', 1),
  ('eeeeeeee-0000-0000-0000-000000000001', 'dddddddd-0000-0000-0000-000000000003', 2),
  ('eeeeeeee-0000-0000-0000-000000000001', 'dddddddd-0000-0000-0000-000000000007', 3),
  ('eeeeeeee-0000-0000-0000-000000000002', 'dddddddd-0000-0000-0000-000000000002', 1),
  ('eeeeeeee-0000-0000-0000-000000000002', 'dddddddd-0000-0000-0000-000000000008', 2),
  ('eeeeeeee-0000-0000-0000-000000000003', 'dddddddd-0000-0000-0000-000000000001', 1),
  ('eeeeeeee-0000-0000-0000-000000000004', 'dddddddd-0000-0000-0000-000000000004', 1),
  ('eeeeeeee-0000-0000-0000-000000000004', 'dddddddd-0000-0000-0000-000000000005', 2),
  ('eeeeeeee-0000-0000-0000-000000000005', 'dddddddd-0000-0000-0000-000000000002', 1),
  ('eeeeeeee-0000-0000-0000-000000000005', 'dddddddd-0000-0000-0000-000000000003', 2),
  ('eeeeeeee-0000-0000-0000-000000000005', 'dddddddd-0000-0000-0000-000000000008', 3),
  ('eeeeeeee-0000-0000-0000-000000000007', 'dddddddd-0000-0000-0000-000000000007', 1),
  ('eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000008', 1),
  ('eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000002', 2),
  ('eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000004', 1),
  ('eeeeeeee-0000-0000-0000-000000000010', 'dddddddd-0000-0000-0000-000000000008', 1),
  ('eeeeeeee-0000-0000-0000-000000000011', 'dddddddd-0000-0000-0000-000000000006', 1),
  ('eeeeeeee-0000-0000-0000-000000000011', 'dddddddd-0000-0000-0000-000000000007', 2),
  ('eeeeeeee-0000-0000-0000-000000000012', 'dddddddd-0000-0000-0000-000000000003', 1);

-- ===== feedbacks (quiz pos-visita) =====
insert into visit_feedbacks (visit_id, was_completed, visited_count, interest_level, has_proposal_intent, general_perception, notes, score) values
  ('eeeeeeee-0000-0000-0000-000000000003', true, '2 a 3', 'Medio', false, 'Gostou, mas quer ver novas opcoes', 'Reagendar com novas opcoes.', 3),
  ('eeeeeeee-0000-0000-0000-000000000004', true, '2 a 3', 'Alto',  false, 'Gostou muito', 'Cliente quente.', 4),
  ('eeeeeeee-0000-0000-0000-000000000005', true, '4 a 5', 'Alto',  true,  'Quer fazer proposta', 'Avancar negociacao.', 5),
  ('eeeeeeee-0000-0000-0000-000000000006', false, '1',    'Nao',   false, 'Nao gostou dos imoveis', 'Cliente desistiu.', 0),
  ('eeeeeeee-0000-0000-0000-000000000010', true, '1',     'Medio', false, 'Gostou parcialmente', null, 3),
  ('eeeeeeee-0000-0000-0000-000000000011', true, '2 a 3', 'Alto',  false, 'Gostou muito', null, 4),
  ('eeeeeeee-0000-0000-0000-000000000012', true, 'Mais de 5', 'Alto', true, 'Quer fazer proposta', null, 5);

-- ===== notificacoes =====
insert into notifications (user_id, visit_id, title, message) values
  ('22222222-2222-2222-2222-222222222222', 'eeeeeeee-0000-0000-0000-000000000007', 'Visita pendente', 'Voce possui uma visita que ja deveria ter sido realizada. Atualize o status e responda o quiz.'),
  ('22222222-2222-2222-2222-222222222222', 'eeeeeeee-0000-0000-0000-000000000005', 'Proposta em andamento', 'Visita avaliada com nota 5. Avance para negociacao.'),
  ('33333333-3333-3333-3333-333333333333', 'eeeeeeee-0000-0000-0000-000000000009', 'Visita pendente', 'Voce possui uma visita que ja deveria ter sido realizada. Atualize o status e responda o quiz.'),
  ('33333333-3333-3333-3333-333333333333', 'eeeeeeee-0000-0000-0000-000000000011', 'Cliente quente', 'Visita avaliada com nota 4. Priorize o follow-up.');
