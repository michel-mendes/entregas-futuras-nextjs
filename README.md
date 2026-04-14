# 📦 WMS - Gestão Logística e Rastreamento de Pisos/Porcelanatos
***Sistema de gerenciamento logístico de alta performance desenvolvido para solucionar gargalos de rastreamento de lotes, romaneios e entregas futuras em uma operação varejista de acabamentos.***

---

## 🎯 O Problema de Negócio (O Cenário)

A operação utilizava um sistema legado (desenvolvido em Delphi + MSSQL) focado exclusivamente no balcão de vendas. Este sistema apresentava falhas críticas na gestão física do estoque, impossibilitando a escala da operação:

- **Ausência de Controle de Lotes**: Pisos e porcelanatos exigem rastreio rigoroso de lote/tonalidade. Misturar lotes gera devoluções e prejuízos.

- **Entregas Futuras e Parciais**: O sistema legado não gerenciava compras onde o cliente retira os materiais fracionados ao longo de meses de obra.

- **Cegueira de Depósitos**: Não havia como rastrear a localização exata de paletes distribuídos em múltiplos depósitos físicos.

## 💡 A Solução e Impacto Real
Para não interromper o fluxo de caixa parando o sistema de vendas principal, desenvolvi esta aplicação paralela (SPA) utilizando Next.js, Sequelize (para integração de bancos **legado** + **aplicação adicional**) e MongoDB Atlas (persistência de dados de lotes **online** para consulta e alteração via mobile em depósitos sem acesso à LAN corporativa), operando como um microsserviço logístico integrado aos dados do sistema legado.

## 🚀 Resultados Alcançados

- **Escala de Capacidade**: O rastreamento digital de localizações permitiu dobrar a capacidade física de armazenamento sem perda de controle. O estoque médio saltou de 2.000m² para um volume operado de 9.000 a 10.000m².

- **Redução de Tempo Operacional**: A separação de romaneios de entrega, que antes dependia de memória visual de estoquistas, passou a ser guiada pelo sistema (indicando Depósito e Lote exatos), derrubando o tempo de carregamento de caminhões e zerando erros de expedição de lotes misturados.

## 🏗️ Arquitetura e Decisões Técnicas
O projeto foge do acoplamento padrão do Next.js (Server Actions misturadas com banco de dados) e implementa uma Arquitetura em Camadas rigorosa para garantir manutenibilidade, testabilidade e separação de responsabilidades (Separation of Concerns).

O fluxo de dados obedece estritamente a 5 camadas:

- **Controller (API Routes)**: Ponto de entrada. Recebe a requisição HTTP e mapeia a resposta, sem regras de negócio.

- **DTO (Data Transfer Object)**: Validação rígida de entrada e saída utilizando Zod. Garante que payloads malformados nunca cheguem ao domínio da aplicação.

- **Service (Camada de Domínio)**: O "cérebro" da aplicação. Contém 100% das regras de negócio (ex: validação condicional de métricas físicas baseadas na categoria do produto, como M² para porcelanatos e Kg para argamassas). Não possui conhecimento sobre requisições HTTP ou qual banco está sendo acessado.

- **Repository**: O tradutor de dados. Única camada autorizada a construir queries (Mongoose / Sequelize), garantindo que o Service seja agnóstico a banco de dados.

- **Model**: Definição dos esquemas e tipagens.

---

## Frontend

- Utilização de React Hook Form integrado nativamente com os mesmos Zod DTOs do backend, garantindo Single Source of Truth (Fonte Única de Verdade) para regras de validação.

- Abordagem de State Hydration segura nas edições de formulários.

- UI Responsiva focada em Alta Densidade de Informação, priorizando a operação ágil em dispositivos móveis nos pátios de expedição.

## ⚙️ Funcionalidades Atuais
- ✅ **Gestão Base de Produtos**: CRUD completo com Soft Delete (Inativação para manter integridade histórica de notas fiscais).

- ✅ **Validação Condicional**: Exigência de peso/m² variável de acordo com a categoria logística do material.

- [ ] *Gestão de Lotes*: Controle de saldo, tonalidade e mapeamento físico (Depósito/Rua/Palete). **(Em desenvolvimento)**

- [ ] Romaneios e Entregas Parciais: Orquestração de saídas fracionadas de estoque. **(Em desenvolvimento)**

## 💻 Como rodar o projeto localmente
### 1. Clone o repositório
```
git clone https://github.com/michel-mendes/entregas-futuras-nextjs.git
```

### 2. Instale as dependências
```
npm install
```

### 3. Configure as variáveis de ambiente (Preencha as credenciais do MongoDB e portas)
```
cp .env.example .env.local
```

### 4. Inicie o servidor de desenvolvimento
```
npm run dev
```

Acesse http://localhost:3000 para visualizar a aplicação.


## 🧪 Testes e Qualidade

Este projeto adota uma abordagem rigorosa para testes de software, focando no isolamento de regras de negócio.

- **Framework:** Jest + TS-Jest
- **Estratégia:** Testes Unitários isolados na camada de **Service** (Core da aplicação).
- **Mocking:** O acesso a dados (Repository) e validações de rede são "mockados" para garantir que os testes rodem de forma rápida, determinística e sem dependência de um banco de dados real (MongoDB).

Para rodar a suíte de testes localmente:

```
npm run test
```