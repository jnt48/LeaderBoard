import React, { useEffect } from "react";

const SparkleBackground = () => {
    useEffect(() => {
        const canvas = document.getElementById("sparkle-canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = "rgba(0, 255, 0, 0.8)"; // Green particles
        }

        Particle.prototype.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            this.draw();
        };

        Particle.prototype.draw = function () {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        };

        function createParticles() {
            for (let i = 0; i < 500; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            requestAnimationFrame(animate);
        }

        createParticles();
        animate();

        return () => {
            cancelAnimationFrame(animate);
        };
    }, []);

    return <canvas id="sparkle-canvas" className="fixed inset-0 z-0"></canvas>;
};

export default SparkleBackground;
