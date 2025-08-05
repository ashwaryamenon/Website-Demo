// Typewriter effect
const text = "Discover Neptune";
const typewriter = document.getElementById("typewriter");
let index = 0;
let isDeleting = false;
function type() {
  const currentText = text.substring(0, index);
  typewriter.textContent = currentText;
  if (!isDeleting && index < text.length) {
    index++;
    setTimeout(type, 100);
  } else if (isDeleting && index > 0) {
    index--;
    setTimeout(type, 50);
  } else if (index === text.length) {
    isDeleting = true;
    setTimeout(type, 1000);
  } else if (index === 0) {
    isDeleting = false;
    setTimeout(type, 200);
  }
}
type();

// Three.js Neptune
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('neptune-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high-DPI screens
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
const geometry = new THREE.SphereGeometry(1, 32, 32);
const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/neptune.jpg');
const material = new THREE.MeshBasicMaterial({ map: texture });
const neptune = new THREE.Mesh(geometry, material);
scene.add(neptune);
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02 });
const starVertices = [];
for (let i = 0; i < 500; i++) { // Reduced stars for mobile performance
  const x = (Math.random() - 0.5) * 100;
  const y = (Math.random() - 0.5) * 100;
  const z = (Math.random() - 0.5) * 100;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);
camera.position.z = 3;
function animate() {
  requestAnimationFrame(animate);
  neptune.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

// GSAP animations
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray(".parallax-bg").forEach((bg) => {
  gsap.to(bg, {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
      trigger: bg.parentElement,
      scrub: 0.5
    }
  });
});
gsap.utils.toArray(".section").forEach((section) => {
  gsap.fromTo(section.children, 
    { opacity: 0, y: 30, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        end: "top 20%",
        scrub: 0.5
      }
    }
  );
});
gsap.utils.toArray(".section").forEach((section) => {
  if (section.querySelector(".parallax-bg")) {
    gsap.fromTo(section.querySelector(".parallax-bg"),
      { opacity: 0 },
      {
        opacity: 0.7,
        duration: 0.8,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top 50%",
          scrub: 0.5
        }
      }
    );
  }
});
const projectContainer = document.querySelector(".project-container");
gsap.to(projectContainer, {
  x: () => -(projectContainer.scrollWidth - window.innerWidth + 50),
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#projects",
    start: "top top",
    end: () => `+=${projectContainer.scrollWidth - window.innerWidth}`,
    scrub: 0.5,
    pin: true,
    snap: 1 / (projectContainer.children.length - 1)
  }
});