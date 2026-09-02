import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 3000);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined
});
const editorToken = process.env.EDITOR_TOKEN;
const validTrimesters = new Set(['tri1', 'tri2', 'tri3']);
const validSubjects = new Set(['natureza', 'humanas', 'matematica', 'linguagens', 'tecds']);

app.use(cors());
app.use(express.json({ limit: '15mb' }));

async function initializeDatabase(){
  if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL não foi configurada.');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio_activities (
      trimester TEXT NOT NULL,
      subject TEXT NOT NULL,
      activities JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (trimester, subject)
    )
  `);
}

function validActivityRoute(req, res, next){
  const { tri, subject } = req.params;
  if(!validTrimesters.has(tri) || !validSubjects.has(subject)){
    return res.status(400).json({ error: 'Trimestre ou matéria inválidos.' });
  }
  next();
}

function requireEditor(req, res, next){
  if(!editorToken || req.get('x-editor-token') !== editorToken){
    return res.status(403).json({ error: 'Edição não autorizada.' });
  }
  next();
}

app.get('/api/activities/:tri/:subject', validActivityRoute, async (req, res) => {
  try{
    const result = await pool.query(
      'SELECT activities FROM portfolio_activities WHERE trimester = $1 AND subject = $2',
      [req.params.tri, req.params.subject]
    );
    res.json(result.rows[0]?.activities || []);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Não foi possível carregar as atividades.' });
  }
});

app.put('/api/activities/:tri/:subject', validActivityRoute, requireEditor, async (req, res) => {
  if(!Array.isArray(req.body)) return res.status(400).json({ error: 'O corpo deve ser uma lista de atividades.' });
  try{
    await pool.query(`
      INSERT INTO portfolio_activities (trimester, subject, activities, updated_at)
      VALUES ($1, $2, $3::jsonb, NOW())
      ON CONFLICT (trimester, subject)
      DO UPDATE SET activities = EXCLUDED.activities, updated_at = NOW()
    `, [req.params.tri, req.params.subject, JSON.stringify(req.body)]);
    res.status(204).end();
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Não foi possível salvar as atividades.' });
  }
});

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
app.use(express.static(currentDir));
app.get('*', (req, res) => res.sendFile(path.join(currentDir, 'index.html')));

initializeDatabase()
  .then(() => app.listen(port, () => console.log(`Portfolio disponível em http://localhost:${port}`)))
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });