import * as THREE from 'three';

// --- 3Dスクリプト ---
const container = document.getElementById('artwork-container');

if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();

    const frontTexture = textureLoader.load(
      './assets/images/main/front.jpeg',
      () => {
        console.log('Front texture loaded successfully');
      },
      undefined,
      (error) => {
        console.error('Error loading front texture:', error);
      }
    );
    
    const rightTexture = textureLoader.load(
      './assets/images/main/right.jpg'
    );
    
    const leftTexture = textureLoader.load(
      './assets/images/main/left.jpg'
    );
    
    const topTexture = textureLoader.load(
      './assets/images/main/top.jpg'
    );
    
    const bottomTexture = textureLoader.load(
      './assets/images/main/bottom.jpg'
    );
    
    const backTexture = textureLoader.load(
      './assets/images/main/back.jpeg',
      () => {
        console.log('Back texture loaded successfully');
      },
      undefined,
      (error) => {
        console.error('Error loading back texture:', error);
    
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
    
        const context = canvas.getContext('2d');
    
        context.fillStyle = '#ccc';
        context.fillRect(0, 0, 512, 512);
    
        context.fillStyle = '#333';
        context.font = 'bold 48px Playfair Display';
        context.textAlign = 'center';
        context.fillText('BACK SIDE', 256, 256);
    
        backTexture.image = canvas;
        backTexture.needsUpdate = true;
      }
    );

    const geometry = new THREE.BoxGeometry(4, 5, 0.3);
    const materials = [
        new THREE.MeshStandardMaterial({ map: rightTexture, roughness: 0.4, metalness: 0.1 }),   // 右の面
        new THREE.MeshStandardMaterial({ map: leftTexture, roughness: 0.4, metalness: 0.1 }),    // 左の面
        new THREE.MeshStandardMaterial({ map: topTexture, roughness: 0.4, metalness: 0.1 }),     // 上の面
        new THREE.MeshStandardMaterial({ map: bottomTexture, roughness: 0.4, metalness: 0.1 }), // 下の面
        new THREE.MeshStandardMaterial({ map: frontTexture, roughness: 0.4, metalness: 0.1 }),    // 正面
        new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.4, metalness: 0.1 }),     // 裏
        new THREE.MeshStandardMaterial({ map: frontTexture, roughness: 0.4, metalness: 0.1 }),
        new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.4, metalness: 0.1 })
    ];
    const artwork = new THREE.Mesh(geometry, materials);
    scene.add(artwork);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    camera.position.z = 5;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let autoRotate = true;

    container.addEventListener('mousedown', e => {
        isDragging = true;
        autoRotate = false;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    container.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };
        artwork.rotation.y += deltaMove.x * 0.01;
        artwork.rotation.x += deltaMove.y * 0.01;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    container.addEventListener('mouseleave', () => { isDragging = false; });

    function animate() {
        requestAnimationFrame(animate);
        if (autoRotate && !isDragging) {
            artwork.rotation.y += 0.002;
        }
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (container) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

const navLinks = document.querySelectorAll('nav ul li a');
const navToggle = document.getElementById('nav-toggle');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navToggle.checked) {
            navToggle.checked = false;
        }
    });
});

const bgCanvas = document.getElementById('background-canvas');
if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let mouseX = 0, mouseY = 0;
    let particles = [];
    let animationId;

    function drawMonetBackground() {
        const width = bgCanvas.width;
        const height = bgCanvas.height;

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0d1a26');
        gradient.addColorStop(0.5, '#2a4f6d');
        gradient.addColorStop(1, '#000000');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        if (particles.length === 0) {
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 8 + 2,
                    opacity: Math.random() * 0.3 + 0.1,
                    color: Math.floor(Math.random() * 3)
                });
            }
        }

        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                const force = (200 - distance) / 200;
                particle.vx += dx * force * 0.0001;
                particle.vy += dy * force * 0.0001;
            }

            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > width) particle.vx *= -0.8;
            if (particle.y < 0 || particle.y > height) particle.vy *= -0.8;

            particle.vx *= 0.99;
            particle.vy *= 0.99;

            const colors = [
                { r: 116, g: 185, b: 255 },
                { r: 9, g: 132, b: 227 },
                { r: 108, g: 92, b: 231 }
            ];

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${colors[particle.color].r}, ${colors[particle.color].g}, ${colors[particle.color].b}, ${particle.opacity})`;
            ctx.fill();
        });

        if (mouseX > 0 && mouseY > 0) {
            const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        const strokes = 3000;

        for (let i = 0; i < strokes; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 15 + 3;

            const colors = [
                { r: 116, g: 185, b: 255, a: 0.1 },
                { r: 9, g: 132, b: 227, a: 0.15 },
                { r: 108, g: 92, b: 231, a: 0.1 },
                { r: 162, g: 155, b: 254, a: 0.08 },
                { r: 255, g: 255, b: 255, a: 0.03 },
                { r: 45, g: 52, b: 54, a: 0.1 }
            ];

            const color = colors[Math.floor(Math.random() * colors.length)];

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
            ctx.fill();
        }

        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 80 + 40;

            const lightGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
            lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = lightGradient;
            ctx.fill();
        }
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateBackground() {
        drawMonetBackground();
        animationId = requestAnimationFrame(animateBackground);
    }

    function resizeAndDraw() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        particles = [];
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        animateBackground();
    }

    resizeAndDraw();
    window.addEventListener('resize', resizeAndDraw);

    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}
