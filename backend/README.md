# Backend API - Coop

Backend para integração com a API da OpenAI, resolvendo problemas de CORS e mantendo as chaves API seguras.

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e adicione sua chave da OpenAI:
```
OPENAI_API_KEY=sua-chave-aqui
PORT=3001
```

## Como Rodar

### Desenvolvimento (com hot reload):
```bash
npm run dev
```

### Produção:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3001`

## Endpoints Disponíveis

### Health Check
```
GET /api/health
```

### Criar Thread
```
POST /api/threads
```

### Adicionar Mensagem
```
POST /api/threads/:threadId/messages
Body: { "content": "mensagem do usuário" }
```

### Executar Assistant
```
POST /api/threads/:threadId/runs
Body: { "assistant_id": "id-do-assistant" }
```

### Verificar Status do Run
```
GET /api/threads/:threadId/runs/:runId
```

### Obter Mensagens
```
GET /api/threads/:threadId/messages
```

## Segurança

- A chave API da OpenAI está protegida no backend
- CORS está configurado para aceitar requisições do frontend
- O arquivo `.env` está no `.gitignore` para não expor credenciais
