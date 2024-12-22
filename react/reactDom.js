

// 下一个功能单元
let nextUnitOfWork = null;

/**
 * React16工作原理 Fiber Node
 * 递归将虚拟dom转化为真实dom并且挂载
 * @param {*} element 挂载的虚拟dom
 * @param {*} container 被挂载的真实dom
 */
export function render(element, container) {
    // 记录根节点，第一个工作单位
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
}

/**
 * 通过fiber数据结构来创建真实dom
 * 一次dom生成的操作
 * @param {*} fiber 
 */
function createDom(fiber) {
    // 创建该fiber对应的真实node
    const dom = fiber.type === 'TEXT_ELEMENT' ?
        document.createTextNode('') :
        document.createElement(fiber.type);
    const isProperty = key => key !== 'children';
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach((key) => {
            if(key === 'className') {
                dom.classList.add(fiber.props[key]);
                return;
            }
            dom[key] = fiber.props[key];
        });
    return dom;
}

function workLoop(deadline) {
    // 是否停止遍历
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        // 获取优先级更高的任务
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        // 当前帧的剩余时间没了就停止处理
        shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
}

// 当浏览器当前帧空闲时处理任务
requestIdleCallback(workLoop);

/**
 * 处理当前工作单元，返回下一个工作单元
 * 深度优先
 * @param {*} fiber 工作单元
 */
function performUnitOfWork(fiber) {
    if(!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    if(fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom);
    }
    const element = fiber.props.children;
    let index = 0;
    // 上一个兄弟节点
    let prevSibling = null;
    while(element && index < element.length) {
        /**
         * fiber node数据结构
         */
        const newFiber = {
            type: element[index].type,
            props: element[index].props,
            parent: fiber,
            dom: null,
            index,
        }
        // 第一个子元素挂载到fiber的child属性下
        if(index === 0) {
            fiber.child = newFiber;
        } else if(newFiber) {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
        index ++;
    }
    // 深度优先
    if(fiber.child) return fiber.child;
    // 遍历广度
    else if(fiber.sibling) return fiber.sibling;
    else return fiber.parent?.sibling;

    // let nextFiber = fiber;
    // while (nextFiber) {
    //   // 如果有兄弟节点，返回兄弟节点
    //   if (nextFiber.sibling) {
    //     return nextFiber.sibling;
    //   }

    //   // 否则返回父节点
    //   nextFiber = nextFiber.parent;
    // }
}


/**
 * React15工作原理
 * 递归将虚拟dom转化为真实dom并且挂载
 * @param {*} element 挂载的虚拟dom
 * @param {*} container 被挂载的真实dom
 */
export function render_15(element, container) {
    const childNode = document.createElement(element.type);
    // 遍历挂载属性
    for (const key in element.props) {
        if (key === 'className')
            childNode.classList.add(element.props[key]);
        else if (key !== 'children')
            childNode[key] = element.props[key];
    }
    // 处理其子节点
    if (element.type === 'text' || !element.props?.children || !element.props.children?.length) {
        childNode.innerHTML = element.props?.nodeValue || '';
    } else {
        for (const elem of element.props.children) {
            render(elem, childNode);
        }
    }
    // 挂载到真实dom
    container.appendChild(childNode);
}