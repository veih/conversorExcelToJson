document.addEventListener('DOMContentLoaded', function () {

    const loadButtonScp = document.getElementById('loadButtonScp');
    const loadButtonSca = document.getElementById('loadButtonSca');
    const loadButtonSdai = document.getElementById('loadButtonSdai');
    const loadButtonGestal = document.getElementById('loadButtonGestal');

    const tableOutput = document.getElementById('tableOutput');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    const editButton = document.getElementById('editButton');
    const saveChangesButton = document.getElementById('saveChangesButton');

    let jsonData = []; // Variável global para armazenar os dados do Excel
    let currentCardIndex = null; // Índice do card atualmente aberto no modal
    let originalFileName = ''; // Variável para armazenar o nome do arquivo original

    async function fetchExcelFileScp() {
        const filenamescp = 'cliente veronica.xlsx'; // Substitua pelo nome do arquivo que você deseja ler
        const url = `http://localhost:3000/api/file/scp/${filenamescp}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching the file');
            }
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });

            const allSheetData = workbook.SheetNames.map(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                return { sheetName, data: jsonData };
            });

            allSheetData.forEach(sheet => {
                console.log(`Data from sheet "${sheet.sheetName}":`, sheet.data);
                displayData(sheet.sheetName, sheet.data); // Call displayData with sheet name and data
            });
        } catch (error) {
            console.error('Error loading the Excel file:', error);
        }
    }

    async function fetchExcelFileSca() {
        const filenamesca = 'Planilha-Teste-de-Excel-Nivel-Intermediario-1.xlsx'; // Substitua pelo nome do arquivo que você deseja ler
        const url = `http://localhost:3000/api/file/sca/${filenamesca}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching the file');
            }
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });

            const allSheetData = workbook.SheetNames.map(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                return { sheetName, data: jsonData };
            });

            allSheetData.forEach(sheet => {
                console.log(`Data from sheet "${sheet.sheetName}":`, sheet.data);
                displayData(sheet.sheetName, sheet.data); // Call displayData with sheet name and data
            });
        } catch (error) {
            console.error('Error loading the Excel file:', error);
        }
    }

    async function fetchExcelFileSdai() {
        const filenamesdai = 'Planilha-Teste-de-Excel-Nivel-Intermediario-1.xlsx'; // Substitua pelo nome do arquivo que você deseja ler
        const url = `http://localhost:3000/api/file/sdai/${filenamesdai}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching the file');
            }
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });

            const allSheetData = workbook.SheetNames.map(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                return { sheetName, data: jsonData };
            });

            allSheetData.forEach(sheet => {
                console.log(`Data from sheet "${sheet.sheetName}":`, sheet.data);
                displayData(sheet.sheetName, sheet.data); // Call displayData with sheet name and data
            });
        } catch (error) {
            console.error('Error loading the Excel file:', error);
        }
    }

    async function fetchExcelFileGestal() {
        const filenamegestal = 'Planilha-Teste-de-Excel-Nivel-Intermediario-1.xlsx'; // Substitua pelo nome do arquivo que você deseja ler
        const url = `http://localhost:3000/api/file/gestal/${filenamegestal}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching the file');
            }
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });

            const allSheetData = workbook.SheetNames.map(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                return { sheetName, data: jsonData };
            });

            allSheetData.forEach(sheet => {
                console.log(`Data from sheet "${sheet.sheetName}":`, sheet.data);
                displayData(sheet.sheetName, sheet.data); // Call displayData with sheet name and data
            });
        } catch (error) {
            console.error('Error loading the Excel file:', error);
        }
    }

    // Evento de clique para o botão de busca
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Função para realizar a busca
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = jsonData.filter(row =>
            row.some(cell => cell && cell.toString().toLowerCase().includes(searchTerm))
        );
        displayData([jsonData[0], ...filteredData]); // Mantém o cabeçalho e adiciona os dados filtrados
    }

    loadButtonScp.addEventListener('click', () => fetchExcelFileScp('data', 'SCP.xlsx'));
    loadButtonSca.addEventListener('click', () => fetchExcelFileSca('data', 'SCA.xlsx'));
    loadButtonSdai.addEventListener('click', () => fetchExcelFileSdai('data', 'SDAI.xlsx'));
    loadButtonGestal.addEventListener('click', () => fetchExcelFileGestal('data', 'GESTAL.xlsx'));


    // Função para exibir os dados na tabela de cards
    function displayData(sheetName, data) {
        tableOutput.innerHTML = ''; // Limpa a saída anterior
        const headers = data[0]; // Cabeçalhos da tabela
        console.log(data)
        data.slice(1).forEach((row, i) => {
            const cardId = `card-${i + 1}`; // ID único para cada card
            const cardHTML = `
    <div class="col">
        <div class="card bg-light shadow">
            <div class="card-body">
                <h5 class="card-title">${row[0] !== undefined ? row[0] : ''}</h5>
                <p class="card-text">${row[1] !== undefined ? row[1] : ''}</p>
                <p class="card-text">${row[2] !== undefined ? row[2] : ''}</p>
                <div class="d-grid gap-2">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-card-index="${i + 1}">
                        Ver
                    </button>
                </div>
            </div>
        </div>
    </div>`;
            tableOutput.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Adicionar evento de clique dinâmico aos botões do card
        document.querySelectorAll('[data-card-index]').forEach(button => {
            button.addEventListener('click', function () {
                currentCardIndex = parseInt(button.getAttribute('data-card-index'), 10);
                const cardData = data[currentCardIndex];
                modalTitle.textContent = cardData[0];
                modalBody.innerHTML = `
                            <div class="container mt-3">
                                <table class="table table-bordered">
                                    <thead class="thead-dark">
                                        <tr>
                                            <th>Campo</th>
                                            <th>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${headers.map((header, index) => `
                                            <tr>
                                                <th>${header}</th>
                                                <td><input type="text" class="form-control border-0" value="${cardData[index] !== undefined ? cardData[index] : ''}" data-header-index="${index}" readonly></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>`;
                editButton.classList.remove('d-none');
                saveChangesButton.classList.add('d-none');
            });
        });
    }

    // Evento de clique para o botão de editar no modal
    editButton.addEventListener('click', function () {
        modalBody.querySelectorAll('input[data-header-index]').forEach(input => {

            input.removeAttribute('readonly');
        });
        editButton.classList.add('d-none');
        saveChangesButton.classList.remove('d-none');
    });

    // Evento de clique para o botão de salvar no modal
    saveChangesButton.addEventListener('click', async function () {
        const inputs = modalBody.querySelectorAll('input[data-header-index]');
        inputs.forEach(input => {
            const index = input.getAttribute('data-header-index');
            jsonData[currentCardIndex][index] = input.value;
        });

        // Re-exibir os dados atualizados
        displayData(jsonData);

        // Fechar o modal
        const modalElement = document.querySelector('#exampleModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        // Salvar a planilha atualizada no servidor
        const response = await fetch(`/api/file/${originalFileName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

        if (!response.ok) {
            console.error('Erro ao salvar o arquivo:', response.statusText);
        }
    });

    // Carregar o arquivo Excel automaticamente ao carregar a página
    // fetchExcelFile();
});