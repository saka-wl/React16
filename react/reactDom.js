

/**
 * 递归将虚拟dom转化为真实dom并且挂载
 * @param {*} element 挂载的虚拟dom
 * @param {*} container 被挂载的真实dom
 */
export function render(element, container) {
    const childNode = document.createElement(element.type);
    // 遍历挂载属性
    for(const key in element.props) {
        if(key === 'className')
            childNode.classList.add(element.props[key]);
        else if(key !== 'children') 
            childNode[key] = element.props[key];
    }
    // 处理其子节点
    if(element.type === 'text' || !element.props?.children || !element.props.children?.length) {
        childNode.innerHTML = element.props?.nodeValue || '';
    } else {
        for(const elem of element.props.children) {
            render(elem, childNode);
        }
    }
    // 挂载到真实dom
    container.appendChild(childNode);
}