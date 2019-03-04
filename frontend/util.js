import {hex as wcag} from 'wcag-contrast';

// Returns true if `color1` contrasts well against `color2`.
export function contrasts(color1, color2) {
    if (!(color1 && color2)) return undefined;
    return wcag(color1, color2) > 4.5;
}
