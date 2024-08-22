document.addEventListener('DOMContentLoaded', () => {
    const outerDisk = document.querySelector('.outer-disk');
    const innerDisk = document.querySelector('.inner-disk');
    const shiftValueDisplay = document.getElementById('shift-value');
    const rotateLeftBtn = document.getElementById('rotate-left');
    const rotateRightBtn = document.getElementById('rotate-right');
    const encodeBtn = document.getElementById('encode');
    const decodeBtn = document.getElementById('decode');
    const moveBtn = document.getElementById('swap'); // We'll keep the id as 'swap' to avoid HTML changes
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const stepsDiv = document.getElementById('steps');

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let currentShift = 0;
    let currentMode = 'encode';

    function setupDisk(disk, isOuter) {
        const angleStep = 360 / 26;
        const radius = isOuter ? 140 : 100;
        alphabet.split('').forEach((letter, index) => {
            const letterElement = document.createElement('div');
            letterElement.className = 'letter';
            letterElement.textContent = letter;
            letterElement.dataset.letter = letter;
            const angle = index * angleStep;
            letterElement.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`;
            disk.appendChild(letterElement);
        });
    }

    setupDisk(outerDisk, true);
    setupDisk(innerDisk, false);

    function rotateDisk(direction) {
        currentShift = (currentShift + (direction === 'left' ? 1 : -1) + 26) % 26;
        innerDisk.style.transform = `rotate(${currentShift * -(360 / 26)}deg)`;
        shiftValueDisplay.textContent = `Shift: ${currentShift}`;
        processText(currentMode);
    }

    rotateLeftBtn.addEventListener('click', () => rotateDisk('left'));
    rotateRightBtn.addEventListener('click', () => rotateDisk('right'));

    function caesarCipher(text, shift, mode) {
        const steps = [];
        const result = text.split('').map(char => {
            if (alphabet.includes(char.toUpperCase())) {
                const isUpperCase = char === char.toUpperCase();
                const index = alphabet.indexOf(char.toUpperCase());
                const shiftedIndex = mode === 'encode' 
                    ? (index + shift) % 26 
                    : (index - shift + 26) % 26;
                const shiftedChar = alphabet[shiftedIndex];
                steps.push(`${char} → ${isUpperCase ? shiftedChar : shiftedChar.toLowerCase()}`);
                return isUpperCase ? shiftedChar : shiftedChar.toLowerCase();
            } else {
                steps.push(`${char} (unchanged)`);
                return char;
            }
        }).join('');
        return { result, steps };
    }

    function processText(mode) {
        currentMode = mode;
        const text = input.value;
        const shift = currentShift;

        const { result, steps } = caesarCipher(text, shift, mode);
        output.value = result;
        displaySteps(steps, mode);
    }

    encodeBtn.addEventListener('click', () => processText('encode'));
    decodeBtn.addEventListener('click', () => processText('decode'));

    moveBtn.addEventListener('click', () => {
        input.value = output.value;
        output.value = '';
        stepsDiv.innerHTML = '';
    });

    function displaySteps(steps, mode) {
        stepsDiv.innerHTML = `<h3>${mode.charAt(0).toUpperCase() + mode.slice(1)}d step by step:</h3>`;
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.textContent = `Step ${index + 1}: ${step}`;
            stepElement.className = 'step';
            stepsDiv.appendChild(stepElement);
        });
    }

    // Update output in real-time as input changes
    input.addEventListener('input', () => {
        processText(currentMode);
    });

    // Initialize the disk position
    rotateDisk('right'); // This sets the initial shift to 0
});
