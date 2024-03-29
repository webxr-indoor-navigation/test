import './App.css';
import {ARButton} from './lib/ARButton';
import * as THREE from "three";
import {MeshLine, MeshLineGeometry, MeshLineMaterial} from '@lume/three-meshline'

export default function App() {
    let camera, scene, renderer;
    let controller;

    const camera_height = 0;
    const target_position = new THREE.Vector3(0, camera_height - 0.1, -1); // 存储位置向量
    const line_height = camera_height - 0.5;

    let points = [];
    points.push(0, line_height, 0); // 添加相机位置作为起始点
    points.push(target_position.x, line_height, target_position.z); // 添加立方体位置作为终止点
    // points.push(0, 0, -1); // 添加相机位置作为起始点
    // points.push(0.1, 0.1, -1); // 添加立方体位置作为终止点

    // 创建线段的几何体
    const line_geometry = new MeshLineGeometry();
    line_geometry.setPoints(points);
    const line_material = new MeshLineMaterial({
        color: 0xff0000,
        lineWidth: 0.1,
        sizeAttenuation: false,
        dashArray: 0.05
    });

    function init() {
        const container = document.createElement("div");
        document.body.appendChild(container);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
        light.position.set(0.5, 1, 0.25);
        scene.add(light);

        //

        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        container.appendChild(renderer.domElement);

        //

        document.body.appendChild(ARButton.createButton(renderer));

        //

        const cube_geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const cube_material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(cube_geometry, cube_material);
        cube.position.copy(target_position); // 将位置向量应用到cube的位置
        scene.add(cube);

        //
        // 创建起始位置为相机位置，终止位置为立方体位置的线段


        // 创建线段对象
        const line = new MeshLine(line_geometry, line_material);
        // const raycaster = new THREE.Raycaster()
        // // Use raycaster as usual:
        // raycaster.intersectObject(line)
        // 将线段添加到场景中
        scene.add(line);

        //

        const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(Math.PI / 2);

        function onSelect() {
            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff * Math.random(),
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, -0.3).applyMatrix4(controller.matrixWorld);
            mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
            // scene.add(mesh);
        }

        controller = renderer.xr.getController(0);
        controller.addEventListener("select", onSelect);
        scene.add(controller);

        //

        window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        renderer.setAnimationLoop(render);
    }

    function render() {
        // 更新线段的起始点的x和z坐标为相机位置，y永远为-0.1
        points[0] = camera.position.x;
        points[2] = camera.position.z;

        line_geometry.setPoints(points);

        renderer.render(scene, camera);
    }

    init();
    animate();

    return (
        <div className="App">

        </div>);


}

