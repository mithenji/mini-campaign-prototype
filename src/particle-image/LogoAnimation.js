import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass.js";
import {CopyShader} from "three/examples/jsm/shaders/CopyShader.js";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import LuminosityHighPassShader from "three/examples/jsm/shaders/LuminosityHighPassShader";
import ConvolutionShader from "three/examples/jsm/shaders/ConvolutionShader";
import RectAreaLightUniformsLib from "three/examples/jsm/lights/RectAreaLightUniformsLib";

export default function Component3d() {

    let component3d;
    let requestId;
    let dispose_ = false;
    let canvas = document.getElementById("webgl_playground");
    let camera, scene, renderer, composer, bloomPass;

    let canvasWebgl;
    let mode = 0;

    let geometry, mesh;
    let iconPixotron, iconiJewel, iconPixotronics;
    let directionX = new THREE.Vector2(1, 0);
    let directionY = new THREE.Vector2(0, 1);
    let directionXY = new THREE.Vector2(1, 1);
    let direction = new THREE.Vector2(1, 1);
    let textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "";

    let time = {t: 0};
    let tween1 = new TWEEN.Tween(time).to({t: 1}, 3500);
    let tween2 = new TWEEN.Tween(time).to({t: 0}, 3500);
    let tween3 = new TWEEN.Tween(time).to({t: 1}, 3500);
    let tween4 = new TWEEN.Tween(time).to({t: 0}, 3500);
    let tween5 = new TWEEN.Tween(time).to({t: 1}, 3500);
    let tween6 = new TWEEN.Tween(time).to({t: 0}, 3500);
    let tween7 = new TWEEN.Tween(time).to({t: 1}, 3500);
    let tween8 = new TWEEN.Tween(time).to({t: 0}, 3500);

    // tween1.easing(TWEEN.Easing.Exponential.Out);
    tween2.easing(TWEEN.Easing.Bounce.In);
    // tween3.easing(TWEEN.Easing.Exponential.Out);
    tween4.easing(TWEEN.Easing.Bounce.In);
    // tween5.easing(TWEEN.Easing.Exponential.Out);
    tween6.easing(TWEEN.Easing.Bounce.In);
    // tween7.easing(TWEEN.Easing.Exponential.Out);
    tween8.easing(TWEEN.Easing.Bounce.In);

    // Pixotronics scale
    tween1.onUpdate(function (params) {
        let box = mesh.geometry.boundingBox;
        let center = new THREE.Vector3();
        box.getCenter(center);
        bloomPass.strength = 2 * params.t;
        if(mode === 0) {
            scale(iconPixotronics, center, direction, params.t);
        } else {
            let t = Math.pow(1 - params.t, 1) * 3;
            randomOut(t);
        }
    });

    // Morph to iJewel
    tween2.onUpdate(function (params) {
        bloomPass.strength = 2 * params.t;
        let t = Math.pow(1 - params.t, 6);
        morphTo(iconiJewel, t);
        if(t > 0.1) {
            mesh.material.map = iconiJewel.texture;
            mesh.material.needsUpdate = true;
        }
    });

    // iJewel scale
    tween3.onUpdate(function (params) {
        let box = mesh.geometry.boundingBox;
        let center = new THREE.Vector3();
        box.getCenter(center);
        bloomPass.strength = 2 * params.t;
        if(mode === 0) {
            scale(iconiJewel, center, direction, 3 * params.t);
        } else {
            let t = Math.pow(1 - params.t, 1) * 3;
            randomOut(t);
        }
    });

    // Morph to Pixotronics
    tween4.onUpdate(function (params) {
        let t = Math.pow(1 - params.t, 4);
        morphTo(iconPixotronics, t);
        bloomPass.strength = 2 * params.t;
        if(t > 0.2) {
            mesh.material.map = iconPixotronics.texture;
            mesh.material.needsUpdate = true;
        }
    });

    // Pixotronics scale
    tween5.onUpdate(function (params) {
        let box = mesh.geometry.boundingBox;
        let center = new THREE.Vector3();
        box.getCenter(center);
        bloomPass.strength = 2 * params.t;
        if(mode === 0) {
            scale(iconPixotronics, center, direction, params.t);
        } else {
            let t = Math.pow(1 - params.t, 1) * 3;
            randomOut(t);
        }
    });

    // Morph to Pixotron
    tween6.onUpdate(function (params) {
        bloomPass.strength = 2 * params.t;
        let t = Math.pow(1 - params.t, 4);
        morphTo(iconPixotron, t);
        if(t > 0.2) {
            mesh.material.map = iconPixotron.texture;
            mesh.material.needsUpdate = true;
        }
    });

    // Pixotron scale
    tween7.onUpdate(function (params) {
        let box = mesh.geometry.boundingBox;
        let center = new THREE.Vector3();
        box.getCenter(center);
        bloomPass.strength = 2 * params.t;
        if(mode === 0) {
            // scale(iconPixotron, center, direction, 3 * params.t);
            scale(iconPixotron, center, direction, 2 * params.t);
        } else {
            let t = Math.pow(1 - params.t, 1) * 2;
            randomOut(t);
        }
    });

    // Morph to Pixotronics
    tween8.onUpdate(function (params) {
        let t = Math.pow(1 - params.t, 4);
        morphTo(iconPixotronics, t);
        bloomPass.strength = 2 * params.t;
        if(t > 0.2) {
            mesh.material.map = iconPixotronics.texture;
            mesh.material.needsUpdate = true;
        }
    });

    tween8.onComplete(function () {
        mode++;
        mode = mode % 2;
    });

    // tween1.chain(tween2);
    // tween2.chain(tween3);
    // tween3.chain(tween4);
    // tween4.chain(tween5);
    // tween5.chain(tween6);
    // tween6.chain(tween7);
    // tween7.chain(tween8);
    // tween8.chain(tween1);

    tween7.chain(tween8);
    tween8.chain(tween7);

    init();
    resizeCanvas();
    bindEventListeners();
    render();

    function createIcon(imageURL, width, height, callback) {
        let icon = {};

        const dx = 0.5;
        const dy = 0.5;

        let positions = [];
        let uvs = [];

        const position = new THREE.Vector3();

        for (let i = 0; i < width; i++) {
            position.y = 0;

            for (let j = 0; j < height; j++) {

                const x = position.x + dx;
                const y = position.y + dy;

                positions.push(x - dx, y + dy, 0);
                positions.push(x + dx, y + dy, 0);
                positions.push(x + dx, y - dy, 0);

                uvs.push((x - dx) / width, Math.abs(y + dy) / height);
                uvs.push((x + dx) / width, Math.abs(y + dy) / height);
                uvs.push((x + dx) / width, Math.abs(y - dy) / height);

                positions.push(x - dx, y + dy, 0);
                positions.push(x + dx, y - dy, 0);
                positions.push(x - dx, y - dy, 0);

                uvs.push((x - dx) / width, Math.abs(y + dy) / height);
                uvs.push((x + dx) / width, Math.abs(y - dy) / height);
                uvs.push((x - dx) / width, Math.abs(y - dy) / height);

                position.y += 2 * dy;
            }
            position.x += 2 * dx;
        }

        icon.positions = positions;
        icon.uvs = uvs;
        icon.width = width;
        icon.height = height;

        textureLoader.load(imageURL, function (texture) {

            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            // texture.encoding = THREE.sRGBEncoding;

            texture.needsUpdate = true;
            icon.texture = texture;
            if(callback) {
                callback(icon);
            }
        });

        console.log(icon);
        return icon;
    }

    function morphTo(icon, t) {

        let positions = geometry.attributes["position"].array;
        let uvs = geometry.attributes["uv"].array;

        let targetPositions = icon.positions;
        let targetUvs = icon.uvs;

        for (let i = 0; i < positions.length; i += 18) {

            let vx = (targetPositions[i] - positions[i]);
            let vy = (targetPositions[i + 1] - positions[i + 1]);

            vx *= t;
            vy *= t;

            for (let j = 0; j < 18; j += 3) {
                positions[i + j] += vx;
                positions[i + j + 1] += vy;
            }

        }

        for (let i = 0; i < uvs.length; i += 12) {

            let vx = (targetUvs[i] - uvs[i]);
            let vy = (targetUvs[i + 1] - uvs[i + 1]);

            vx *= t;
            vy *= t;

            for (let j = 0; j < 12; j += 2) {
                uvs[i + j] += vx;
                uvs[i + j + 1] += vy;
            }

        }

        // for( let i=0; i<uvs.length; i ++) {
        // 		uvs[i] = targetUvs[i];
        // }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.uv.needsUpdate = true;

    }

    function changeIconTo(icon) {
        let positionsIcon = icon.positions;
        let uvsIcon = icon.uvs;
        let positions = geometry.attributes["position"].array;
        let uvs = geometry.attributes["uv"].array;

        for (let i = 0; i < positions.length; i++) {
            positions[i] = positionsIcon[i];
        }
        for (let i = 0; i < uvs.length; i++) {
            uvs[i] = uvsIcon[i];
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.uv.needsUpdate = true;
    }

    function scale(icon, center, direction, factor) {

        let positions = geometry.attributes["position"].array;
        let originalPositions = icon.positions;

        factor = factor || 5.2;
        center = center || new THREE.Vector3();

        for (let i = 0; i < positions.length; i += 18) {
            let x1 = originalPositions[i];
            let y1 = originalPositions[i + 1];

            for (let j = 0; j < 18; j += 3) {
                positions[i + j] = originalPositions[i + j] + (x1 - center.x) * factor * direction.x;
                positions[i + j + 1] = originalPositions[i + j + 1] + (y1 - center.y) * factor * direction.y;
            }

        }

        geometry.attributes.position.needsUpdate = true;
    }

    function moveAwayFrom(geometry, center, direction, factor) {
        let positions = geometry.attributes["position"].array;
        let originalPositions = geometry.attributes["originalPositions"].array;

        factor = factor || 5.2;
        center = center || new THREE.Vector3();

        for (let i = 0; i < positions.length; i += 18) {
            let x1 = originalPositions[i];
            let y1 = originalPositions[i + 1];

            for (let j = 0; j < 18; j += 3) {
                positions[i + j] = originalPositions[i + j] + (x1 - center.x) * factor * direction.x;
                positions[i + j + 1] = originalPositions[i + j + 1] + (y1 - center.y) * factor * direction.y;
            }

        }

        geometry.attributes.position.needsUpdate = true;
    }

    function randomOut(factor) {
        let positions = geometry.attributes["position"].array;

        for (let i = 0; i < positions.length; i += 18) {

            let rand1 = (2 * Math.random() - 1) * factor;
            let rand2 = (2 * Math.random() - 1) * factor;

            for (let j = 0; j < 18; j += 3) {
                positions[i + j] += rand1;
                positions[i + j + 1] += rand2;
            }

        }

        geometry.attributes.position.needsUpdate = true;
    }

    function randomOut1(geometry) {
        let positions = geometry.attributes["position"].array;
        const n = 100;

        for (let i = 0; i < n * 18; i += 18) {

            let rand1 = Math.floor(Math.random() * positions.length / 18) * 18;
            let rand2 = (2 * Math.random() - 1);
            let rand3 = (2 * Math.random() - 1);

            for (let j = 0; j < 18; j += 3) {
                positions[rand1 + j] += rand2;
                positions[rand1 + j + 1] += rand3;
            }

        }

        geometry.attributes.position.needsUpdate = true;
    }

    function randomIn(geometry) {
        let positions = geometry.attributes["position"].array;
        let originalPositions = geometry.attributes["originalPositions"].array;

        for (let i = 0; i < positions.length; i += 18) {

            let vx = (originalPositions[i] - positions[i]);
            let vy = (originalPositions[i + 1] - positions[i + 1]);

            vx *= 0.095;
            vy *= 0.095;

            for (let j = 0; j < 18; j += 3) {
                positions[i + j] += vx;
                positions[i + j + 1] += vy;
            }

        }

        geometry.attributes.position.needsUpdate = true;
    }

    function modifyIconPositions(icon) {
        const width = icon.width;
        const height = icon.height;
        let size = renderer.getDrawingBufferSize();

        let x = size.width / window.devicePixelRatio / 2 - width / 2;
        let y = size.height / window.devicePixelRatio / 2 - height / 2;

        for (let i = 0; i < icon.positions.length; i += 3) {
            icon.positions[i] += x;
            icon.positions[i + 1] += y;
        }
    }

    function createMesh(icon) {

        modifyIconPositions(iconPixotron);
        modifyIconPositions(iconiJewel);
        modifyIconPositions(iconPixotronics);

        geometry = new THREE.BufferGeometry();

        geometry.setAttribute("position", new THREE.Float32BufferAttribute(icon.positions, 3));
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute(icon.uvs, 2));

        geometry.computeBoundingSphere();

        let material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            map: icon.texture
        });

        mesh = new THREE.Mesh(geometry, material);


        scene.add(mesh);
        geometry.computeBoundingBox();

        // tween1.start();
        tween7.start();
    }

    function initializePixelQuadsFromImage(imageURL) {
        textureLoader.crossOrigin = "";
        textureLoader.load(imageURL, function (texture) {

            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;

            const image = texture.image;
            const width = image.width;
            const height = image.height;

            const dx = 0.5;//0.5/width; const dy = 0.5/height;
            const dy = 0.5;

            let positions = [];
            let uvs = [];
            geometry = new THREE.BufferGeometry();

            const position = new THREE.Vector3();

            for (let i = 0; i < width; i++) {
                position.y = 0;

                for (let j = 0; j < height; j++) {

                    const x = position.x + dx;
                    const y = position.y + dy;

                    positions.push(x - dx, y + dy, 0);
                    positions.push(x + dx, y + dy, 0);
                    positions.push(x + dx, y - dy, 0);

                    uvs.push((x - dx) / width, Math.abs(y + dy) / height);
                    uvs.push((x + dx) / width, Math.abs(y + dy) / height);
                    uvs.push((x + dx) / width, Math.abs(y - dy) / height);

                    positions.push(x - dx, y + dy, 0);
                    positions.push(x + dx, y - dy, 0);
                    positions.push(x - dx, y - dy, 0);

                    uvs.push((x - dx) / width, Math.abs(y + dy) / height);
                    uvs.push((x + dx) / width, Math.abs(y - dy) / height);
                    uvs.push((x - dx) / width, Math.abs(y - dy) / height);

                    position.y += 2 * dy;
                }
                position.x += 2 * dx;
            }

            geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute("originalPositions", new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

            geometry.computeBoundingSphere();

            let material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                transparent: true,
                map: texture
            });
            material.needsUpdate = true;
            texture.needsUpdate = true;

            mesh = new THREE.Mesh(geometry, material);
            let size = renderer.getDrawingBufferSize();

            mesh.position.x = size.width / window.devicePixelRatio / 2 - width / 2;
            mesh.position.y = size.height / window.devicePixelRatio / 2 - height / 2;

            scene.add(mesh);

            geometry.computeBoundingBox();
            tween1.start();

        });
    }

    function checkVisible(elm) {
        let rect = elm.getBoundingClientRect();
        let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }

    function normalizeIconsData() {
        let positions1 = iconPixotron.positions;
        let positions2 = iconiJewel.positions;
        let positions3 = iconPixotronics.positions;

        let uvs1 = iconPixotron.uvs;
        let uvs2 = iconiJewel.uvs;
        let uvs3 = iconPixotronics.uvs;

        let n = (positions3.length - positions1.length);

        for (let i = 0; i < n; i++) {
            positions1.push(positions1[i]);
            positions2.push(positions2[i]);
        }

        n = (uvs3.length - uvs1.length);

        for (let i = 0; i < n; i++) {
            uvs1.push(uvs1[i]);
            uvs2.push(uvs2[i]);
        }
    }

    function init() {

        canvasWebgl = canvas;

        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -0.001, 100);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x170733);

        function callback(icon) {
            createMesh(icon);
        }

        //./assets/particle-image/CongratulationText.png
        // http://pixotronics.com.s3-website.ap-south-1.amazonaws.com/js/assets/images/logo_lowres_light.png, 233, 40
        iconPixotron = createIcon("./assets/particle-image/congratulation_text_x.png", 256, 256);
        iconiJewel = createIcon("./assets/particle-image/congratulation_text_x.png", 256, 256);
        iconPixotronics = createIcon("./assets/particle-image/congratulation_text.png", 256, 256, callback);

        // iconPixotron = createIcon("http://pixotronics.com.s3-website.ap-south-1.amazonaws.com/js/assets/images/pixtron-icon.png", 81, 81);
        // iconiJewel = createIcon("http://pixotronics.com.s3-website.ap-south-1.amazonaws.com/js/assets/images/ijewel-icon.png", 81, 81);
        // iconPixotronics = createIcon("http://pixotronics.com.s3-website.ap-south-1.amazonaws.com/js/assets/images/logo_lowres_light.png", 233, 40, callback);

        normalizeIconsData();
        // initializePixelQuadsFromImage("http://pixotronics.com.s3-website.ap-south-1.amazonaws.com/js/assets/images/pixtron-icon.png");

        renderer = new THREE.WebGLRenderer({canvas: canvasWebgl, antialias: true, alpha: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.width, canvas.height);
        // renderer.outputEncoding = THREE.sRGBEncoding;


        // renderer.gammaInput = true;  //discarded
        // renderer.gammaOutput = true; //discarded

        let renderScene = new RenderPass(scene, camera);
        renderScene.clear = true;

        bloomPass = new UnrealBloomPass(new THREE.Vector2(canvas.width, canvas.height), 1.5, 1.0, 0.98);//1.0, 9, 0.5, 512);
        bloomPass.enabled = true;
        bloomPass.threshold = 0.15;
        bloomPass.radius = 1;
        bloomPass.strength = 1;
        bloomPass.bloomTintColors[0] = new THREE.Vector3(6, 0, 0);
        bloomPass.bloomTintColors[1] = new THREE.Vector3(0, 2, 0);
        bloomPass.bloomTintColors[2] = new THREE.Vector3(0, 0, 2);
        bloomPass.bloomTintColors[3] = new THREE.Vector3(0, 2, 2);

        let copyPass = new ShaderPass(CopyShader);
        copyPass.renderToScreen = true;

        composer = new EffectComposer(renderer);
        composer.setSize(canvas.width * window.devicePixelRatio, canvas.height * window.devicePixelRatio);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);
        composer.addPass(copyPass);

    }

    function resize(width, height) {

        camera.left = 0;
        camera.right = width;
        camera.top = height;
        camera.bottom = 0;

        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        composer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio);

    }

    function update() {
        TWEEN.update();
    }

    function bindEventListeners() {
        window.onresize = resizeCanvas;
        resizeCanvas();
    }

    function resizeCanvas() {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        resize(canvas.width, canvas.height);
    }

    function render() {
        if(checkVisible(canvasWebgl)) {
            update();
            composer.render();
        }
        requestId = requestAnimationFrame(render);
    }

    this.dispose = function () {
        cancelAnimationFrame(requestId);
    };
}