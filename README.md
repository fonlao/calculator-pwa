# calculator-pwa
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Калькулятор</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
body {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.calculator {
    background: #1e1e2e;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    width: 320px;
}
.display {
    background: #2a2a3e;
    color: #fff;
    font-size: 36px;
    text-align: right;
    padding: 25px 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    min-height: 80px;
    overflow: hidden;
    word-break: break-all;
    font-weight: 300;
}
.buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}
.btn {
    border: none;
    border-radius: 12px;
    font-size: 24px;
    font-weight: 600;
    height: 70px;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
    color: #fff;
}
.btn:active { transform: scale(0.95); }
.btn.number { background: #3a3a52; box-shadow: 0 4px 0 #2a2a3e; }
.btn.number:hover { background: #45456a; }
.btn.reset { background: #ff5e62; box-shadow: 0 4px 0 #c93d40; grid-column: 1 / -1; }
.btn.reset:hover { background: #ff6e72; }
</style>
</head>
<body>
<div class="calculator">
    <div class="display" id="display">0</div>
    <div class="buttons">
        <button class="btn number">1</button>
        <button class="btn number">2</button>
        <button class="btn number">3</button>
        <button class="btn number">4</button>
        <button class="btn number">5</button>
        <button class="btn number">6</button>
        <button class="btn number">7</button>
        <button class="btn number">8</button>
        <button class="btn number">9</button>
        <button class="btn reset" id="resetBtn">C</button>
    </div>
</div>
<script>
const display = document.getElementById('display');
const resetBtn = document.getElementById('resetBtn');
const numberButtons = document.querySelectorAll('.btn.number');
let currentInput = '';

function updateDisplay(v) { display.textContent = v || '0'; }

numberButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.textContent;
        if (currentInput.length >= 12) return;
        currentInput = currentInput === '0' ? value : currentInput + value;
        updateDisplay(currentInput);
    });
});

resetBtn.addEventListener('click', () => {
    currentInput = '';
    updateDisplay('0');
});

document.addEventListener('keydown', e => {
    if (e.key >= '1' && e.key <= '9') {
        if (currentInput.length >= 12) return;
        currentInput = currentInput === '0' ? e.key : currentInput + e.key;
        updateDisplay(currentInput);
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        currentInput = '';
        updateDisplay('0');
    } else if (e.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
    }
});
</script>
</body>
</html>
