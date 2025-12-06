// ===== DOM ELEMENTS =====
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
const toggleBtn = document.getElementById('btnToggleView');
const tableView = document.getElementById('tableView');
const cardsView = document.getElementById('cardsView');
const searchInput = document.getElementById('search');

// key in localStorage
const STORAGE_KEY = 'playlist';

// all songs
let songs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// state
let currentView = 'table';        // 'table' or 'cards'
let currentSort = 'title';        // 'title' | 'date' | 'rating'
let currentSearch = '';           // text filter

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // sort radios
    document.querySelectorAll('.sort-radio').forEach(r => {
        r.addEventListener('change', e => {
            currentSort = e.target.value;
            renderSongs();
        });
    });

    // toggle table/cards
    toggleBtn.addEventListener('click', toggleView);

    // search filter
    searchInput.addEventListener('input', () => {
        currentSearch = searchInput.value.toLowerCase();
        renderSongs();
    });

    renderSongs(); // initial load from localStorage
});

// ===== FORM SUBMIT (ADD / UPDATE) =====
form.addEventListener('submit', e => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const url = document.getElementById('url').value.trim();
    const rating = parseInt(document.getElementById('rating').value, 10);
    const songId = document.getElementById('songId').value; // hidden

    if (!title || !url || isNaN(rating) || rating < 1 || rating > 10) {
        alert('Please fill title, URL and rating (1–10)');
        return;
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
        alert('Could not extract YouTube ID from this URL');
        return;
    }

    if (songId) {
        // UPDATE
        const idx = songs.findIndex(s => s.id === Number(songId));
        if (idx !== -1) {
            songs[idx].title = title;
            songs[idx].url = url;
            songs[idx].rating = rating;
            songs[idx].videoId = videoId;
            // keep same dateAdded
        }
    } else {
        // ADD
        const song = {
            id: Date.now(),
            title,
            url,
            rating,
            videoId,
            dateAdded: Date.now()
        };
        songs.push(song);
    }

    saveAndRender();
    clearForm();
});

// ===== HELPERS =====
function saveAndRender() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    renderSongs();
}

function clearForm() {
    form.reset();
    document.getElementById('songId').value = '';
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
}

// main render (table + cards)
function renderSongs() {
    // filtering by search text
    let filtered = songs.filter(s =>
        s.title.toLowerCase().includes(currentSearch)
    );

    // sort
    filtered.sort((a, b) => {
        if (currentSort === 'title') {
            return a.title.localeCompare(b.title);
        }
        if (currentSort === 'rating') {
            return b.rating - a.rating; // high rating first
        }
        // date
        return a.dateAdded - b.dateAdded;
    });

    renderTable(filtered);
    renderCards(filtered);

    // show correct view
    tableView.classList.toggle('d-none', currentView !== 'table');
    cardsView.classList.toggle('d-none', currentView !== 'cards');
}

// ===== TABLE RENDER =====
function renderTable(songArray) {
    list.innerHTML = '';

    songArray.forEach(song => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>
                <img src="${thumbnailUrl(song.videoId)}"
                     alt="${song.title}"
                     style="width:90px; cursor:pointer;"
                     onclick="openPlayer(${song.id})">
            </td>
            <td>${song.title}</td>
            <td>${song.rating}</td>
            <td>${new Date(song.dateAdded).toLocaleString()}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        list.appendChild(tr);
    });
}

// ===== CARDS RENDER =====
function renderCards(songArray) {
    cardsView.innerHTML = '';

    songArray.forEach(song => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-4 col-lg-3';

        col.innerHTML = `
            <div class="card h-100">
                <img src="${thumbnailUrl(song.videoId)}"
                     class="card-img-top"
                     alt="${song.title}"
                     style="cursor:pointer"
                     onclick="openPlayer(${song.id})">
                <div class="card-body">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text mb-1">Rating: ${song.rating}</p>
                    <small class="text-muted">
                        ${new Date(song.dateAdded).toLocaleString()}
                    </small>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-warning" onclick="editSong(${song.id})">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                        Delete
                    </button>
                </div>
            </div>
        `;

        cardsView.appendChild(col);
    });
}

// ===== EDIT / DELETE / PLAYER =====
function editSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    document.getElementById('songId').value = song.id;
    document.getElementById('title').value = song.title;
    document.getElementById('url').value = song.url;
    document.getElementById('rating').value = song.rating;

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteSong(id) {
    if (!confirm('Delete this song?')) return;
    songs = songs.filter(s => s.id !== id);
    saveAndRender();
}

function openPlayer(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    const url = `https://www.youtube.com/watch?v=${song.videoId}`;
    window.open(url, '_blank', 'width=900,height=500');
}

// ===== YOUTUBE HELPERS =====
function extractYouTubeId(url) {
    // supports: https://www.youtube.com/watch?v=XXXX or https://youtu.be/XXXX
    const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

function thumbnailUrl(videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// ===== VIEW TOGGLE =====
function toggleView() {
    currentView = currentView === 'table' ? 'cards' : 'table';
    toggleBtn.textContent =
        currentView === 'table' ? 'View: Table' : 'View: Cards';
    renderSongs();
}
