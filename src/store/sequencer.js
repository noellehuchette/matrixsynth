const notes = [
    'D5',
    'C4',
    'A4',
    'G4',
    'F4',
    'D4',
    'C3',
    'A3',
    'G3',
    'F3',
    'D3',
    'C2',
    'A2',
    'G2',
    'F2',
    'D2',
];

const initPattern = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const initState = {
    pattern: initPattern,
    init: false,
};

const INIT = 'INIT';
const TOGGLE_SQUARE = 'TOGGLE_SQUARE';
const CLEAR_PATTERN = 'CLEAR_PATTERN';

export const init = () => ({
    type: INIT,
});

export const toggleSquare = (x, y) => ({
    type: TOGGLE_SQUARE,
    x,
    y
});

export const clearPattern = () => ({
    type: CLEAR_PATTERN,
});

export default function (state = {}, action) {
    let updState = {...state};
    let updPattern = [...state.pattern];
    for(let row in state.pattern) {
        for(let col in row) {
            updPattern[row][col] = state.pattern[row][col];
        }
    }
    updState.pattern = updPattern;
    switch(action.type) {
        case INIT:
            updState.init = true;
            return updState;
        case TOGGLE_SQUARE:
            const {x, y} = action;
            updState.pattern[y][x] = !updState.pattern[y][x];
            return updState;
        case CLEAR_PATTERN:
            updState.pattern = initPattern;
            return updState;
        default:
            return state;
    }
}