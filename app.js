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
