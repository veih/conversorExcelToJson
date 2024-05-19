import express from 'express';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises'; // módulo fs com promises

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const FILES_DIR = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\projetos';

// Endpoint da API que retorna uma mensagem simples
app.get('/api/message', (req, res) => {
    res.json({ message: 'Olá, esta é uma mensagem da API!' });
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota para listar todos os arquivos na pasta especificada
app.get('/api/files', async (req, res) => {
    try {
        const files = await fs.readdir(FILES_DIR);
        res.json(files);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao listar os arquivos');
    }
});

// Rota para servir um arquivo específico da pasta
app.get('/api/file/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(FILES_DIR, filename);
        const fileContent = await fs.readFile(filePath);
        res.send(fileContent);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler o arquivo');
    }
});

// Rota para servir o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, async () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    await open(`http://localhost:${port}`);
});
