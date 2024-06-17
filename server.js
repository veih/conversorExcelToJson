import express from 'express';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const FILES_DIR_SCP = 'C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\SCP\\PLANILHAS SCP 2024';
const FILES_DIR_SCA = 'C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\SCA\\PLANILHAS SCA 2024';
const FILES_DIR_SDAI = 'C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\SDAI\\PLANILHA-SDAI-2024';
const FILES_DIR_GESTAL = 'C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\GESTAL\\PLANILHAS GESTAL 2024';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/api/message", (req, res) => {
    res.json({ message: "Olá, esta é uma mensagem da API!" });
});

app.get('/api/file/scp/:filenamescp', async (req, res) => {
    try {
        const { filenamescp } = req.params;
        const filePath = path.join(FILES_DIR_SCP, filenamescp);
        const fileContent = await fs.readFile(filePath);
        res.send(fileContent);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).send('File not found');
        }
        res.status(500).send('Erro ao ler o arquivo');
    }
});

app.get('/api/file/sca/:filenamesca', async (req, res) => {
    try {
        const { filenamesca } = req.params;
        const filePath = path.join(FILES_DIR_SCA, filenamesca);
        const fileContent = await fs.readFile(filePath);
        res.send(fileContent);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).send('File not found');
        }
        res.status(500).send('Erro ao ler o arquivo');
    }
});

app.get('/api/file/sdai/:filenamesdai', async (req, res) => {
    try {
        const { filenamesdai } = req.params;
        const filePath = path.join(FILES_DIR_SDAI, filenamesdai);
        const fileContent = await fs.readFile(filePath);
        res.send(fileContent);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).send('File not found');
        }
        res.status(500).send('Erro ao ler o arquivo');
    }
});

app.get('/api/file/gestal/:filenamegestal', async (req, res) => {
    try {
        const { filenamegestal } = req.params;
        const filePath = path.join(FILES_DIR_GESTAL, filenamegestal);
        const fileContent = await fs.readFile(filePath);
        res.send(fileContent);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).send('File not found');
        }
        res.status(500).send('Erro ao ler o arquivo');
    }
});

app.post('/api/file/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const data = req.body;
        let fileDir;

        if (filename.endsWith('.scp')) {
            fileDir = FILES_DIR_SCP;
        } else if (filename.endsWith('.sca')) {
            fileDir = FILES_DIR_SCA;
        } else if (filename.endsWith('.sdai')) {
            fileDir = FILES_DIR_SDAI;
        } else {
            return res.status(400).send('Tipo de arquivo inválido');
        }

        const filePath = path.join(fileDir, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        res.send('Dados salvos com sucesso!');
    } catch (err) {
        res.status(500).send('Erro ao salvar o arquivo');
    }
});

(async () => {
    try {
        await fs.access(FILES_DIR_SCP);
        await fs.access(FILES_DIR_SCA);
        await fs.access(FILES_DIR_SDAI);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.mkdir(FILES_DIR_SCP, { recursive: true });
            await fs.mkdir(FILES_DIR_SCA, { recursive: true });
            await fs.mkdir(FILES_DIR_SDAI, { recursive: true });
        } else {
            console.error('Erro ao acessar o diretório de dados:', err);
        }
    }
})();

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, async () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    await open(`http://localhost:${port}`);
});
