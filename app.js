const seriesGrid = document.getElementById('seriesGrid');
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const saveSeriesBtn = document.getElementById('saveSeries');

// Elementos do player de vídeo
const videoModal = document.getElementById('videoModal');
const closeVideoModalBtn = document.getElementById('closeVideoModal');
const videoPlayer = document.getElementById('videoPlayer');

// 🌟 Novos elementos da janela de confirmação
const confirmModal = document.getElementById('confirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
let indexToDelete = null; // Guarda a fita que está prestes a ser apagada

// Carregar dados salvos ou iniciar array vazio
let mySeries = JSON.parse(localStorage.getItem('miiSeriesData')) || [];

function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function renderGrid() {
    seriesGrid.innerHTML = '';
    
    mySeries.forEach((serie, index) => {
        const videoId = getYouTubeId(serie.link);
        let thumbUrl = serie.image;

        if (!thumbUrl || thumbUrl.trim() === "") {
            thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500';
        }

        const card = document.createElement('div');
        card.classList.add('card');
        
        card.innerHTML = `
            <button class="remove-btn" title="Remover Série">X</button>
            <img src="${thumbUrl}" alt="${serie.name}" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'">
            <h3>${serie.name}</h3>
            <p style="font-size: 0.7rem; color: #00e1ff; letter-spacing: 2px;">STREAM LIVE</p>
        `;

        card.onclick = () => {
            if (videoId) {
                videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                videoModal.style.display = 'flex';
            } else {
                alert("Link inválido do YouTube.");
            }
        };

        // MODIFICADO: Dispara a nova janela de confirmação em vez do confirm() nativo
        const deleteBtn = card.querySelector('.remove-btn');
        deleteBtn.onclick = (e) => {
            e.stopPropagation(); // Não deixa o vídeo abrir ao clicar no X
            askToRemove(index);
        };

        seriesGrid.appendChild(card);
    });
}

// Abre a tela de confirmação e memoriza o índice do item
function askToRemove(index) {
    indexToDelete = index;
    confirmModal.style.display = 'flex';
}

// Ação 1: "Não, desejo manter" -> Cancela tudo e fecha
cancelDeleteBtn.onclick = () => {
    confirmModal.style.display = 'none';
    indexToDelete = null;
};

// Ação 2: "Sim, quero excluir" -> Deleta, atualiza o banco e fecha
confirmDeleteBtn.onclick = () => {
    if (indexToDelete !== null) {
        mySeries.splice(indexToDelete, 1);
        localStorage.setItem('miiSeriesData', JSON.stringify(mySeries));
        renderGrid();
        
        confirmModal.style.display = 'none';
        indexToDelete = null;
    }
};

// Fechar Player de Vídeo
closeVideoModalBtn.onclick = () => {
    videoModal.style.display = 'none';
    videoPlayer.src = '';
};

// Controles do painel de cadastro
openModalBtn.onclick = () => modal.style.display = 'flex';
closeModalBtn.onclick = () => modal.style.display = 'none';

// Gravar nova série
saveSeriesBtn.onclick = () => {
    const name = document.getElementById('seriesName').value;
    const link = document.getElementById('seriesLink').value;
    const image = document.getElementById('seriesImage').value;

    if (name && link) {
        mySeries.push({ name, link, image });
        localStorage.setItem('miiSeriesData', JSON.stringify(mySeries));
        
        renderGrid();
        modal.style.display = 'none';

        document.getElementById('seriesName').value = '';
        document.getElementById('seriesLink').value = '';
        document.getElementById('seriesImage').value = '';
    } else {
        alert("Preencha o Nome e o Link!");
    }
};

renderGrid();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}