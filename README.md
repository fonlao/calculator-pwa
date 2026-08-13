# calculator-pwa
calculator-pwa/
├── index.html
├── style.css
├── script.js
├── manifest.json        # Манифест PWA
├── service-worker.js    # Офлайн-работа
├── icons/               # Иконки приложения
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-192.png
│   └── icon-maskable-512.png
└── README.md
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    
    <!-- PWA мета-теги -->
    <meta name="theme-color" content="#ff9500">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Калькулятор">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="description" content="Удобный калькулятор с базовыми операциями">
    
    <!-- Иконки для iOS -->
    <link rel="apple-touch-icon" href="icons/icon-192.png">
    
    <!-- Манифест -->
    <link rel="manifest" href="manifest.json">
    
    <title>Калькулятор</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator">
        <!-- Индикатор офлайн-режима -->
        <div class="offline-indicator" id="offlineIndicator">
            📡 Нет подключения к интернету
        </div>
        
        <!-- Экран -->
        <div class="display">
            <div class="formula" id="formula"></div>
            <div class="result" id="result">0</div>
        </div>
        
        <!-- Кнопка установки PWA -->
        <button class="install-btn" id="installBtn" style="display:none;">
            📲 Установить приложение
        </button>
        
        <!-- Кнопки калькулятора -->
        <div class="buttons">
            <button class="btn reset" id="resetBtn">C</button>
            <button class="btn backspace" id="backspaceBtn">⌫</button>
            <button class="btn operator" data-operator="/">÷</button>
            
            <button class="btn number" data-value="7">7</button>
            <button class="btn number" data-value="8">8</button>
            <button class="btn number" data-value="9">9</button>
            <button class="btn operator" data-operator="*">×</button>
            
            <button class="btn number" data-value="4">4</button>
            <button class="btn number" data-value="5">5</button>
            <button class="btn number" data-value="6">6</button>
            <button class="btn operator" data-operator="-">−</button>
            
            <button class="btn number" data-value="1">1</button>
            <button class="btn number" data-value="2">2</button>
            <button class="btn number" data-value="3">3</button>
            <button class="btn operator" data-operator="+">+</button>
            
            <button class="btn number" data-value="0">0</button>
            <button class="btn number" data-value=".">.</button>
            <button class="btn equals" id="equalsBtn">=</button>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>

{
  "name": "Калькулятор Pro",
  "short_name": "Калькулятор",
  "description": "Удобный калькулятор с базовыми операциями",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#1e1e2e",
  "theme_color": "#ff9500",
  "lang": "ru",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "categories": ["utilities", "productivity"],
  "shortcuts": [
    {
      "name": "Быстро открыть",
      "short_name": "Калькулятор",
      "description": "Открыть калькулятор",
      "url": "./index.html",
      "icons": [{ "src": "icons/icon-192.png", "sizes": "192x192" }]
    }
  ]
}
