import { printToFile } from './index';

printToFile('testMock', {
    'string|1-10': '★',
    'number|1-100': 1,
    'boolean|1-2': true,
    regexp: '/[a-z][A-Z][0-9]/',
    function: '() => Math.random()',
    'array|1-10': [
        {
            'foo|+1': 6,
            'bar|1-10': '★'
        }
    ],
    items: [1, true, 'hello', '/\\w{10}/'],
    object: {
        'foo|+1': 2,
        'bar|1-10': '★'
    },
    placeholder: '@title'
});
