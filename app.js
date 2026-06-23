function vote(option) {
    const container = document.getElementById('voting-container');
    const overlay = document.getElementById('result-overlay');
    const votedText = document.getElementById('voted-option');
    const resultImage = document.getElementById('result-image');
    const audioVive = document.getElementById('audio-vive');
    const audioMuere = document.getElementById('audio-muere');

    // Reset audios
    audioVive.pause();
    audioVive.currentTime = 0;
    audioMuere.pause();
    audioMuere.currentTime = 0.5;

    // Add simple haptic feedback if available
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }

    // Set the text and dynamic class
    votedText.innerText = option;
    votedText.className = 'voted-text ' + option;

    // Reset confirm button states
    const btnReset = document.getElementById('btn-reset');
    const btnConfirm = document.getElementById('btn-confirm');
    const lockIcon = document.getElementById('lock-icon');
    const progressEl = document.getElementById('hold-progress');
    if (btnReset && btnConfirm && lockIcon) {
        lockIcon.innerText = '🔓';
        lockIcon.classList.remove('lock-anim');
        btnConfirm.classList.remove('locked');
        btnConfirm.disabled = false;
        btnReset.style.opacity = '1';
        btnReset.style.pointerEvents = 'all';
        if (progressEl) {
            progressEl.style.transition = 'none';
            progressEl.style.width = '0%';
            progressEl.style.background = 'rgba(16, 185, 129, 0.4)';
        }
    }

    overlay.classList.remove('bg-vive', 'bg-muere');

    if (option === 'Vive') {
        overlay.classList.add('bg-vive');
        resultImage.src = 'heroe.png';
        audioVive.play().catch(e => console.log('Audio play failed:', e));
    } else {
        overlay.classList.add('bg-muere');
        resultImage.src = 'villano.png';
        audioMuere.play().catch(e => console.log('Audio play failed:', e));
    }

    resultImage.classList.add('active');

    // Emitir el voto por WebSockets
    if (typeof emitirVoto === 'function') {
        emitirVoto(option);
    }

    // Show overlay
    container.classList.add('hidden');
    overlay.classList.add('active');
}

function resetVote() {
    if (typeof retirarVoto === 'function') {
        retirarVoto();
    }

    const container = document.getElementById('voting-container');
    const overlay = document.getElementById('result-overlay');
    const resultImage = document.getElementById('result-image');
    const audioVive = document.getElementById('audio-vive');
    const audioMuere = document.getElementById('audio-muere');

    audioVive.pause();
    audioMuere.pause();

    // Hide overlay
    overlay.classList.remove('active');

    // Wait for animation to finish before showing main container again
    setTimeout(() => {
        container.classList.remove('hidden');
        resultImage.classList.remove('active');
    }, 300);
}

let holdStartTime = 0;
let holdInterval = null;

function startHoldConfirm(e) {
    const btnConfirm = document.getElementById('btn-confirm');
    if (btnConfirm.classList.contains('locked')) return;

    holdStartTime = Date.now();
    const progressEl = document.getElementById('hold-progress');
    if (progressEl) progressEl.style.transition = 'none';

    if (holdInterval) clearInterval(holdInterval);

    holdInterval = setInterval(() => {
        const elapsed = Date.now() - holdStartTime;
        let percentage = (elapsed / 2000) * 100;
        if (percentage >= 100) percentage = 100;
        if (progressEl) progressEl.style.width = percentage + '%';

        if (elapsed >= 2000) {
            clearInterval(holdInterval);
            executeConfirm();
        }
    }, 20);
}

function stopHoldConfirm() {
    if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
    }

    const progressEl = document.getElementById('hold-progress');
    const btnConfirm = document.getElementById('btn-confirm');

    if (btnConfirm && !btnConfirm.classList.contains('locked')) {
        if (progressEl) {
            progressEl.style.transition = 'width 0.3s ease';
            progressEl.style.width = '0%';
        }
    }
}

function executeConfirm() {
    const btnReset = document.getElementById('btn-reset');
    const btnConfirm = document.getElementById('btn-confirm');
    const lockIcon = document.getElementById('lock-icon');
    const progressEl = document.getElementById('hold-progress');

    if (btnReset && btnConfirm && lockIcon) {
        lockIcon.innerText = '🔒';
        lockIcon.classList.add('lock-anim');
        btnConfirm.classList.add('locked');
        btnConfirm.disabled = true;

        if (progressEl) {
            progressEl.style.width = '100%';
            progressEl.style.background = 'rgba(255, 255, 255, 0.1)';
        }

        btnReset.style.opacity = '0';
        btnReset.style.pointerEvents = 'none';
    }
}
