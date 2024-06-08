import express from 'express';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import XLSX from 'xlsx'; // Importando a biblioteca xlsx

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// configuração de casa
const FILES_DIR_SCP = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\teste';
const FILES_DIR_SCA = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\teste';
const FILES_DIR_SDAI = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\teste';
const FILES_DIR_GESTAL = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\teste';

// Middleware para lidar com JSON no corpo da requisição
app.use(express.json());

// Endpoint da API que retorna uma mensagem simples
app.get('/api/message', (req, res) => {
    res.json({ message: 'Olá, esta é uma mensagem da API!' });
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Função para listar todos os arquivos na pasta especificada
app.get('/api/files/all', async (req, res) => {
    try {
        const directories = [FILES_DIR_SCP, FILES_DIR_SCA, FILES_DIR_SDAI, FILES_DIR_GESTAL];
        let allFiles = [];

        for (const dir of directories) {
            const files = await fs.readdir(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const fileContent = await excelToJson(filePath);
                allFiles.push({ filename: file, content: fileContent });
            }
        }

        res.json(allFiles);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler os arquivos');
    }
});

// Certifique-se de que os diretórios de dados existam (se necessário)
(async () => {
    try {
        await fs.access(FILES_DIR_SCP);
        await fs.access(FILES_DIR_SCA);
        await fs.access(FILES_DIR_SDAI);
        await fs.access(FILES_DIR_GESTAL);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('Diretório de dados não encontrado. Criando...');
            await fs.mkdir(FILES_DIR_SCP, { recursive: true });
            await fs.mkdir(FILES_DIR_SCA, { recursive: true });
            await fs.mkdir(FILES_DIR_SDAI, { recursive: true });
            await fs.mkdir(FILES_DIR_GESTAL, { recursive: true });
        } else {
            console.error('Erro ao acessar o diretório de dados:', err);
        }
    }
})();

// Função para converter arquivo Excel em JSON
async function excelToJson(filePath) {
    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
    return jsonData;
}

// Rota para servir um arquivo específico da pasta SCP
app.get('/api/file/scp/:filename', async (req, res) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).send('Filename is required');
        }

        const filePath = path.join(FILES_DIR_SCP, filename);
        const fileContent = await excelToJson(filePath);
        res.json(fileContent);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler o arquivo');
    }
});

// Rota para servir um arquivo específico da pasta SCA
app.get('/api/file/sca/:filename', async (req, res) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).send('Filename is required');
        }

        const filePath = path.join(FILES_DIR_SCA, filename);
        const fileContent = await excelToJson(filePath);
        res.json(fileContent);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler o arquivo');
    }
});

app.get('/api/file/sdai/:filename', async (req, res) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).send('Filename is required');
        }

        const filePath = path.join(FILES_DIR_SDAI, filename);
        const fileContent = await excelToJson(filePath);
        res.json(fileContent);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler o arquivo');
    }
});

app.get('/api/file/gestal/:filename', async (req, res) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).send('Filename is required');
        }

        const filePath = path.join(FILES_DIR_GESTAL, filename);
        const fileContent = await excelToJson(filePath);
        res.json(fileContent);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler o arquivo');
    }
});

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

        const filePath = path.join(FILES_DIR_SCP, filename);
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
        await fs.access(FILES_DIR_GESTAL);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('Diretório de dados não encontrado. Criando...');
            await fs.mkdir(FILES_DIR_SCP, { recursive: true });
            await fs.mkdir(FILES_DIR_SCA, { recursive: true });
            await fs.mkdir(FILES_DIR_SDAI, { recursive: true });
            await fs.mkdir(FILES_DIR_GESTAL, { recursive: true });
        } else {
            console.error('Erro ao acessar o diretório de dados:', err);
        }
    }
})();

// Rota para servir o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, async () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    await open(`http://localhost:${port}`);
});
