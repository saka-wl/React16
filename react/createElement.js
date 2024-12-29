


/**
 * 创建一个文本节点
 * @param {*} node 
 */
function createTextElement(node) {
    return {
        type: TEXT,
        props: {
            nodeValue: node,
            children: []
        },
        key: null,
    }
}

/**
 * 实现 React.createElement("p", null, "Hello");
 * @param {*} type 
 * @param {*} props 
 * @param  {...any} children 
 * @returns { any } node
 */
export function createElement(type, props, ... children) {
    return {
        type,
        props: {
            ... props,
            children: children.map(child => {
                if(typeof child === 'object') return child;
                else if(typeof child === 'string') return createTextElement(child);
            }),
        },
        key: null
    }
}

/**
 * 代表<></>的类型type
 */
export const Fragment = 'empty';

export const TEXT = 'TEXT_ELEMENT';