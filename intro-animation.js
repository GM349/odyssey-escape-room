// Intro Animation Script
class IntroAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.frame = 0;
        this.animationDuration = 180; // frames (6 seconds at 30fps)
        this.isRunning = true;
        this.animate();
    }

    animate = () => {
        if (!this.isRunning) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw based on frame
        if (this.frame < 60) {
            this.drawIntroScene();
        } else if (this.frame < 90) {
            this.drawSailingScene();
        } else if (this.frame < 120) {
            this.drawPoseidonScene();
        } else if (this.frame < 150) {
            this.drawStormScene();
        } else {
            this.drawAdventureScene();
        }

        this.frame++;
        if (this.frame >= this.animationDuration) {
            this.frame = 0;
        }

        requestAnimationFrame(this.animate);
    }

    drawIntroScene() {
        // Background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Animated stars
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 16) % this.canvas.width;
            const y = (i * 9) % this.canvas.height;
            const size = Math.sin(this.frame / 10 + i) * 2 + 2;
            this.ctx.fillRect(x, y, size, size);
        }

        // Title with fade-in
        const titleOpacity = Math.min(this.frame / 20, 1);
        this.ctx.fillStyle = `rgba(255, 215, 0, ${titleOpacity})`;
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Η Οδύσσεια του Ομήρου', this.canvas.width / 2, 120);

        // Animated wave
        this.ctx.strokeStyle = `rgba(0, 150, 255, ${titleOpacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let x = 0; x < this.canvas.width; x += 20) {
            const y = 200 + Math.sin((x + this.frame * 5) / 100) * 20;
            if (x === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();

        // Main text
        this.ctx.fillStyle = `rgba(255, 255, 255, ${titleOpacity * 0.8})`;
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Βοήθησε τον Οδυσσέα να επιστρέψει στην Ιθάκη', this.canvas.width / 2, 250);
        this.ctx.fillText('10 χρόνια περιπέτειας, δοκιμασίες και μαγεία', this.canvas.width / 2, 280);
    }

    drawSailingScene() {
        // Sea background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4a90e2');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Sun
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(100, 80, 35, 0, Math.PI * 2);
        this.ctx.fill();

        // Waves
        this.ctx.strokeStyle = '#00a8e8';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            for (let x = 0; x < this.canvas.width; x += 40) {
                const y = 250 + i * 50 + Math.sin((x + this.frame * 10) / 200) * 15;
                if (x === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
        }

        // Ship
        const shipX = 100 + (this.frame - 60) * 3;
        this.drawShip(shipX, 180);

        // Text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Η Αναχώρηση από την Τροία', this.canvas.width / 2, 80);
    }

    drawPoseidonScene() {
        // Dark sea
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f3460');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Lightning effect
        if (this.frame % 10 < 3) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Angry waves
        this.ctx.strokeStyle = '#0099cc';
        this.ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
            this.ctx.beginPath();
            for (let x = 0; x < this.canvas.width; x += 30) {
                const y = 180 + i * 50 + Math.sin((x + this.frame * 15) / 150) * 30;
                if (x === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
        }

        // Poseidon's trident
        const tridentX = 200 + Math.sin((this.frame - 90) / 5) * 80;
        this.drawTrident(tridentX, 100);

        // Text
        this.ctx.fillStyle = '#ff4444';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Ο Ποσειδώνας Θυμώνει!', this.canvas.width / 2, 60);
    }

    drawStormScene() {
        // Storm sky
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(1, '#34495e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Rain
        this.ctx.strokeStyle = 'rgba(200, 200, 255, 0.6)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 100; i++) {
            const x = Math.sin((this.frame - 120) / 5 + i) * 150 + this.canvas.width / 2;
            const y = ((this.frame - 120) * 15 + i * 30) % this.canvas.height;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - 15, y + 20);
            this.ctx.stroke();
        }

        // Storm clouds
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            this.ctx.arc(120 + i * 180, 80 + Math.sin((this.frame - 120) / 10 + i) * 40, 70, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Ship being tossed
        const shipX = this.canvas.width / 2 + Math.sin((this.frame - 120) / 3) * 100;
        const shipY = 220 + Math.cos((this.frame - 120) / 2) * 50;
        this.ctx.save();
        this.ctx.translate(shipX, shipY);
        this.ctx.rotate(Math.sin((this.frame - 120) / 3) * 0.25);
        this.drawShip(0, 0);
        this.ctx.restore();

        // Text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#ff0000';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText('Δοκιμασίες Περιμένουν...', this.canvas.width / 2, 80);
        this.ctx.shadowColor = 'transparent';
    }

    drawAdventureScene() {
        // Adventure background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Animated stars
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
        for (let i = 0; i < 100; i++) {
            const x = (i * 8) % this.canvas.width;
            const y = (i * 4.5) % this.canvas.height;
            const size = Math.sin((this.frame - 150) / 8 + i) * 2 + 2;
            this.ctx.fillRect(x, y, size, size);
        }

        // Adventure icons
        const icons = ['🏛️', '⚡', '🌊', '🪦', '🏠'];
        for (let i = 0; i < 5; i++) {
            const x = 80 + i * 160;
            const y = 180 + Math.sin((this.frame - 150) / 5 + i) * 30;
            this.ctx.font = `${40 + Math.sin((this.frame - 150) / 10 + i) * 15}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(icons[i], x, y);
        }

        // Main text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('5 Δωμάτια Γεμάτα Μυστήρια!', this.canvas.width / 2, 80);

        // Subtitle
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#fff9e6';
        this.ctx.fillText('Ερωτήσεις • Λεξιλόγιο • Γραμματική', this.canvas.width / 2, 390);
    }

    drawShip(x, y) {
        this.ctx.save();
        this.ctx.translate(x, y);

        // Hull
        this.ctx.fillStyle = '#8B4513';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 50, 25, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Mast
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -25);
        this.ctx.lineTo(0, -75);
        this.ctx.stroke();

        // Sail
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, -25);
        this.ctx.lineTo(50, -10);
        this.ctx.lineTo(0, 25);
        this.ctx.fill();

        this.ctx.restore();
    }

    drawTrident(x, y) {
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 5;

        // Main shaft
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y + 100);
        this.ctx.stroke();

        // Left prong
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + 70);
        this.ctx.lineTo(x - 40, y + 100);
        this.ctx.stroke();

        // Right prong
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + 70);
        this.ctx.lineTo(x + 40, y + 100);
        this.ctx.stroke();

        // Center prong
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + 70);
        this.ctx.lineTo(x, y + 105);
        this.ctx.stroke();
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('introCanvas');
    if (canvas) {
        new IntroAnimation('introCanvas');
    }
});
