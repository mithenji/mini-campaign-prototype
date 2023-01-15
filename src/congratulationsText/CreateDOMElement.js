export function CreateDOMElement(constructElement) {
    let htmlElement = [];
    for (const element of constructElement) {

        let _rootElement = document.createElement(element.elementTagName);
        element.elementClassName.filter(className => className !== '').forEach(className => {
            _rootElement.classList.add(className);
        });

        if (element.attribute) {
            for (const attr in element.attribute) {
                _rootElement.setAttribute(attr, element.attribute[attr]);
            }
        }

        if (element.elementInnerHtml) _rootElement.innerHTML = element.elementInnerHtml;

        if (element.childrenNodes) {
            crateElementChildrenNodes(_rootElement, element.childrenNodes);
        }

        htmlElement.push(_rootElement);
    }

    function crateElementChildrenNodes(rootElement, childrenNodes) {
        for (const childElement of childrenNodes) {

            let _childElement = document.createElement(childElement.elementTagName);
            if (childElement.attribute) {
                for (const attr in childElement.attribute) {
                    _childElement.setAttribute(attr, childElement.attribute[attr]);
                }
            }

            if (childElement.stylesheet) {
                for (const attr in childElement.stylesheet) {
                    _childElement.style[attr] = childElement.stylesheet[attr];
                }
            }

            if (childElement.elementClassName) {
                _childElement.classList.add(...childElement.elementClassName);
            }

            if (childElement.elementInnerHtml) _childElement.innerHTML = childElement.elementInnerHtml;

            if (childElement.childrenNodes) {
                crateElementChildrenNodes(_childElement, childElement.childrenNodes);
            }

            rootElement.appendChild(_childElement);
        }
    }

    return htmlElement;
}