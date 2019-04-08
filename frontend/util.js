import Color from 'color';

export function rgb(arr) {
    return `${arr.length === 3 ? 'rgb' : 'rgba'}(${arr.join(', ')})`;
}

export function isTitleLight(color) {
    return color.contrast(Color('white')) < 3;
}

export function isTitleDark(color) {
    return color.contrast(Color('black')) < 3;
}

export function isHexColour(string) {
    if (/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.exec(string)) {
        return true;
    }
    return false;
}
