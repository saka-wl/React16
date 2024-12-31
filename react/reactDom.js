
// 下一个功能单元
let nextUnitOfWork = null;
// 根节点
let wipRoot = null;
// 更新前的根节点fiber树
let currentRoot = null;
// 操作中需要删除的节点
let deletions = null;
const isEvent = (key) => key.startsWith('on');
const isProperty = key => key !== 'children';

/**
 * React16工作原理 Fiber Node
 * 递归将虚拟dom转化为真实dom并且挂载
 * @param {*} element 挂载的虚拟dom
 * @param {*} container 被挂载的真实dom
 */
export function render(element, container) {
    // 记录根节点，第一个工作单位
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        },
        // 上一次虚拟dom的根节点
        alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
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
    updateDom(dom, {}, fiber.props);
    return dom;
}

/**
 * 更新操作
 * 删除目标dom之前的props属性与事件绑定
 * 然后添加
 * @param {*} dom 更新的目标dom
 * @param {*} preProps 之前的props
 * @param {*} nextProps 更新之后的props
 */
function updateDom(dom, preProps = {}, nextProps = {}) {
    Object.keys(preProps)
        .filter(isProperty)
        .forEach((key) => {
            if(isEvent(key)) {
                dom.removeEventListener(key.toLocaleLowerCase().substring(2), preProps[key]);
                return;
            }
            dom[key] = null;
        });
    
    Object.keys(nextProps)
        .filter(isProperty)
        .forEach((key) => {
            if(isEvent(key)) {
                dom.addEventListener(key.toLocaleLowerCase().substring(2), nextProps[key]);
                return;
            }
            if (key === 'className') {
                dom.classList.add(nextProps[key]);
                return;
            }
            dom[key] = nextProps[key];
        });
}

/**
 * 处理提交的 fiber tree
 * @param {*} fiber 
 */
function commitWork(fiber) {
    if (!fiber || !fiber.dom) return;
    const domParent = fiber.parent?.dom;

    /**
     * 新增节点操作
     */
    if (fiber.effectTag === 'PLACEMENT' && fiber.dom && domParent) {
        domParent.appendChild(fiber.dom);
    }
    /**
     * 删除操作
     */
    if (fiber.effectTag === 'DELETION' && fiber.dom && domParent) {
        domParent.removeChild(fiber.dom);
    }
    /**
     * 更新操作
     */
    if (fiber.effectTag === 'UPDATE' && domParent) {
        updateDom(fiber.dom, fiber.alternate?.props || undefined, fiber.props);
    }

    // 深度优先
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

/**
 * 提交阶段 将 fiber node 渲染为真实dom
 * 与 createDom 不同
 * createDom 是生成 dom 元素
 * commitRoot 是在原有的 真实dom 基础上添加他的子节点等等
 */
function commitRoot() {
    deletions.forEach(commitWork);
    deletions = [];
    commitWork(wipRoot);
    // 让 currentRoot 等于这一课树的根节点（也就是下次工作中上一棵树的根节点）
    currentRoot = wipRoot;
    wipRoot = null;
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
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
    requestIdleCallback(workLoop);
}

// 当浏览器当前帧空闲时处理任务
requestIdleCallback(workLoop);

/**
 * 协调 + diff算法
 */
function reconcileChildren(wipFiber, elements) {
    let index = 0;
    // 上一个兄弟节点
    let prevSibling = null;
    // 上一次渲染的fiber
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    while ((elements && index < elements.length) || oldFiber) {
        let newFiber = null;
        const elem = elements[index];
        // 判断这个虚拟节点与上一次遍历的虚拟节点的类型是否相同
        const isSameType = elem && oldFiber && elem.type == oldFiber.type;
        if (isSameType) {
            // 新旧节点都存在 且 类型相同 更新操作
            newFiber = {
                type: oldFiber.type,
                dom: oldFiber.dom,
                // 衔接新老节点
                alternate: oldFiber,
                parent: wipFiber,
                props: elem.props,
                effectTag: 'UPDATE',
            }
        }
        /**
         * 1. 只有新节点存在 新增操作
         * 2. 新旧节点都存在但节点类型不同；需 删除老节点 + 创建新新节点（*）
         */
        if (elem && !isSameType) {
            newFiber = {
                type: elem.type,
                dom: null,
                alternate: null,
                parent: wipFiber,
                props: elem.props,
                effectTag: 'PLACEMENT'
            }
        }
        /**
         * 1. 只有老节点存在 删除操作
         * 2. 新旧节点都存在但节点类型不同；需 删除老节点（*） + 创建新新节点
         */
        if (oldFiber && !isSameType) {
            oldFiber.effectTag = 'DELETION';
            deletions.push(oldFiber);
        }

        if (oldFiber) oldFiber = oldFiber?.sibling;

        // 第一个子元素挂载到fiber的child属性下
        // 其他子元素以链式挂载到上一个子元素的sibing属性上
        if (index === 0) {
            wipFiber.child = newFiber;
        } else if (newFiber) {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
        index ++;
    }
}

/**
 * 处理当前工作单元，返回下一个工作单元
 * 深度优先
 * @param {*} fiber 工作单元
 */
function performUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
    // 深度优先
    if (fiber.child) return fiber.child;
    // 遍历广度
    let nextFiber = fiber;
    while (nextFiber) {
        // 如果有兄弟节点，返回兄弟节点
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        // 否则返回父节点
        nextFiber = nextFiber.parent;
    }
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