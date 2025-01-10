// 指向当前state的下标
let stateIndex = 0;
// 存储state数据的数组
const globalState = [];
// 订阅的数组
const globalSubscribers = [];

/**
 * 
 * @param {*} initValue 原始值
 * @returns 
 * 0 - state值的快照
 * 1 - setSatet函数
 * 2 - 订阅函数
 */
function useState(initValue) {
    const currentIndex = stateIndex;
    stateIndex ++;
    /**
     * 第一次初始化时
     */
    if(!(currentIndex in globalState)) {
        globalState[currentIndex] = initValue;
        globalSubscribers[currentIndex] = [];
    }

    const setState = (newValue) => {
        if(newValue instanceof Function){
            globalState[currentIndex] = newValue(globalState[currentIndex]);
        } else {
            globalState[currentIndex] = newValue;
        }
        // 触发订阅
        globalSubscribers[currentIndex].forEach((item) => {
            if(!item || !(item instanceof Function)) return;
            item(newValue);
        });
    }

    const subscribe = (callback) => {
        const currentSubscribeIndex = globalSubscribers[currentIndex].length;
        if(callback instanceof Function) {
            globalSubscribers[currentIndex][currentSubscribeIndex] = callback;
            return () => (globalSubscribers[currentIndex][currentSubscribeIndex] = null);
        }
    }
    return [globalState[currentIndex], setState, subscribe];
}

const [count1, setCount1, subscribeCount1] = useState(0);

subscribeCount1((newVal) => {
    console.log('count1: ', newVal)
})

console.log(count1);
setCount1(1);

const [count2, setCount2, subscribeCount2] = useState(0);

const cancle = subscribeCount2((newVal) => {
    console.log('count2: ', newVal)
})

// cancle();
setCount2(2);
console.log(count2);
