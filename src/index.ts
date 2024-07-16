import { Output } from './output';
import { Answer, AnswerType } from './answer';
import {
    cleanDoubleRepeat,
    cleanRepeat,
    convertRegional,
    isViolation,
    needCorrection,
    replace,
} from './functions';

import tchars from './ressources/t-chars';
import hchars from './ressources/h-chars';
import echars from './ressources/e-chars';
import ochars from './ressources/o-chars';
import emptyChars from './ressources/empty-chars';
import specialsChars from './ressources/specials-chars';

export default function main(input: string, from: string = ''): Answer {
    const answer = new Answer(input, from);
    const output = new Output();
    const cleanedWords: string[] = [];
    const urlRegex = new RegExp(/^http(|s):\/\//);

    // On sépare tous les mots en entré
    const words = input.split(' ');

    for (let i = 0; i < words.length; i++) {
        // Si le mot est une url, on skip
        if (urlRegex.test(words[i])) continue;

        const cleaned = cleanMessage(words[i]);
        cleanedWords.push(cleaned);
        if (cleaned == undefined || cleaned.length < 4) continue;

        const type = validate(cleaned);

        switch (type) {
            case AnswerType.Violation:
                output.violate();
                answer.type = type;
                break;

            case AnswerType.Correction:
                output.add(cleaned);
                if (answer.type != AnswerType.Violation) {
                    answer.type = AnswerType.Correction;
                }
                break;

            case AnswerType.None:
                if (
                    answer.type != AnswerType.Violation &&
                    answer.type != AnswerType.Correction
                ) {
                    answer.type = type;
                }
                break;
        }
    }

    if (findSuspectsWords(cleanedWords) == AnswerType.Trick) {
        output.trick();
        answer.type = AnswerType.Trick;
    }

    answer.message = output.compute();
    return answer;
}

function cleanMessage(input: string): string {
    let output = input.toLowerCase();

    for (const s of specialsChars) {
        output = replace(output, [s[0]], s[1]);
    }

    output = convertRegional(output);
    output = replace(output, tchars, 't');
    output = replace(output, hchars, 'h');
    output = replace(output, echars, 'e');
    output = replace(output, ochars, 'o');

    output = replace(output, emptyChars, '');

    output = cleanRepeat(output);
    output = cleanDoubleRepeat(output);

    return output;
}

function validate(input: string): AnswerType {
    if (isViolation(input)) return AnswerType.Violation;
    if (needCorrection(input)) return AnswerType.Correction;
    return AnswerType.None;
}

function findSuspectsWords(input: string[]): AnswerType {
    let merge = '';

    for (let i = 0; i < input.length; i++) {
        const w = input[i];
        merge += w;

        if (w == undefined || merge == w) continue;

        if (merge.length > 4) {
            if (i != 0) i--;
            merge = '';
            continue;
        }

        if (merge.length == 4) {
            if (validate(merge) == AnswerType.Violation)
                return AnswerType.Trick;
        }
    }

    return AnswerType.None;
}
