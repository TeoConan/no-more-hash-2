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

    // On sépare tous les mots en entré
    const words = input.split(' ');

    // Est-ce que de base, un des mots est interdit ?
    for (const w of words) {
        const cleaned = cleanMessage(w);

        if (cleaned == undefined) continue;

        if (isViolation(cleaned)) {
            // On ajoute en sortie la violation
            output.violate();
            answer.type = AnswerType.Violation;
        } else if (needCorrection(cleaned)) {
            output.add(cleaned);

            if (answer.type != AnswerType.Violation) {
                answer.type = AnswerType.Correction;
            }
        }
    }

    answer.message = output.compute();
    return answer;
}

function cleanMessage(input: string): string {
    let output = input;

    output = convertRegional(output);
    output = replace(output, tchars, 't');
    output = replace(output, hchars, 'h');
    output = replace(output, echars, 'e');
    output = replace(output, ochars, 'o');

    output = replace(output, emptyChars, '');

    for (const s of specialsChars) {
        output = replace(output, [s[0]], s[1]);
    }

    output = cleanRepeat(output);
    output = cleanDoubleRepeat(output);

    return output;
}
