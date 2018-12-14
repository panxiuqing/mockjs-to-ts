import * as fs from 'fs';
import * as prettier from 'prettier';

interface ParsedEntry {
    key: string;
    rule: string;
    value: any;
}

export function printToFile(name: string, mockjsObj: object) {
    let content = convert(mockjsObj);

    return fs.writeFileSync(
        `${name}.ts`,
        prettier.format(
            `interface StringIndex<T> {
        [index: string]: T;
    }
    interface ${name} ${content}`,
            { parser: 'typescript', singleQuote: true, tabWidth: 4 }
        )
    );
}

export function convert(mockjsObj: object) {
    let parsed = parse(mockjsObj);
    let result = parsed.map(dispatch);
    let content = generate(result);

    return content;
}

function parse(mockjsObj: object): ParsedEntry[] {
    let parsed = [];
    for (let rawKey in mockjsObj) {
        let value = mockjsObj[rawKey];
        let [key, rule] = rawKey.split('|');
        parsed.push({
            key,
            rule,
            value
        });
    }
    return parsed;
}

function dispatch(entry: ParsedEntry) {
    let result = {
        key: entry.key,
        type: 'string'
    };
    let type = typeof entry.value;
    result.type = type; // string | number | boolean | function
    switch (type) {
        case 'object': {
            if (entry.value instanceof Array) {
                if (!entry.value.length) {
                    result.type = 'Array<any>';
                    break;
                }

                let item = entry.value[0];
                let itemType = typeof item as string;
                let finalType = itemType;

                let toElement = entry.rule === '1' || entry.rule === '+1'; // generate value is item of array

                if (itemType === 'object') {
                    let parsed = parse(item);
                    finalType = generate(parsed.map(dispatch));
                }
                result.type = toElement ? finalType : `Array<${finalType}>`;
                break;
            }

            // RegExp generate string
            if (entry.value instanceof RegExp) {
                result.type = 'string';
                break;
            }

            // string index
            if (entry.rule && entry.rule.match(/^[0-9]+(-[0-9]+)?$/)) {
                let parsed = parse(entry.value);
                let value = parsed[0].value; // assume has same value type
                result.type = `StringIndex<${generate(
                    parse(value).map(dispatch)
                )}>`;
                break;
            }

            // normal object
            let parsed = parse(entry.value);
            result.type = generate(parsed.map(dispatch));
            break;
        }
        default:
            break;
    }

    return result;
}

function generate(result: Array<any>) {
    let content = `{
    ${result
        .map(item => {
            return item.key + ': ' + item.type + ';';
        })
        .join('\n    ')}
}
`;
    return content;
}
