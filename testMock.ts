interface StringIndex<T> {
    [index: string]: T;
}
interface testMock {
    string: string;
    number: number;
    boolean: boolean;
    regexp: string;
    function: string;
    array: Array<{
        foo: number;
        bar: string;
    }>;
    items: Array<number>;
    object: {
        foo: number;
        bar: string;
    };
    placeholder: string;
}
