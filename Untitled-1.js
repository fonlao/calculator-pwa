// === Регистрация Service Worker ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('✅ SW зарегистрирован:', reg.scope))
            .catch(err => console.log('❌ Ошибка SW:', err));
    });
}

// === Онлайн/офлайн индикатор ===
const offlineIndicator = document.getElementById('offlineIndicator');

function updateOnlineStatus() {
    if (navigator.onLine) {
        offlineIndicator.classList.remove('show');
    } else {
        offlineIndicator.classList.add('show');
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// === Установка PWA ===
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
    
    // Автоматически скрываем через 10 секунд
    setTimeout(() => {
        installBtn.style.display = 'none';
    }, 10000);
});

installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Пользователь ${outcome === 'accepted' ? 'установил' : 'отклонил'} PWA`);
    deferredPrompt = null;
    installBtn.style.display = 'none';
});

window.addEventListener('appinstalled', () => {
    console.log('✅ PWA установлено');
    installBtn.style.display = 'none';
});

// === Логика калькулятора (из предыдущего шага) ===
const formulaEl = document.getElementById('formula');
const resultEl = document.getElementById('result');
const resetBtn = document.getElementById('resetBtn');
const backspaceBtn = document.getElementById('backspaceBtn');
const equalsBtn = document.getElementById('equalsBtn');
const numberButtons = document.querySelectorAll('.btn.number');
const operatorButtons = document.querySelectorAll('.btn.operator');

let currentValue = '0';
let previousValue = null;
let operator = null;
let shouldResetScreen = false;
let lastWasEquals = false;
let history = JSON.parse(localStorage.getItem('calc_history') || '[]');

function updateDisplay() {
    resultEl.textContent = formatNumber(currentValue);
    if (previousValue !== null && operator) {
        const opSymbol = getOperatorSymbol(operator);
        formulaEl.textContent = `${formatNumber(previousValue)} ${opSymbol}`;
    } else {
        formulaEl.textContent = '';
    }
}

function getOperatorSymbol(op) {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return symbols[op] || op;
}

function formatNumber(value) {
    if (value === 'Error') return 'Error';
    if (value === null || value === undefined) return '0';
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    if (value.length > 12) {
        if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(6);
        }
        return parseFloat(num.toPrecision(12)).toString();
    }
    return value;
}

function inputNumber(value) {
    if (lastWasEquals) {
        clearAll();
        lastWasEquals = false;
    }
    if (shouldResetScreen) {
        currentValue = '0';
        shouldResetScreen = false;
    }
    if (currentValue.length >= 15) return;
    if (value === '.') {
        if (!currentValue.includes('.')) {
            currentValue = currentValue === '' ? '0.' : currentValue + '.';
        }
        return;
    }
    if (currentValue === '0' && value !== '.') {
        currentValue = value;
    } else {
        currentValue += value;
    }
    updateDisplay();
}

function inputOperator(op) {
    if (lastWasEquals) {
        previousValue = currentValue;
        lastWasEquals = false;
    } else if (previousValue === null) {
        previousValue = currentValue;
    } else if (operator && !shouldResetScreen) {
        const result = calculate(parseFloat(previousValue), parseFloat(currentValue), operator);
        currentValue = result.toString();
        previousValue = result.toString();
    }
    operator = op;
    shouldResetScreen = true;
    updateDisplay();
    highlightOperator(op);
}

function calculate(a, b, op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? 'Error' : a / b;
        default: return b;
    }
}

function equals() {
    if (operator === null || previousValue === null) return;
    const result = calculate(parseFloat(previousValue), parseFloat(currentValue), operator);
    const formula = `${formatNumber(previousValue)} ${getOperatorSymbol(operator)} ${formatNumber(currentValue)} =`;
    
    // Сохраняем в историю
    if (result !== 'Error') {
        history.unshift({
            formula: formula,
            result: formatNumber(result),
            timestamp: new Date().toISOString()
        });
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem('calc_history', JSON.stringify(history));
    }
    
    currentValue = result.toString();
    previousValue = null;
    operator = null;
    shouldResetScreen = true;
    lastWasEquals = true;
    formulaEl.textContent = formula;
    resultEl.textContent = formatNumber(currentValue);
    clearOperatorHighlight();
}

function clearAll() {
    currentValue = '0';
    previousValue = null;
    operator = null;
    shouldResetScreen = false;
    lastWasEquals = false;
    formulaEl.textContent = '';
    clearOperatorHighlight();
    updateDisplay();
}

function backspace() {
    if (lastWasEquals) {
        clearAll();
        return;
    }
    if (shouldResetScreen) return;
    if (currentValue.length === 1) {
        currentValue = '0';
    } else {
        currentValue = currentValue.slice(0, -1);
    }
    updateDisplay();
}

function highlightOperator(op) {
    clearOperatorHighlight();
    operatorButtons.forEach(btn => {
        if (btn.dataset.operator === op) btn.classList.add('active');
    });
}

function clearOperatorHighlight() {
    operatorButtons.forEach(btn => btn.classList.remove('active'));
}

// Обработчики кнопок
numberButtons.forEach(btn => btn.addEventListener('click', () => inputNumber(btn.dataset.value)));
operatorButtons.forEach(btn => btn.addEventListener('click', () => inputOperator(btn.dataset.operator)));
resetBtn.addEventListener('click', clearAll);
backspaceBtn.addEventListener('click', backspace);
equalsBtn.addEventListener('click', equals);

// Клавиатура
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '0' && key <= '9') inputNumber(key);
    else if (key === '+') inputOperator('+');
    else if (key === '-') inputOperator('-');
    else if (key === '*') inputOperator('*');
    else if (key === '/') { event.preventDefault(); inputOperator('/'); }
    else if (key === 'Enter' || key === '=') { event.preventDefault(); equals(); }
    else if (key === 'Escape' || key.toLowerCase() === 'c') clearAll();
    else if (key === 'Backspace') backspace();
    else if (key === '.' || key === ',') inputNumber('.');
});

updateDisplay();

const CACHE_NAME = 'calculator-pwa-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Установка: кешируем все файлы
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker: установка');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📂 Кешируем файлы');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Активация: чистим старые кеши
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker: активация');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('🗑 Удаляем старый кеш:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Перехват запросов: отдаём из кеша, если офлайн
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Возвращаем кешированную версию или идём в сеть
                return response || fetch(event.request)
                    .then(fetchResponse => {
                        // Кешируем новые ресурсы
                        return caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    });
            })
            .catch(() => {
                // Если офлайн и нет в кеше — показываем заглушку
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            })
    );
});

