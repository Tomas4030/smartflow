
## Listas do Quadro Kanban

### 1. Backlog do Projeto

Esta lista contém todas as funcionalidades e requisitos que ainda não foram planeados para um sprint específico, mas que são importantes para o projeto.

#### Cartões:

*   **Card: Análise e Refinamento de Requisitos (FR-01)**
    *   **Descrição:** Implementar as jornadas de utilizador definidas no documento de escopo, garantindo que todas as interações do utilizador são claras e bem definidas.
    *   **Checklist:**
        *   Rever o documento de escopo para identificar todas as jornadas de utilizador.
        *   Criar diagramas de fluxo de utilizador para cada jornada.
        *   Validar as jornadas com o tutor/cliente (se aplicável).
        *   Documentar quaisquer refinamentos ou alterações necessárias.

*   **Card: Definição de Stack Tecnológica (NFR-01, NFR-02)**
    *   **Descrição:** Assegurar que a solução é contentorizada usando Docker/Docker Compose e que o controlo de versão é feito com Git, com commits significativos.
    *   **Checklist:**
        *   Configurar o ambiente Docker/Docker Compose para o projeto.
        *   Inicializar o repositório Git e definir a estrutura de branches.
        *   Garantir que todos os membros da equipa estão familiarizados com as práticas de commit.
        *   Documentar a configuração do ambiente de desenvolvimento.

### 2. Fase 1: Definição de Escopo e Planeamento (Sessões 1-3)

Esta lista foca nas tarefas iniciais de planeamento e definição do projeto.

#### Cartões:

*   **Card: Documento de Escopo e Matriz de Responsabilidades**
    *   **Descrição:** Elaborar o documento de escopo do projeto e a matriz de responsabilidades da equipa, incluindo a definição de itens fora do escopo.
    *   **Checklist:**
        *   Definir os limites do projeto e os objetivos principais.
        *   Identificar e listar itens fora do escopo.
        *   Atribuir papéis e responsabilidades a cada membro da equipa.
        *   Rever e obter aprovação do documento de escopo.

*   **Card: Plano Técnico e Wireframes Iniciais**
    *   **Descrição:** Desenvolver o plano técnico, incluindo a stack, arquitetura e contentorização, e criar os primeiros rascunhos da interface (wireframes).
    *   **Checklist:**
        *   Escolher a stack tecnológica final (Frontend, Backend, Autenticação).
        *   Desenhar a arquitetura de alto nível do sistema.
        *   Criar wireframes de baixa/média fidelidade para as principais user flows.
        *   Preparar um esboço da apresentação inicial.

### 3. Fase 2: Design, Arquitetura e Modelação de Dados (Sessões 4-6)

Esta lista abrange as tarefas relacionadas com o design da interface, arquitetura e modelagem de dados.

#### Cartões:

*   **Card: Design Final da UI e Diagramas (NFR-03)**
    *   **Descrição:** Finalizar o design da interface do utilizador (UI) e criar os diagramas de modelo de dados (ERD) e arquitetura.
    *   **Checklist:**
        *   Desenvolver o design final da UI, garantindo responsividade (desktop/mobile).
        *   Criar o Diagrama de Entidade-Relacionamento (ERD) para a base de dados.
        *   Elaborar o diagrama de arquitetura, mostrando serviços e comunicação.
        *   Obter feedback e aprovação dos designs e diagramas.

*   **Card: Esqueleto Docker-Compose e Estrutura do Repositório**
    *   **Descrição:** Preparar o esqueleto do `docker-compose.yml` com serviços placeholder e a estrutura inicial do repositório com README e guia de contribuição.
    *   **Checklist:**
        *   Criar o ficheiro `docker-compose.yml` com os serviços base.
        *   Configurar a estrutura de pastas do projeto.
        *   Escrever o README.md com instruções de setup.
        *   Criar um guia de contribuição para a equipa.

### 4. Fase 3: Desenvolvimento do MVP (Sessões 7-12)

Esta lista contém as tarefas de desenvolvimento do Produto Mínimo Viável (MVP).

#### Cartões:

*   **Card: Implementação de User Journeys Core (FR-01, FR-02, FR-03)**
    *   **Descrição:** Implementar as jornadas de utilizador principais, incluindo endpoints de backend e páginas de frontend ligadas a dados reais.
    *   **Checklist:**
        *   Desenvolver os endpoints de backend para as entidades principais.
        *   Criar as páginas de frontend que consomem a API.
        *   Garantir que as operações CRUD básicas funcionam.
        *   Integrar o `docker-compose` para correr o stack completo localmente.

*   **Card: Validação, Testes e Observabilidade (FR-04, NFR-05)**
    *   **Descrição:** Implementar validação de input, testes unitários e expandir a suite de testes, incluindo logging e observabilidade básica.
    *   **Checklist:**
        *   Adicionar validação de input no cliente e no servidor.
        *   Escrever testes unitários para as funcionalidades críticas.
        *   Configurar logging e ferramentas de observabilidade básicas.
        *   Garantir que as mensagens de erro são significativas.

### 5. Fase 4: Entrega Final e Apresentação (Sessão 17)

Esta lista foca nas tarefas de finalização e apresentação do projeto.

#### Cartões:

*   **Card: Entrega Final do Produto e Apresentação**
    *   **Descrição:** Preparar a entrega final do produto e a apresentação, incluindo a versão final no Git e a documentação.
    *   **Checklist:**
        *   Garantir que o código está versionado no Git (v1.0.0).
        *   Preparar a apresentação final.
        *   Realizar um ensaio geral da apresentação.
        *   Garantir que toda a documentação está completa e atualizada.

### 6. Funcionalidades SmartFlow (Backlog de Features)

Esta lista contém as funcionalidades específicas do SmartFlow que podem ser desenvolvidas após o MVP ou em iterações futuras.

#### Cartões:

*   **Card: Website Institucional + Landing Page**
    *   **Descrição:** Desenvolver o website institucional com landing page, incluindo Hero Section com animações, simulação visual do sistema e formulário comercial.
    *   **Checklist:**
        *   Desenhar e implementar a Hero Section com animações.
        *   Criar a secção de simulação visual do sistema (mapa interativo).
        *   Implementar o formulário comercial.
        *   Garantir responsividade e otimização para SEO.

*   **Card: Página de Simulação SmartFlow**
    *   **Descrição:** Criar uma página visual e interativa para demonstrar o funcionamento do sistema, utilizando Leaflet, OpenStreetMap e OpenRouteService.
    *   **Checklist:**
        *   Integrar Leaflet e OpenStreetMap para o mapa base.
        *   Utilizar Overpass API para dados de semáforos e cruzamentos.
        *   Implementar cálculo de rotas com OpenRouteService.
        *   Desenvolver a simulação da ambulância em movimento.

*   **Card: Área Cliente (Municípios)**
    *   **Descrição:** Desenvolver a área de cliente para municípios, com dashboard, gestão de infraestrutura, relatórios, área financeira e suporte técnico.
    *   **Checklist:**
        *   Implementar o dashboard principal.
        *   Desenvolver a gestão de infraestrutura (cruzamentos).
        *   Criar módulos de relatórios e analytics.
        *   Integrar a área financeira com faturas Stripe.
        *   Implementar o sistema de suporte técnico.

*   **Card: Painel Administrativo (Super Admin)**
    *   **Descrição:** Desenvolver o painel administrativo para gestão total da operação, incluindo gestão de municípios, comercial, subscrições, técnica e financeira.
    *   **Checklist:**
        *   Implementar gestão de municípios (criação, aprovação, bloqueio).
        *   Desenvolver gestão comercial (leads, pipeline).
        *   Integrar gestão de subscrições com Stripe.
        *   Criar módulos de gestão técnica e financeira.

*   **Card: Sistema de Pagamentos (Stripe)**
    *   **Descrição:** Implementar o sistema de pagamentos e subscrições com Stripe, incluindo checkout, billing portal e automação via webhooks.
    *   **Checklist:**
        *   Configurar o checkout para pagamentos iniciais e recorrentes.
        *   Desenvolver o billing portal para gestão de pagamentos.
        *   Configurar webhooks para ativação/suspensão automática.
        *   Testar o fluxo completo de pagamentos.

## Datas Importantes 

*   **Entrega Final:** 26 de Junho de 2026 às 23h59.

As datas das sessões para cada fase devem ser consideradas para o planeamento detalhado de cada cartão. Por exemplo, a Fase 1 deve ser concluída até ao final da Sessão 3, a Fase 2 até ao final da Sessão 6, e assim por diante.

## Membros da Equipa

*   Tomás
*   Lucas
