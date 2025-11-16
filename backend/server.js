import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Verificar se a API key está configurada
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY não está configurada no arquivo .env');
  process.exit(1);
}

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend está funcionando!' });
});

// Criar uma thread
app.post('/api/threads', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'Failed to create thread' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Adicionar mensagem a uma thread
app.post('/api/threads/:threadId/messages', async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content } = req.body;

    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        role: 'user',
        content: content,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'Failed to add message' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Executar assistant em uma thread
app.post('/api/threads/:threadId/runs', async (req, res) => {
  try {
    const { threadId } = req.params;
    const { assistant_id } = req.body;

    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: assistant_id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'Failed to run assistant' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error running assistant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verificar status de um run
app.get('/api/threads/:threadId/runs/:runId', async (req, res) => {
  try {
    const { threadId, runId } = req.params;

    const response = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'Failed to get run status' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error getting run status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Obter mensagens de uma thread
app.get('/api/threads/:threadId/messages', async (req, res) => {
  try {
    const { threadId } = req.params;

    const response = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'Failed to get messages' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`✅ CORS habilitado`);
  console.log(`✅ OpenAI API Key configurada`);
});
