# Utilização de IA — SmartFlow

Ao longo do projeto, foram utilizadas ferramentas de inteligência artificial como apoio ao desenvolvimento — para depuração de erros, assistência na escrita de código, documentação e geração de conteúdos. Em todos os casos, os resultados foram revistos, adaptados e testados antes de serem integrados.

**Ferramentas utilizadas:** Claude (Anthropic) · ChatGPT (OpenAI) · ElevenLabs (áudio)

---

## Planeamento e Gestão do Projeto

A estrutura de sprints, a divisão de tarefas e responsabilidades, e as convenções de nomes de branches e commits foram organizadas com apoio do Claude. O quadro Trello foi populado automaticamente através de um script Python desenvolvido com Claude, que interagiu com a API REST do Trello para criar todas as listas, etiquetas e cartões de tarefas.

---

## Backend

### Autenticação e Configuração Inicial
A IA foi utilizada para apoiar a resolução de erros relacionados com Prisma, Docker, variáveis de ambiente, migrations e seed da base de dados. Também auxiliou na organização dos comandos do Makefile e na validação da lógica de autenticação baseada em JWT.

### API de Eventos
A API de eventos (`backend/src/routes/events.js`) foi escrita com apoio do Claude, incluindo o endpoint de acionamento de deteção, o fluxo de resolução e a lógica de filtragem por query params. O código foi revisto e testado antes de ser integrado.

### API de Cruzamentos
A IA apoiou a validação dos endpoints de cruzamentos através de testes com curl, a organização dos dados de seed relativos a municípios e cruzamentos, e a análise de respostas da API em cenários de erro, incluindo tokens inválidos, coordenadas incorretas e estados inválidos.

---

## Infraestrutura

A configuração do Docker e Docker Compose — incluindo o Dockerfile multi-stage, a configuração de healthchecks e a orquestração dos serviços — foi desenvolvida e depurada com apoio do Claude. A gestão de variáveis de ambiente no Makefile e a resolução de incompatibilidades de credenciais entre serviços foram igualmente assistidas por IA.

---

## Frontend

### Mapa e Simulador
As bibliotecas Leaflet e OpenStreetMap foram utilizadas como base para a navegação e visualização geográfica. A IA foi usada para apoiar a integração e posicionamento de elementos adicionais sobre o mapa, como semáforos, ambulâncias e outros elementos visuais da interface. Os mockups iniciais foram gerados com o Google Stitch e posteriormente refinados com apoio de IA.

### Autenticação e Componentes Partilhados
O módulo de autenticação frontend (`auth.js`) e o componente de navegação partilhado (`app-nav.jsx`) foram escritos com apoio do Claude e revistos antes de serem integrados.

### Landing Page e Página SOS
A IA contribuiu para a criação do cenário visual da landing page e para a lógica de animação da ambulância. Na página SOS, a IA apoiou a implementação das animações, dos elementos visuais e de algumas funcionalidades da interface.

---

## Testes e Logging

A IA foi utilizada na criação e revisão dos testes do backend e na geração de logs estruturados para operações relevantes da API.

---

## Documentação

A documentação do projeto — `README.md`, `CONTRIBUTIONS.md`, `docs/architecture.md` e `docs/data-model.md` — foi redigida com apoio do Claude e adaptada ao estado real do projeto ao longo do desenvolvimento.

Os conteúdos textuais da plataforma, tanto em português como em inglês, foram produzidos com apoio de IA e revistos antes da sua utilização.

---

## Áudio

Uma narração de demonstração foi gerada com recurso ao **ElevenLabs**. Esta funcionalidade encontra-se atualmente implementada apenas como protótipo, servindo exclusivamente para fins de demonstração.

---

*Todo o código, conteúdos e funcionalidades produzidos com apoio de IA foram posteriormente revistos, adaptados e testados antes de serem integrados na versão final do projeto.*