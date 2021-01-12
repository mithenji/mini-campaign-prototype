import * as PIXI from "pixi.js";

import "./styles/main.scss";
import "/static/assets/reset.scss";


let PlaygroundView;
const Loader = new PIXI.Loader();
const sprites = Object.create(null);
const RootContainer = new PIXI.Container();
const PixelRatio = window.devicePixelRatio; // 2 in case of retinas

// Screen
const DomWidth = document.documentElement.clientWidth;
const DomHeight = document.documentElement.clientHeight;

const scaleIncrement = DomWidth / 375;
const body = document.querySelector("body");
const playgroundElement = document.querySelector(".playground");


/***
 * Config
 */
const imagesSprite = {};
const videoResource = {};
const videoUrl = ["/assets/video/t0.mp4", "/assets/video/GyL70N.mp4"];
const imageUrl = ["assets/images/mask.jpg"];


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
    });
}

PlaygroundView = initCanvasContainer(playgroundElement);

/**
 * loaderResources
 *
 */
function loaderImageSpriteResources() {
    Loader
        .add("mask", "assets/images/mask.jpg")
        .add("background", "assets/images/background.png")
        .add("backgroundWhite", "assets/images/backgroundWhite.jpg")
        .add("backgroundBlack", "assets/images/backgroundBlack.jpg")
        .load((loader, resources) => {
            console.log(loader, resources);
            handleImagesResourceSprite(resources);
            flow();
        });

    Loader.onProgress.add((event) => {
        console.log(event);
    });
}

function generateAssetsObj(urlArray) {
    return urlArray.reduce((accumulator, currentValue) => {
        let urlName = currentValue.match(/[-_\w]+[.][\w]+$/i)[0].replace(/.mp4|.jpg/gi, "");
        accumulator[urlName] = {url: currentValue};
        return accumulator;
    }, {});

}

function loadVideoResources(videoUrl) {

    let videoAssets = generateAssetsObj(videoUrl);
    for (let videoItem in videoAssets) {

        let _item_url;
        if(videoAssets.hasOwnProperty(videoItem)) {

            _item_url = videoAssets[videoItem]["url"];

            let tempVideoResource = new PIXI.resources.VideoResource(_item_url, {autoPlay: false});
            let tempVideoBaseTexture = new PIXI.BaseTexture(tempVideoResource);
            let videoTexture = new PIXI.Texture(tempVideoBaseTexture);
            let tempVideoSprite = new PIXI.Sprite(videoTexture);

            tempVideoBaseTexture.resolution = 2;
            tempVideoSprite.interactive = true;
            // tempVideoBaseTexture.visible = true;
            tempVideoSprite.x = PlaygroundView.renderer.width / (PixelRatio * 2);
            tempVideoSprite.y = PlaygroundView.renderer.height / (PixelRatio * 2);
            //
            tempVideoSprite.anchor.x = 0.5;
            tempVideoSprite.anchor.y = 0.5;

            videoAssets[videoItem]["tempVideoBaseTexture"] = tempVideoBaseTexture;
            videoAssets[videoItem]["tempVideoResource"] = tempVideoResource;
            videoAssets[videoItem]["tempVideoSprite"] = tempVideoSprite;
        }
    }

    Object.assign(videoResource, videoAssets);

    // console.log(videoResource);

}

/**
 *
 * @param resource
 * @returns {*}
 */
function handleImagesResourceSprite(resource) {

    for (let item in resource) {
        if(resource.hasOwnProperty(item)) {
            console.log(item, resource);
            let tempSprite = new PIXI.Sprite(resource[item]["texture"]);
            //
            tempSprite.x = PlaygroundView.renderer.width / (PixelRatio * 2);
            tempSprite.y = PlaygroundView.renderer.height / (PixelRatio * 2);
            tempSprite.anchor.x = 0.5;
            tempSprite.anchor.y = 0.5;

            imagesSprite[item] = tempSprite;
        }
    }
}

function flow() {

    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(100, 250, 200, 300);
    graphics.endFill();



    imagesSprite['mask'].anchor.x = -0.5;
    imagesSprite['mask'].anchor.y = -0.5;

    // const   graphicsSprite = new PIXI.Texture(graphics)


    // PlaygroundView.stage.addChild(videoResource["t0"].tempVideoSprite);
    // PlaygroundView.stage.addChild(videoResource["GyL70N"].tempVideoSprite);
    // PlaygroundView.stage.addChild(imagesSprite['backgroundBlack']);
    // PlaygroundView.stage.addChild(graphics);

    // videoResource["t0"].tempVideoSprite.mask =  videoResource["GyL70N"].tempVideoSprite
    // videoResource["GyL70N"].tempVideoSprite.mask = imagesSprite['backgroundBlack']
    // graphics.mask = imagesSprite['backgroundBlack']

    // console.log(videoResource["GyL70N"].tempVideoResource);
    // videoResource["GyL70N"].tempVideoResource.source.loop = true;
    videoResource["GyL70N"].tempVideoSprite.on("tap", function (event) {
        // videoResource["t0"].tempVideoSprite.on("tap", function (event) {
        // let video_t0 = videoResource["t0"].tempVideoResource.source;
        let video_GyL70N =  videoResource["GyL70N"].tempVideoResource.source;

        // video_t0.play().then(r => console.log(r));
        video_GyL70N.play().then();

        // console.log(video_t0, event);
    }, false);
}

loaderImageSpriteResources();
loadVideoResources(videoUrl);
// flow();