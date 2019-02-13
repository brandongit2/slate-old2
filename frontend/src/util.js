import {hex as wcag} from 'wcag-contrast';

// Converts kebab-case to proper strings.
// e.g. 'this-is-a-name' -> 'This is a name'
export function kebabToProper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

// Returns true if `color1` contrasts well against `color2`.
export function contrasts(color1, color2) {
    return wcag(color1, color2) > 4.5;
}
