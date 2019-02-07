export function kebabToProper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}
