import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

const canvasEl = document.querySelector('#canvas');
const scoreResult = document.querySelector('#score-result');
let renderer, scene, camera, diceMesh, physicsWorld;
let wallsCreated = false;
let floorCreated = false;
const params = {
    segments: 40,
    edgeRadius: .1,
    notchRadius: .15,
    notchDepth: .09,
};
let diceArray = [];
export let diceResult = [];
window.addEventListener('resize', updateSceneSize); 

export function initScene(numberOfDice) {
    if(!renderer) {
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: canvasEl
    });
    renderer.shadowMap.enabled = true
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));//모바일에서도 잘 보이게
    }
    if(!scene) {
        scene = new THREE.Scene();
    }
    if(!camera) {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 100)
    camera.position.set(0, 3, 0).multiplyScalar(6);//위에서 아래보기
    camera.lookAt(camera.position.x, 0, camera.position.z);

    updateSceneSize();

    const ambientLight = new THREE.AmbientLight(0xffffff, .5);
    scene.add(ambientLight);
    const topLight = new THREE.PointLight(0xffffff, .5);
    topLight.position.set(10, 15, 3);
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.camera.near = 5;
    topLight.shadow.camera.far = 400;
    scene.add(topLight);
	
	createWalls();
    createFloor();
    diceMesh = createDiceMesh();
    }
    
    diceResult = [];
    for (let i = 0; i < numberOfDice; i++) {
        diceArray[i]=(createDice());
        addDiceEvents(diceArray[i]);
    }
    render();
}
export function updateDiceCount(newNumberOfDice) {
    // 기존 주사위 삭제
    diceArray.forEach((dice) => {
        scene.remove(dice.mesh);
        physicsWorld.removeBody(dice.body);
    });
    diceArray = [];

    // 새 주사위 개수로 초기화
    initScene(newNumberOfDice);
}

export function initPhysics() {
    physicsWorld = new CANNON.World({
        allowSleep: true,
        gravity: new CANNON.Vec3(0, -60, 0),
    })
    
    physicsWorld.defaultContactMaterial.restitution = .3;
}

function createWalls() {
    if (wallsCreated) return;
    wallsCreated = true;
    const wallThickness = .5; // 벽 두께
    const wallHeight = 5;   // 벽 높이
    const wallSize = 10;     // 벽 길이 (바닥 크기와 동일)
    const floorY = -3;       // 바닥의 Y 위치

    const wallPositions = [
        { x: 0, y: floorY + wallHeight / 2, z: -wallSize / 2 + wallThickness/2 }, // 앞벽
        { x: 0, y: floorY + wallHeight / 2, z: wallSize / 2 - wallThickness/2},  // 뒷벽
        { x: -wallSize / 2+wallThickness/2, y: floorY + wallHeight / 2, z: 0 }, // 왼쪽 벽
        { x: wallSize / 2-wallThickness/2, y: floorY + wallHeight / 2, z: 0 }   // 오른쪽 벽
    ];

    const wallRotations = [
        { axis: new THREE.Vector3(1, 0, 0), angle: 0 },        // 앞벽
        { axis: new THREE.Vector3(1, 0, 0), angle: 0 },        // 뒷벽
        { axis: new THREE.Vector3(0, 1, 0), angle: Math.PI / 2 }, // 왼쪽 벽
        { axis: new THREE.Vector3(0, 1, 0), angle: Math.PI / 2 }  // 오른쪽 벽
    ];

    wallPositions.forEach((pos, index) => {
        // Three.js 벽 생성
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(wallSize, wallHeight, wallThickness),
            new THREE.MeshStandardMaterial({ color: 0x888888 })
        );
        wall.position.set(pos.x, pos.y, pos.z);
        wall.quaternion.setFromAxisAngle(
            wallRotations[index].axis,
            wallRotations[index].angle
        );
        wall.receiveShadow = true;
        scene.add(wall);

        // Cannon.js 물리 벽 생성
        const wallBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(
                wallSize / 2,       // 벽의 길이 절반
                wallHeight / 2,     // 벽의 높이 절반
                wallThickness / 2   // 벽의 두께 절반
            )),
        });
        wallBody.position.copy(wall.position);
        wallBody.quaternion.copy(wall.quaternion);
        physicsWorld.addBody(wallBody);
    });
}

function createFloor() {
    if (floorCreated) return;
    floorCreated = true;
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.ShadowMaterial({//바닥에 그림자만 보이게 특수한 재질
            opacity: .15
        })
    )
    floor.receiveShadow = true;//바닥이 그림자를 받을 수 있음
    floor.position.y = -3;//바닥이 y축 어디에 있는지
    floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);
    scene.add(floor);

    const floorBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
    });
    floorBody.position.copy(floor.position);
    floorBody.quaternion.copy(floor.quaternion);
    physicsWorld.addBody(floorBody);
}

function createDiceMesh() {
    const boxMaterialOuter = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
    })
    const boxMaterialInner = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0,
        metalness: 1,
        side: THREE.DoubleSide
    })

    const diceMesh = new THREE.Group();
    const innerMesh = new THREE.Mesh(createInnerGeometry(), boxMaterialInner);
    const outerMesh = new THREE.Mesh(createBoxGeometry(), boxMaterialOuter);
    outerMesh.castShadow = true;
    diceMesh.add(innerMesh, outerMesh);

    return diceMesh;
}

function createDice() {
    const mesh = diceMesh.clone();
    scene.add(mesh);

    const body = new CANNON.Body({
        mass: .3,
        shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5)),
        sleepTimeLimit: .1
    });
    physicsWorld.addBody(body);
    return {mesh, body};
}

function createBoxGeometry() {

    let boxGeometry = new THREE.BoxGeometry(1, 1, 1, params.segments, params.segments, params.segments);

    const positionAttr = boxGeometry.attributes.position;
    const subCubeHalfSize = .5 - params.edgeRadius;

    for (let i = 0; i < positionAttr.count; i++) {

        let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);

        const subCube = new THREE.Vector3(Math.sign(position.x), Math.sign(position.y), Math.sign(position.z)).multiplyScalar(subCubeHalfSize);
        const addition = new THREE.Vector3().subVectors(position, subCube);

        if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            addition.normalize().multiplyScalar(params.edgeRadius);
            position = subCube.add(addition);
        } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize) {
            addition.z = 0;
            addition.normalize().multiplyScalar(params.edgeRadius);
            position.x = subCube.x + addition.x;
            position.y = subCube.y + addition.y;
        } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            addition.y = 0;
            addition.normalize().multiplyScalar(params.edgeRadius);
            position.x = subCube.x + addition.x;
            position.z = subCube.z + addition.z;
        } else if (Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            addition.x = 0;
            addition.normalize().multiplyScalar(params.edgeRadius);
            position.y = subCube.y + addition.y;
            position.z = subCube.z + addition.z;
        }

        const notchWave = (v) => {
            v = (1 / params.notchRadius) * v;
            v = Math.PI * Math.max(-1, Math.min(1, v));
            return params.notchDepth * (Math.cos(v) + 1.);
        }
        const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]);

        const offset = .23;

        if (position.y === .5) {
            position.y -= notch([position.x, position.z]);
        } else if (position.x === .5) {
            position.x -= notch([position.y + offset, position.z + offset]);
            position.x -= notch([position.y - offset, position.z - offset]);
        } else if (position.z === .5) {
            position.z -= notch([position.x - offset, position.y + offset]);
            position.z -= notch([position.x, position.y]);
            position.z -= notch([position.x + offset, position.y - offset]);
        } else if (position.z === -.5) {
            position.z += notch([position.x + offset, position.y + offset]);
            position.z += notch([position.x + offset, position.y - offset]);
            position.z += notch([position.x - offset, position.y + offset]);
            position.z += notch([position.x - offset, position.y - offset]);
        } else if (position.x === -.5) {
            position.x += notch([position.y + offset, position.z + offset]);
            position.x += notch([position.y + offset, position.z - offset]);
            position.x += notch([position.y, position.z]);
            position.x += notch([position.y - offset, position.z + offset]);
            position.x += notch([position.y - offset, position.z - offset]);
        } else if (position.y === -.5) {
            position.y += notch([position.x + offset, position.z + offset]);
            position.y += notch([position.x + offset, position.z]);
            position.y += notch([position.x + offset, position.z - offset]);
            position.y += notch([position.x - offset, position.z + offset]);
            position.y += notch([position.x - offset, position.z]);
            position.y += notch([position.x - offset, position.z - offset]);
        }

        positionAttr.setXYZ(i, position.x, position.y, position.z);
    }


    boxGeometry.deleteAttribute('normal');
    boxGeometry.deleteAttribute('uv');
    boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);

    boxGeometry.computeVertexNormals();

    return boxGeometry;
}

function createInnerGeometry() {
    const baseGeometry = new THREE.PlaneGeometry(1 - 2 * params.edgeRadius, 1 - 2 * params.edgeRadius);
    const offset = .48;
    return BufferGeometryUtils.mergeGeometries([
        baseGeometry.clone().translate(0, 0, offset),
        baseGeometry.clone().translate(0, 0, -offset),
        baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, -offset, 0),
        baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, offset, 0),
        baseGeometry.clone().rotateY(.5 * Math.PI).translate(-offset, 0, 0),
        baseGeometry.clone().rotateY(.5 * Math.PI).translate(offset, 0, 0),
    ], false);
}

function addDiceEvents(dice) {
    if (!dice.body.hasEventListener('sleep')) {
        dice.body.addEventListener('sleep', (e) => {
            dice.body.allowSleep = false;

            const euler = new CANNON.Vec3();
            e.target.quaternion.toEuler(euler);

            const eps = 0.1;
            let isZero = (angle) => Math.abs(angle) < eps;
            let isHalfPi = (angle) => Math.abs(angle - 0.5 * Math.PI) < eps;
            let isMinusHalfPi = (angle) => Math.abs(0.5 * Math.PI + angle) < eps;
            let isPiOrMinusPi = (angle) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);

            if (isZero(euler.z)) {
                if (isZero(euler.x)) {
                    showRollResults(1);
                } else if (isHalfPi(euler.x)) {
                    showRollResults(4);
                } else if (isMinusHalfPi(euler.x)) {
                    showRollResults(3);
                } else if (isPiOrMinusPi(euler.x)) {
                    showRollResults(6);
                } else {
                    dice.body.allowSleep = true;
                }
            } else if (isHalfPi(euler.z)) {
                showRollResults(2);
            } else if (isMinusHalfPi(euler.z)) {
                showRollResults(5);
            } else {
                dice.body.allowSleep = true;
            }
        });
    }
}


function showRollResults(score) {
    diceResult.push(score);
}
function render() {
    physicsWorld.fixedStep();
    
    for (let dice of diceArray) {
        dice.mesh.position.copy(dice.body.position)
        dice.mesh.quaternion.copy(dice.body.quaternion)
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function updateSceneSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export function throwDice() {
    diceResult = [];

    diceArray.forEach((d, dIdx) => {
        d.body.velocity.setZero();
        d.body.angularVelocity.setZero();

        d.body.position.set(4, dIdx * 1.5, -0.5);
        d.mesh.position.copy(d.body.position);

        d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
        d.body.quaternion.copy(d.mesh.quaternion);

        const force = 1 + 2 * Math.random();
        d.body.applyImpulse(
            new CANNON.Vec3(-force, force, 0),
            new CANNON.Vec3(0, 0, 0.2)
        );

        d.body.allowSleep = true;
    });
}
