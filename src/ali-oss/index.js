/**
 * Created by mithen on 2020/12/30.
 */


import "framework7/framework7.less";
import "framework7/components/form.css";
import "framework7/components/list-index.css";

import './styles/reset.scss';



import Framework7, {Dom7} from "framework7/framework7-lite.esm";
import "framework7/components/list-index/list-index.js";
import "framework7/components/input/input.js";
import "framework7/components/form/form.js";

function AliOSSUpload() {
    const App = new Framework7({
        root: "#app",
        touch: {
            fastClicks: true    // Enable fast clicks
        },
    });

    console.log(App)
}

//if(document.readyState === "loading") {  // 此时加载尚未完成
    document.addEventListener("DOMContentLoaded", AliOSSUpload);
//}