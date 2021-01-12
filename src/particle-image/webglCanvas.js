const $script = require('scriptjs');
//
// export default class WebGLAnimation {
//
//   constructor(rootElement, params) {
//
//     this.canvas = createCanvas(document, rootElement);
//     this.requestAnimationFrameId = 0;
//     this.scriptURL = params.scriptURL;
//     this.modelURL = params.modelURL;
//     this.onLoad = params.onLoad;
//     this.onProgress = params.onProgress;
//
//     const scope = this;
//
//     loadScript();
//
//     function loadScript() {
//
//       $script(scope.scriptURL, function() {
//
//         let filename = scope.scriptURL.split('/').pop();
//         filename = filename.replace(/\.[^/.]+$/, "");
//
//         if( filename === 'ModelViewer') {
//           scope.viewer = new window[filename](scope.modelURL, $script, scope.canvas, scope.onLoad, scope.onProgress);
//         } else if( filename === 'DiamondViewer') {
//           scope.viewer = new window[filename](scope.modelURL, $script, scope.canvas, scope.onLoad, scope.onProgress);
//         } else {
//           scope.viewer = new window[filename]($script, scope.canvas, scope.onLoad);
//         }
//
//       });
//     }
//
//     function createCanvas(document, containerElement) {
//       const canvas = document.createElement('canvas');
//       containerElement.appendChild(canvas);
//       return canvas;
//     }
//
//   }
//
//   destroy() {
//     this.viewer.dispose();
//     this.viewer = null;
//     // cancelAnimationFrame(this.requestAnimationFrameId);
//     // if(this.component3d.dispose) {
//     //   this.component3d.dispose();
//     // }
//     // this.component3d = null;
//     // window[this.filename] = null;
//   }
//
//
// }



// WEBPACK FOOTER //
// ./src/components/webgl/webglCanvas.js