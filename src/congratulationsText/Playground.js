import { gsap } from 'gsap';
import { CreateDOMElement } from './CreateDOMElement';


export function DistributeByPosition(vars) {
    /*
     pass in an object with any of the following optional properties (just like the stagger special object):
     {
     amount: amount (in seconds) that should be distributed
     from: "center" | "end" | "edges" | start" | index value (integer)
     ease: any ease, like "power1"
     axis: "x" | "y" (or omit, and it'll be based on both the x and y positions)
     }
     */
    let ease = vars.ease && gsap.parseEase(vars.ease),
        from = vars.from || 0,
        base = vars.base || 0,
        axis = vars.axis,
        ratio = { center: 0.5, end: 1, edges: 0.5 }[from] || 0,
        distances;
    return function (i, target, a) {
        let l = a.length,
            originX, originY, x, y, d, j, minX, maxX, minY, maxY, positions;
        if (!distances) {
            distances = [];
            minX = minY = Infinity;
            maxX = maxY = -minX;
            positions = [];
            for (j = 0; j < l; j++) {
                d = a[j].getBoundingClientRect();
                x = ( d.left + d.right ) / 2; //based on the center of each element
                y = ( d.top + d.bottom ) / 2;
                if (x < minX) {
                    minX = x;
                }
                if (x > maxX) {
                    maxX = x;
                }
                if (y < minY) {
                    minY = y;
                }
                if (y > maxY) {
                    maxY = y;
                }
                positions[j] = { x: x, y: y };
            }
            originX = isNaN(from) ? minX + ( maxX - minX ) * ratio : positions[from].x || 0;
            originY = isNaN(from) ? minY + ( maxY - minY ) * ratio : positions[from].y || 0;
            maxX = 0;
            minX = Infinity;
            for (j = 0; j < l; j++) {
                x = positions[j].x - originX;
                y = originY - positions[j].y;
                distances[j] = d = !axis ? Math.sqrt(x * x + y * y) : Math.abs(( axis === 'y' ) ? y : x);
                if (d > maxX) {
                    maxX = d;
                }
                if (d < minX) {
                    minX = d;
                }
            }
            distances.max = maxX - minX;
            distances.min = minX;
            distances.v = l = ( vars.amount || ( vars.each * l ) || 0 ) * ( from === 'edges' ? -1 : 1 );
            distances.b = ( l < 0 ) ? base - l : base;
        }
        l = ( distances[i] - distances.min ) / distances.max;
        return distances.b + ( ease ? ease(l) : l ) * distances.v;
    };

    //END FUNCTION
}

export function CongratulationsMessageCharacterSet(text) {

    let testChineseTextRegExp = /\p{Unified_Ideograph}/u;
    // let matchNewLineCharacter = RegExp('/[\n\r\s+,]/', 'g');
    // let testChineseText = testChineseTextRegExp.test(text);

    let messageCharacterSet = [];
    console.log(text.split(/[\n\r\s]/g), testChineseTextRegExp.test(text));
    // return text.split(/[\n\r\s+,]/g);
    if (testChineseTextRegExp.test(text)) {
        let matchNewLineCharacter = text.split(/[\n\r\s]/g);
        matchNewLineCharacter.forEach(textItem => {
            if (textItem.length > 10) {
                messageCharacterSet.push(textItem.slice(0, 9));
                messageCharacterSet.push(textItem.slice(10));
            } else {
                return messageCharacterSet.push(textItem);
            }
        });
    } else {
        let matchNewLineCharacter = text.split(/[\n\r+,]/g);
        matchNewLineCharacter.forEach(textItem => {
            return messageCharacterSet.push(textItem);
        });
    }

    return messageCharacterSet;

}

export function AnimationText(playgroundContainer, textMessage, callback) {
    const _textMessage = textMessage;
    const _playgroundContainer = playgroundContainer;

    console.log('%c textMessage', 'color: #97C521', _textMessage);
    console.log('%c playgroundContainer', 'color: #97C521', _playgroundContainer);

    const congratulationsTextContainer = document.createElement('div');
    const congratulationsMsgContainer = document.createElement('div');
    const congratulationsTitle = document.createElement('div');
    const congratulationsSignature = document.createElement('div');

    congratulationsTextContainer.classList.add('congratulationsTextContainer');
    congratulationsMsgContainer.classList.add('congratulationsMsgContainer');
    congratulationsSignature.classList.add('congratulationsSignature');
    congratulationsTitle.classList.add('congratulationsTitle');


    const congratulationsTitleCharacterSet = _textMessage['itemCongratulationsTitle'].split('');
    const congratulationsMessageCharacterSet = CongratulationsMessageCharacterSet(_textMessage['itemCongratulationsMessage']);
    const congratulationsSignatureCharacterSet = _textMessage['itemCongratulationsSignature'].length === 0 ? [] : _textMessage.itemCongratulationsSignature.split('');


    let titleTextLine = document.createElement('div');
    titleTextLine.classList.add('titleTextLine');
    congratulationsTitleCharacterSet.forEach(character => {

        let itemCharacter = document.createElement('span');
        itemCharacter.classList.add('character');
        itemCharacter.innerText = character;
        titleTextLine.appendChild(itemCharacter);
    });

    congratulationsTitle.appendChild(titleTextLine);

    congratulationsMessageCharacterSet.forEach((textLine, index) => {
        let itemTextLine = document.createElement('div');
        let itemTextLineCharacterSet = textLine.split('');
        itemTextLine.classList.add('textLine' + index);

        itemTextLineCharacterSet.forEach(character => {
            let itemCharacter = document.createElement('span');
            itemCharacter.classList.add('character');
            itemCharacter.innerText = character;
            itemTextLine.appendChild(itemCharacter);
        });

        congratulationsMsgContainer.appendChild(itemTextLine);
    });

    if (congratulationsSignatureCharacterSet.length !== 0) {

        let signatureTextLine = document.createElement('div');
        signatureTextLine.classList.add('signatureTextLine');
        congratulationsSignatureCharacterSet.forEach(character => {
            let itemCharacter = document.createElement('span');
            itemCharacter.classList.add('character');
            // noinspection JSValidateTypes
            itemCharacter.innerText = character;
            signatureTextLine.appendChild(itemCharacter);
        });

        congratulationsSignature.appendChild(signatureTextLine);

    }

    congratulationsTextContainer.append(congratulationsTitle, congratulationsMsgContainer, congratulationsSignature);
    _playgroundContainer.append(congratulationsTextContainer);


    const characterSetTimeline = gsap.timeline();

    characterSetTimeline.from('.congratulationsTextContainer .character', {
        duration: 1.25,
        scale: 1.25,
        opacity: 0,
        repeat: 0,
        ease: 'power1.inOut',
        stagger: DistributeByPosition({
            each: 0.15,
            from: 'start'
        })
    });

    characterSetTimeline.then(() => {
        // window.setTimeout(ReplayPlayground, 1250);
    });

    //this just helps avoid the pixel-snapping that some browsers do.
    gsap.set('.congratulationsTextContainer .character', { rotation: 0.5, force3D: true });

}


export function Playground(textMessage) {
    const dataMessage = textMessage;
    const playgroundTemplate = [
        {
            elementTagName: 'div',
            elementClassName: ['playgroundContainer'],
            childrenNodes: [
                { elementTagName: 'canvas', elementClassName: ['sectionPlaygroundCanvas'] },
                { elementTagName: 'button', elementClassName: ['musicControlButton'] }
            ]
        }
    ];

    let campaignContainer = document.querySelector('body.campaign');
    let campaignScriptConfig = document.querySelector('#ext_config');
    let playgroundTemplateEl = CreateDOMElement(playgroundTemplate)[0];
    let auditInformationContainerEl = document.querySelector('.auditInformationContainer');
    // let musicControlButton = playgroundTemplateEl.querySelector('.musicControlButton');

    if (auditInformationContainerEl) campaignContainer.removeChild(auditInformationContainerEl);
    // if (window._ext_config.user_info) ResetAndSaveControl(dataMessage);
    campaignContainer.insertBefore(playgroundTemplateEl, campaignScriptConfig);

    console.log('_dataMessage => ', dataMessage);

    const _devicePixelRatio = Math.floor(window.devicePixelRatio); // 2 in case of retinas

    let playgroundCanvas = document.querySelector('.sectionPlaygroundCanvas');
    let playgroundCanvasClientWidth = document.documentElement.clientWidth * _devicePixelRatio * 0.75;
    let playgroundCanvasClientHeight = document.documentElement.clientHeight * _devicePixelRatio * 0.75;

    playgroundCanvas.width = playgroundCanvasClientWidth;
    playgroundCanvas.height = playgroundCanvasClientHeight;

    playgroundCanvas.style.width = document.documentElement.clientWidth + 'px';
    playgroundCanvas.style.height = document.documentElement.clientHeight + 'px';

    console.log(playgroundCanvasClientWidth, playgroundCanvasClientHeight);
    // console.log(playgroundRiv);

    // ReplayPlayground();
    // return AnimationText(playgroundTemplateEl, dataMessage);
    AnimationText(playgroundTemplateEl, dataMessage);

}


