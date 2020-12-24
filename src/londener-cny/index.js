import * as PIXI from "pixi.js";
import {gsap} from "gsap"

const loader = new PIXI.Loader();
const sprites = Object.create(null);
const rootContainer = new PIXI.Container();
const cloudsContainer = new PIXI.Container();
const gridsContainer = new PIXI.Container();
const PixelRatio = window.devicePixelRatio // 2 in case of retinas

// Screen
const DomWidth = document.documentElement.clientWidth;
const DomHeight = document.documentElement.clientHeight;

const scaleIncrement = DomWidth / 375;
const body = document.querySelector("body");
const playground = document.querySelector(".playground")


/***
 *
 * @param canvas
 * @returns {PIXI.Application}
 */

function initCanvasContainer(canvas) {
    return new PIXI.Application({
        view: canvas,
        resizeTo: body,
        antialias: true,
        transparent: true,
        autoDensity: true,
        resolution: PixelRatio
    })
}


initCanvasContainer(playground);