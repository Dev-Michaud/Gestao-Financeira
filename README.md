# Controle de Gastos Residenciais

Sistema separado em **WebAPI** (ASP.NET Core + SQLite) e **Frontend** (React + TypeScript).

---

## Estrutura

```
gastos/
├── WebApi/          # ASP.NET Core 8 — porta 5000
│   ├── Models/      # Entidades e enums
│   ├── Data/        # DbContext (EF Core + SQLite)
│   └── Controllers/ # Pessoas, Categorias, Transações, Relatórios
│
└── Frontend/        # React + TypeScript (Vite) — porta 5173
    └── src/
        ├── types/   # Interfaces TypeScript
        ├── services/ # Chamadas HTTP para a WebAPI
        └── pages/   # PessoasPage, CategoriasPage, TransacoesPage, RelatorioPage
```

---

## Como executar

### 1. WebAPI

```bash
cd WebApi
dotnet run
```

A API sobe em `http://localhost:5000`.  
O banco **gastos.db** é criado automaticamente na primeira execução.

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

---

## Endpoints da API

| Método | Rota                        | Descrição                        |
|--------|-----------------------------|----------------------------------|
| GET    | /api/pessoas                | Lista pessoas                    |
| POST   | /api/pessoas                | Cria pessoa                      |
| PUT    | /api/pessoas/{id}           | Edita pessoa                     |
| DELETE | /api/pessoas/{id}           | Deleta pessoa (cascade)          |
| GET    | /api/categorias             | Lista categorias                 |
| POST   | /api/categorias             | Cria categoria                   |
| GET    | /api/transacoes             | Lista transações                 |
| POST   | /api/transacoes             | Cria transação                   |
| GET    | /api/relatorios/categorias  | Totais por categoria             |

---

## Regras de negócio

- Ao **deletar uma pessoa**, todas as transações dela são removidas automaticamente.
- **Menores de 18 anos** só podem registrar transações do tipo **Despesa**.
- A **categoria** deve ser compatível com o tipo da transação:
  - Transação `Despesa` → categoria com finalidade `Despesa` ou `Ambas`
  - Transação `Receita` → categoria com finalidade `Receita` ou `Ambas`
- O frontend já **filtra as categorias** disponíveis conforme o tipo selecionado.

---

## Persistência

Os dados são salvos no arquivo `WebApi/gastos.db` (SQLite).  
O banco persiste entre reinicializações do sistema.

---

##Agradecimentos

Desenvolvedor - Luis Michaud
