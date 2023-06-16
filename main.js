const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const cube_geo = new THREE.BoxGeometry();

const cubeCount = 10000;
const csMin = 1;
const csMax = 1.5;
const cubes = [];
const drange = 2500;

let fps = 0;

let sr = 500;
let pureColors = [];
let dr = 1.5;

for (let i = 0; i < cubeCount; i++) {
  const u = Math.random();
  const v = Math.random();

  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);

  const x = sr * Math.sin(phi) * Math.cos(theta) * Math.random();
  const y = sr * Math.sin(phi) * Math.sin(theta) * Math.random();
  const z = sr * Math.cos(phi) * Math.random(); 
  //広がり具合をランダムに

  const position = new THREE.Vector3(x, y, z).multiplyScalar(dr);

  const material = new THREE.MeshBasicMaterial();

  const cubeSize = Math.random() * (csMax - csMin) + csMin;

  const cube = new THREE.Mesh(cube_geo, material);
  cube.position.copy(position);
  cube.scale.set(cubeSize, cubeSize, cubeSize);
  scene.add(cube);

  cubes.push(cube);
  pureColors.push(genColor());
}

setInterval(() => {
  document.getElementById("fps").innerHTML = fps;
  fps = 0;
}, 1000);

function animate() {
  requestAnimationFrame(animate);

  fps++;

  cubes.forEach((cube, index) => {
    cube.rotation.x += 1;
    cube.rotation.y += 1;
    // 高速回転させることによりローポリゴンを実現

    const newColor = genColorNearpure(pureColors[index]);

    cube.material.color.copy(newColor);
    pureColors[index] = newColor;
  });

  const time = Date.now() * 0.0005;
  const radius = 18 * dr;

  const cameraX = Math.sin(time) * radius;
  const cameraZ = Math.cos(time) * radius;
  camera.position.set(cameraX, 0, cameraZ);
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();

function genColor() {
  const color = new THREE.Color();
  color.setRGB(Math.random(), Math.random(), Math.random());
  return color;
}

function genColorNearpure(pureColor) {
  const newColor = new THREE.Color();
  const dc = 0.1;

  const r = pureColor.r + (Math.random() - 0.5) * dc;
  const g = pureColor.g + (Math.random() - 0.5) * dc;
  const b = pureColor.b + (Math.random() - 0.5) * dc;

  newColor.setRGB(r, g, b);
  return newColor;
}

//マウスの動きに合わせる為のやーつ

let syoki = true;
let mouseDown = syoki;
let mouseX = 0;
let mouseY = 0;

document.body.addEventListener("mousedown", (event) => {
  mouseDown = true;
  mouseX = event.clientX;
  mouseY = event.clientY;
});

document.body.addEventListener("mouseup", () => {
  mouseDown = syoki;
});

document.body.addEventListener("mousemove", (event) => {
  if (mouseDown) {
    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;

    const moveScale = dr * 0.05; 

    cubes.forEach((cube) => {
      cube.position.x += deltaX * -moveScale;
      cube.position.y -= deltaY * -moveScale;
    });

    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  camera.lookAt(scene.position);
});

document.body.addEventListener("mousewheel", (event) => {
  cubes.forEach((cube) => {
    cube.scale.set(cube.scale.x + event.deltaY * 0.005, cube.scale.y + event.deltaY * 0.005, cube.scale.z + event.deltaY * 0.005);
  });
})

//window resize 
window.addEventListener("resize", (event) => {
  location.reload();
})

function NumberChange(n) {
  if (n > 10000 || n < 1) {
    n = 5000;
  }

  for (let i = 0; i < cubeCount; i++) {
    if (i < n) {

      cubes[i].visible = true;

      pureColors[i] = genColor();

      cubes[i].material.color.copy(pureColors[i]);
    } else {

      cubes[i].visible = false;

      cubes[i].material.color.setRGB(0, 0, 0);
    }
  }
}
