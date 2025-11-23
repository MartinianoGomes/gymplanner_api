# 🏋️ GymPlanner API

API central para o projeto GymPlanner. Este repositório contém toda a estrutura e o código do back-end, responsável pelo gerenciamento de usuários, treinos e exercícios.

## ✨ Funcionalidades

* **Autenticação:** Sistema de registro e login de usuários com JWT.
* **Gerenciamento de Usuários:** CRUD de usuários (para administradores).
* **Grupos Musculares:** CRUD para categorizar exercícios (ex: "Peito", "Costas").
* **Exercícios:** CRUD de exercícios, com associação a um grupo muscular.
* **Treinos (Workouts):**
    - Criação de treinos (workouts) com título, descrição e dia.
    - Adição de exercícios a um treino (com séries e repetições).
    - Remoção de exercícios de um treino.

## 🚀 Stack Tecnológica

* **Linguagem:** TypeScript
* **Runtime:** Node.js
* **Framework:** Fastify
* **ORM:** Prisma
* **Banco de Dados:** MongoDB
* **Validação de Dados:** Zod
* **Autenticação:** JWT (JSON Web Tokens)

---

## 🏁 Começando

Siga estes passos para configurar e executar o projeto localmente.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (v18 ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* Uma instância do [MongoDB](https://www.mongodb.com/) (local ou Atlas)

### Instalação

1.  Clone o repositório:
    

```bash
    git clone https://github.com/MartinianoGomes/gymplanner-api.git
    cd gymplanner-api
```

2.  Instale as dependências:
    

```bash
    npm install
```

3.  Configure as variáveis de ambiente. Crie um arquivo `.env` na raíz do projeto, copiando o `.env.example` ou adicionando as seguintes chaves:
    

```env
    # String de conexão do seu banco de dados MongoDB
    DATABASE_URL="mongodb+srv://..."
    
    # Segredo para assinatura do JWT
    JWT_SECRET="seu-segredo-super-secreto"
    
    # Define o ambiente (development ou production)
    NODE_ENV="development"
    
    # Porta em que o servidor irá rodar
    PORT=3000
```

4.  Gere o cliente Prisma:
    

```bash
    npm run generate
```

5.  Sincronize o schema do Prisma com seu banco:
    

```bash
    npm run push
```

6.  Inicie o servidor de desenvolvimento:
    

```bash
    npm run dev
```

7.  O servidor estará rodando em `http://localhost:3000`.

---

## 📝 Scripts Disponíveis

* `npm run dev` - Inicia o servidor de desenvolvimento com hot reload (usando tsx)
* `npm run generate` - Gera o cliente Prisma baseado no schema
* `npm run push` - Sincroniza o schema do Prisma com o banco de dados
* `npm test` - Executa os testes (ainda não implementado)

---

## 🐳 Executar com Docker

Para executar o projeto usando Docker (recomendado para produção):

```bash
# Build e inicia os containers
docker-compose up --build -d

# Visualizar logs
docker-compose logs -f api
```

A API estará disponível em `http://localhost:3000`

---

## 📚 Documentação da API

A API está documentada usando OpenAPI (Swagger). Após iniciar o servidor, a documentação interativa estará disponível em:

**[http://localhost:3000/docs](http://localhost:3000/docs)**

## 🧑‍💻 Autores

* [@martinianogomes](https://github.com/MartinianoGomes)
* [@correasouza](https://github.com/correasouza)
* [@lucassmotta](https://github.com/lucassmotta)
* [@Michelangelo-Costa](https://github.com/Michelangelo-Costa)
