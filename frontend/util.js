export function rgb(arr) {
    return `${arr.length === 3 ? 'rgb' : 'rgba'}(${arr.join(', ')})`;
}
