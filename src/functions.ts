import violations from './ressources/violations';

/**
 * Détermine si l'input est un texte interdit
 * @param input Texte à vérifier
 * @returns Est-ce que l'input est un mot de violation
 */
export function isViolation(input: string): boolean {
    for (const v of violations) {
        if (input != undefined && input.toLowerCase() == v) return true;
    }

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
    for (var r of arr) text = text.replace(r, by);
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
        // TODO For debug
        //current2Chars = print2Chars(text, i);

        if (current2Chars != last2Chars) {
            clean += current2Chars;
            last2Chars = current2Chars;
        }
    }

    return clean;
}

// TODO for debug
function print2Chars(msg: string, i: number) {
    const chars = msg.slice(i, i + 2);
    const before = msg.slice(0, i);
    const after = msg.slice(i + 2, msg.length);
    //console.log(`${before}|${chars}|${after}`);
    return chars;
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
