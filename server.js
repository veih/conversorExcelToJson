import express from 'express';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises'; // módulo fs com promises

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const FILES_DIR_SCP = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\teste';
const FILES_DIR_SCA = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\teste';
const FILES_DIR_SDAI = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\teste';

// Middleware para lidar com JSON no corpo da requisição
app.use(express.json());

// Endpoint da API que retorna uma mensagem simples
app.get("/api/message", (req, res) => {
    res.json({ message: "Olá, esta é uma mensagem da API!" });
});

app.use(express.static(path.join(__dirname, "public")));

// Rota para servir um arquivo específico da pasta SCP
app.get('/api/file/scp/:filenamescp', async (req, res) => {
    try {
        const { filenamescp } = req.params;

        if (!filenamescp) {
            return res.status(400).send('Filename is required');
        }

        const filePath = path.join(FILES_DIR_SCP, filenamescp);

        try {
            await fs.access(filePath); // Verifica se o arquivo existe
            const fileContent = await fs.readFile(filePath);
            res.send(fileContent);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('File not found');
            }
            throw err;
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler o arquivo');
    }
});

// Rota para servir um arquivo específico da pasta SCA
app.get('/api/file/sca/:filenamesca', async (req, res) => {
    try {
        const { filenamesca } = req.params;

        if (!filenamesca) {
            return res.status(400).send('Filename is required');
        }

        const filePath = path.join(FILES_DIR_SCA, filenamesca);

        try {
            await fs.access(filePath); // Verifica se o arquivo existe
            const fileContent = await fs.readFile(filePath);
            res.send(fileContent);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('File not found');
            }
            throw err;
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler o arquivo');
    }
});

// Rota para servir um arquivo específico da pasta SDAI
app.get('/api/file/sdai/:filenamesdai', async (req, res) => {
    try {
        const { filenamesdai } = req.params;

        if (!filenamesdai) {
            return res.status(400).send('Filename is required');
        }

        const filePath = path.join(FILES_DIR_SDAI, filenamesdai);

        try {
            await fs.access(filePath); // Verifica se o arquivo existe
            const fileContent = await fs.readFile(filePath);
            res.send(fileContent);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('File not found');
            }
            throw err;
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler o arquivo');
    }
});

// Rota para salvar um arquivo específico
app.post('/api/file/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const data = req.body; // Espera-se os dados editados no corpo da requisição

        if (!data) {
            return res.status(400).send('Dados editados ausentes na requisição');
        }

        if (!filename) {
            return res.status(400).send('Filename is required');
        }

        // Verifica o diretório com base na extensão do arquivo
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
        await fs.writeFile(filePath, JSON.stringify(data, null, 2)); // Pretty-printed JSON
        res.send('Dados salvos com sucesso!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar o arquivo');
    }
});

// Certifique-se de que os diretórios de dados existam (se necessário)
(async () => {
    try {
        await fs.access(FILES_DIR_SCP);
        await fs.access(FILES_DIR_SCA);
        await fs.access(FILES_DIR_SDAI);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('Diretório de dados não encontrado. Criando...');
            await fs.mkdir(FILES_DIR_SCP, { recursive: true });
            await fs.mkdir(FILES_DIR_SCA, { recursive: true });
            await fs.mkdir(FILES_DIR_SDAI, { recursive: true });
        } else {
            console.error('Erro ao acessar o diretório de dados:', err);
        }
    }
})();

// Rota para servir o index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, async () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    await open(`http://localhost:${port}`);
});
