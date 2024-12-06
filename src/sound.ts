/**
 * Temporary sound player (to avoid adding sound libraries and files)
 */

let audioContext!: AudioContext;

export function playTickSound(volume: number = 0.5) {
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    if (audioContext.state !== 'running') {
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.02);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.03);

    oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
    };
}
