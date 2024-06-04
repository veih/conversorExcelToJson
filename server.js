import express from "express";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs/promises"; // módulo fs com promises

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const FILES_DIR_SCP = "C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\SCP";
const FILES_DIR_SCA = "C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\SCA";
const FILES_DIR_SDAI = "C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\SDAI\\PLANILHA-SDAI-2024";
const FILES_DIR_GESTAL = "C:\\Users\\RMSF_SDAI\\OneDrive\\Analistas\\GESTAL";

// Middleware para lidar com JSON no corpo da requisição
app.use(express.json());

// Endpoint da API que retorna uma mensagem simples
app.get("/api/message", (req, res) => {
  res.json({ message: "Olá, esta é uma mensagem da API!" });
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/files", async (req, res) => {
  try {
    const filenamesSCP = await fs.readdir(FILES_DIR_SCP);
    const filenamesSCA = await fs.readdir(FILES_DIR_SCA);
    const filenamesSDAI = await fs.readdir(FILES_DIR_SDAI);
    const filenamesGESTAL = await fs.readdir(FILES_DIR_GESTAL);

    if (
      !filenamesSCP.length &&
      !filenamesSCA.length &&
      !filenamesSDAI.length &&
      !filenamesGESTAL.length
    ) {
      return res
        .status(404)
        .send("No files found in the specified directories.");
    }

    const allFilenames = [
      ...filenamesSCP.map((filename) => ({ filename, dir: FILES_DIR_SCP })),
      ...filenamesSCA.map((filename) => ({ filename, dir: FILES_DIR_SCA })),
      ...filenamesSDAI.map((filename) => ({ filename, dir: FILES_DIR_SDAI })),
      ...filenamesGESTAL.map((filename) => ({
        filename,
        dir: FILES_DIR_GESTAL,
      })),
    ];

    const fileData = await Promise.all(
      allFilenames.map(async ({ filename, dir }) => {
        const filePath = path.join(dir, filename);
        try {
          const content = await fs.readFile(filePath, "utf8");
          return { filename, content };
        } catch (err) {
          console.error(`Error reading file ${filePath}:`, err);
          return { filename, error: "Error reading file" };
        }
      })
    );

    res.json(fileData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error."); // More generic error message for security
  }
});

// Rota para servir um arquivo específico de qualquer pasta
app.get("/api/file/:folder/:filename", async (req, res) => {
  try {
    const { folder, filename } = req.params;
    let filePath;

    switch (folder) {
      case "scp":
        filePath = path.join(FILES_DIR_SCP, filename);
        break;
      case "sca":
        filePath = path.join(FILES_DIR_SCA, filename);
        break;
      case "sdai":
        filePath = path.join(FILES_DIR_SDAI, filename);
        break;
      case "gestal":
        filePath = path.join(FILES_DIR_GESTAL, filename);
        break;
      default:
        return res.status(400).send("Invalid folder");
    }

    try {
      const fileContent = await fs.readFile(filePath);
      res.send(fileContent);
    } catch (err) {
      if (err.code === "ENOENT") {
        return res.status(404).send("File not found");
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao ler o arquivo");
  }
});

app.post("/api/file/:folder/:filename", async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const data = req.body; // Espera-se os dados editados no corpo da requisição
    let filePath;

    if (!data) {
      return res.status(400).send("Dados editados ausentes na requisição");
    }

    switch (folder) {
      case "scp":
        filePath = path.join(FILES_DIR_SCP, filename);
        break;
      case "sca":
        filePath = path.join(FILES_DIR_SCA, filename);
        break;
      case "sdai":
        filePath = path.join(FILES_DIR_SDAI, filename);
        break;
      case "gestal":
        filePath = path.join(FILES_DIR_GESTAL, filename);
        break;
      default:
        return res.status(400).send("Invalid folder");
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2)); // Pretty-printed JSON
    res.send("Dados salvos com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao salvar o arquivo");
  }
});

// Certifique-se de que o diretório de dados exista (se necessário)
(async () => {
  try {
    await fs.access(FILES_DIR_SCP);
    await fs.access(FILES_DIR_SCA);
    await fs.access(FILES_DIR_SDAI);
    await fs.access(FILES_DIR_GESTAL);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("Diretório de dados não encontrado. Criando...");
      await fs.mkdir(FILES_DIR_SCP, { recursive: true });
      await fs.mkdir(FILES_DIR_SCA, { recursive: true });
      await fs.mkdir(FILES_DIR_SDAI, { recursive: true });
      await fs.mkdir(FILES_DIR_GESTAL, { recursive: true });
    } else {
      console.error("Erro ao acessar o diretório de dados:", err);
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
