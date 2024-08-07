import violations from './ressources/violations';

/**
 * Détermine si l'input est un texte interdit
 * @param input Texte à vérifier
 * @returns Est-ce que l'input est un mot de violation
 */
export function isViolation(input: string): boolean {
    if (input == undefined) return false;
    for (const v of violations) if (input.toLowerCase() == v) return true;
    return false;
}

/**
 * Détermine si l'input contient un texte interdit
 * @param input Texte à vérifier
 * @returns Est-ce que l'input contient un mot de violation
 */
export function needCorrection(input: string): boolean {
    return input.toLowerCase().indexOf('theo') > -1;
}

/**
 * Replace a list of char by another in a text
 * @param text Your initial text
 * @param arr Array of chars to find
 * @param by Char to replace
 * @returns Modified text
 */
export function replace(text: string, arr: Array<any>, by: string): string {
    if (text == undefined || text == '') return text;
    for (const r of arr) {
        while (text.indexOf(r) != -1) text = text.replace(r, by);
    }
    return text;
}

/**
 * Remove all repeated letters in a text (ex: "aazzeerr" -> "azer")
 * @param text Text to analyse & clean
 * @returns Cleaned text
 */
export function cleanRepeat(text: string): string {
    let clean = '';
    for (let i = 0; i < text.length; i++) {
        if (i === 0 || text[i] !== text[i - 1]) {
            clean += text[i];
        }
    }

    return clean;
}

/**
 * Remove all double letters repeatitions (ex: "ahahahahah" -> "ah")
 * @param text Text to analyse & clean
 * @returns Cleaned text
 */
export function cleanDoubleRepeat(text: string): string {
    let clean = text[0];
    let last2Chars = new String('');
    let current2Chars = new String('');

    for (let i = 1; i < text.length; i += 2) {
        current2Chars = text.slice(i, i + 2);
        if (current2Chars != last2Chars) {
            clean += current2Chars;
            last2Chars = current2Chars;
        }
    }

    return clean;
}

/**
 * Find & replace regional letters from Discord
 * @param text Text to analyse & clean
 * @returns Cleaned text
 */
export function convertRegional(text: string): string {
    const regional = new RegExp('(:regional_indicator_([a-z]):)', 'gmi');
    text = text.replace(regional, '$2');
    return text;
}
