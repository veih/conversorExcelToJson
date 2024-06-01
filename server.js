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
// configuração da empresa

// const FILES_DIR = 'C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\SCP';
// const FILES_DIR_SCA = 'C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\SCA';
// const FILES_DIR_SDAI = 'C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\SDAI\\PLANILHA-SDAI-2024';

// configuração de casa

const FILES_DIR = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\teste';
const FILES_DIR_SCA = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\teste';
const FILES_DIR_SDAI = 'C:\\Users\\tanck\\OneDrive\\Área de Trabalho\\teste';

// Middleware para lidar com JSON no corpo da requisição
app.use(express.json());

// Endpoint da API que retorna uma mensagem simples
app.get('/api/message', (req, res) => {
    res.json({ message: 'Olá, esta é uma mensagem da API!' });
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota para listar todos os arquivos na pasta especificada
async function listAllFiles(dir) {
    let fileList = [];
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            const subDirFiles = await listAllFiles(fullPath);
            fileList = fileList.concat(subDirFiles);
        } else {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

app.get('/api/files', async (req, res) => {
    try {
        const filenames = await fs.readdir(FILES_DIR);
        const filenamesSCA = await fs.readdir(FILES_DIR_SCA);
        const filenamesSDAI = await fs.readdir(FILES_DIR_SDAI);

        if (!filenames.length && !filenamesSCA.length && !filenamesSDAI.length) {
            return res.status(404).send('No files found in the specified directories.');
        }

        const allFilenames = filenames.concat(filenamesSCA, filenamesSDAI, filenamesSDAI);

        const fileData = await Promise.all(
            allFilenames.map(async (filename) => {
                let dir;
                if (filenames.includes(filename)) {
                    dir = FILES_DIR;
                } else if (filenamesSCA.includes(filename)) {
                    dir = FILES_DIR_SCA;
                } else if (filenamesSDAI.includes(filename)) {
                    dir = FILES_DIR_SDAI;
                }
                return {
                    filename,
                    content: await fs.readFile(path.join(dir, filename), 'utf8'), // Read content with encoding
                };
            })
        );

        res.json(fileData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error.'); // More generic error message for security
    }
});


// Rota para servir um arquivo específico da pasta SCP
app.get('/api/file/:filename', async (req, res) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).send('Filename is required');
        }

        const filePath = path.join(FILES_DIR, filename);
        const fileContent = await fs.readFile(filePath);
        res.send(fileContent);
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
        const fileContent = await fs.readFile(filePath);
        res.send(fileContent);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler o arquivo');
    }
});

app.get('/api/file/sdai/:filenamesdai', async (req, res) => {
    try {
        const { filenamesdai } = req.params;

        if (!filenamesdai) {
            return res.status(400).send('Filename is required');
        }

        const filePath = path.join(FILES_DIR_SDAI, filenamesdai);
        const fileContent = await fs.readFile(filePath);
        res.send(fileContent);
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

        const filePath = path.join(FILES_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2)); // Pretty-printed JSON
        res.send('Dados salvos com sucesso!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar o arquivo');
    }
});

// Certifique-se de que o diretório de dados exista (se necessário)
(async () => {
    try {
        await fs.access(FILES_DIR);
        await fs.access(FILES_DIR_SCA);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('Diretório de dados não encontrado. Criando...');
            await fs.mkdir(FILES_DIR, { recursive: true });
            await fs.mkdir(FILES_DIR_SCA, { recursive: true });
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
