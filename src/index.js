
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




function App(props) {
  return <h1>H1,{props.name}!</h1>;
}

const element = <App name="foo"></App>;

React.render(element, container);