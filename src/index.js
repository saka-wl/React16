
import React from '../react';

// const element = (
//     <section>
//         <h1 title="foo" className='app'>
//             <span>Hello</span>
//             <span>Hello2</span>
//             dsa
//         </h1>
//         <a href="">测试链接</a>
//         <span>Hello</span>
//         <span>Hello2</span>
//     </section>
// );
// console.log('element: ', element);

// const container = document.querySelector('.root');
// React.render(element, container);



const container = document.querySelector('.root');

// const updateValue = (e) => {
//   console.log('input event', e);
//   rerender(e.target.value);
// };

// const rerender = (value) => {
//   const element = (
//     <div>
//       <input onInput={updateValue} value={value} />
//       <h2>Hello {value}</h2>
//     </div>
//   );
//   React.render(element, container);
// };

// rerender('World');




// function App(props) {
//   const a = 1;
//   return <h1>H1,{props.name}!{a}</h1>;
// }

// const element = <App name="foo"></App>;
// console.log('Function Component: ', element);
// console.log('Function Component type: ', element.type);
// const element_normal = <h1>H1,saka!</h1>;
// console.log('Normal Component: ', element_normal);

// React.render(element, container);




function Counter() {
  const [state, setState] = React.useState(1);
  const [state2, setState2] = React.useState(2);
  function onClickHandle(params) {
    setState((state) => state + 1);
    setState((state) => state + 2);
  }
  return (
    <div>
      <h1>Count: {state}</h1>
      <button onClick={onClickHandle}>+Add</button>
      <hr />
      <h1>Count2: {state2}</h1>
      <button onClick={() => setState2((state) => state + 1)}>+1</button>
      <button onClick={() => setState2((state) => state + 2)}>+2</button>
    </div>
  );
}
const element = <Counter />;

React.render(element, container);