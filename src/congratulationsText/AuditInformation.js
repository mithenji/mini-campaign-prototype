import { Playground } from './Playground';
import { CreateDOMElement } from './CreateDOMElement';


export function InitializeAuditTemplate(administratorInfo) {

    const auditInformationTemplate = [
        {
            elementTagName: 'div',
            elementClassName: ['auditInformationContainer'],
            childrenNodes: [
                {
                    elementTagName: 'div',
                    elementClassName: ['administratorInfo'],
                    childrenNodes: [
                        { elementTagName: 'div', elementClassName: ['emptyPlaceholder'] },
                        { elementTagName: 'div', elementClassName: ['administratorAvatar']}
                    ]
                },
                {
                    elementTagName: 'div',
                    elementClassName: ['congratulationsFormContainer'],
                    childrenNodes: [
                        { elementTagName: 'h3', elementClassName: ['textTitle'], elementInnerHtml: '创建电子贺卡' },
                        {
                            elementTagName: 'form', elementClassName: ['sectionFormContainer'],
                            childrenNodes: [{
                                elementTagName: 'label', elementClassName: ['sectionCongratulationsTitle'], attribute: { 'for': 'itemCongratulationsTitle' },
                                childrenNodes: [{
                                    elementTagName: 'input', elementClassName: ['itemCongratulationsInput', 'typeInput'],
                                    attribute: { 'placeholder': '澳门金沙度假区祝贺您：', 'id': 'itemCongratulationsTitle', 'type': 'text' }
                                }]
                            }, {
                                elementTagName: 'label', elementClassName: ['sectionCongratulationsMessage'], attribute: { 'for': 'itemCongratulationsMessage' }, childrenNodes: [{
                                    elementTagName: 'textarea', elementClassName: ['itemCongratulationsInput', 'typeTextarea'],
                                    attribute: { 'placeholder': '新春福旺鸿运开 佳节吉祥如意来', 'id': 'itemCongratulationsMessage', 'type': 'text' }
                                }]
                            }, {
                                elementTagName: 'p', elementClassName: ['sectionCongratulationsTips'], elementInnerHtml: '空格全部转换为换行'
                            }, {
                                elementTagName: 'label', elementClassName: ['sectionCongratulationsSignature'], attribute: { 'for': 'itemCongratulationsSignature' }, childrenNodes: [{
                                    elementTagName: 'input', elementClassName: ['itemCongratulationsInput', 'typeSignature'],
                                    attribute: { 'placeholder': '发信人, 留空则不显示', 'id': 'itemCongratulationsSignature', 'type': 'text' }
                                }]
                            }, {
                                elementTagName: 'div', elementClassName: ['sectionFormControl'], childrenNodes: [{
                                    elementTagName: 'button', elementClassName: ['congratulationsSubmitButton'], attribute: { 'id': 'congratulationsSubmitButton' }, elementInnerHtml: `提交`
                                }]
                            }]
                        }]
                }]
        }];

    let campaignContainer = document.querySelector('body.campaign');
    let campaignScriptConfig = document.querySelector('#ext_config');
    let auditInformationTemplateEl = CreateDOMElement(auditInformationTemplate)[0];
    let congratulationsSubmitButton = auditInformationTemplateEl.querySelector('#congratulationsSubmitButton');
    campaignContainer.insertBefore(auditInformationTemplateEl, campaignScriptConfig);

    const validatorFormFields = ['itemCongratulationsTitle', 'itemCongratulationsMessage', 'itemCongratulationsSignature'];
    validatorFormFields.forEach(item => {
        let _itemValue = window.sessionStorage.getItem(item);
        if (_itemValue && item !== 'itemCongratulationsMessage') document.querySelector('#' + item).setAttribute('value', _itemValue);
        if (_itemValue && item === 'itemCongratulationsMessage') document.querySelector('#' + item).innerText = _itemValue;
    });

    congratulationsSubmitButton.addEventListener('click', confirmCongratulationsEvent);


    function confirmCongratulationsEvent(event) {

        event.preventDefault();
        event.stopPropagation();

        congratulationsSubmitButton.disabled = true;
        congratulationsSubmitButton.classList.add('hoverClass');

        const validatorFormValues = {};
        validatorFormFields.forEach(item => {
            let itemInputValue = document.querySelector('#' + item).value.trim();
            switch (item) {
                case 'itemCongratulationsTitle':
                    validatorFormValues[item] = ( !!itemInputValue ) ? itemInputValue : '澳门金沙度假区祝贺您：';
                    window.sessionStorage.setItem(item, validatorFormValues[item]);
                    break;
                case 'itemCongratulationsMessage':
                    validatorFormValues[item] = ( !!itemInputValue ) ? itemInputValue : '新春福旺鸿运开 佳节吉祥如意来';
                    window.sessionStorage.setItem(item, validatorFormValues[item]);
                    break;
                case 'itemCongratulationsSignature':
                    validatorFormValues[item] = ( !!itemInputValue ) ? itemInputValue : '';
                    window.sessionStorage.setItem(item, validatorFormValues[item]);
                    break;
            }
        });

        window.setTimeout(() => {
            congratulationsSubmitButton.disabled = false;
            congratulationsSubmitButton.classList.remove('hoverClass');
            Playground(validatorFormValues);
        }, 500);
    }
}

