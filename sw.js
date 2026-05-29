const CACHE_NAME = 'miiseries-v3'; // Atualizado para v3 para forçar o celular a recarregar
const assets = [
    './', 
    './index.html', 
    './style.css', 
    './app.js', 
    './manifest.json',
    './Mii.png' // 🌟 Adicionado o ícone aqui para carregar no celular
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});