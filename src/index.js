
import React from '../react';

const element = (
    <section>
        <h1 title="foo" className='app'>
            <span>Hello</span>
            <span>Hello2</span>
            dsa
        </h1>
        <a href="">测试链接</a>
        <span>Hello</span>
        <span>Hello2</span>
    </section>
);
console.log('element: ', element);

const container = document.querySelector('.root');
React.render(element, container);