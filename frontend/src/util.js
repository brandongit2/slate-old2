import {hex as wcag} from 'wcag-contrast';

export function kebabToProper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

export function contrasts(color1, color2) {
    return wcag(color1, color2) > 4.5;
}
