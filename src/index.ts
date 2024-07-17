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

/**
 * Traitement principal du message reçu
 * @param input Message à traiter en entré
 * @param from Auteur du message
 * @returns AnswerType
 */
export default function main(input: string, from: string = ''): Answer {
    const answer = new Answer(input, from);
    const output = new Output();
    const safeWords: string[] = [];
    const urlRegex = new RegExp(/^http(|s):\/\//);

    // On sépare tous les mots en entré
    const words = input.split(' ');

    // Pour chaque mots du message
    for (let i = 0; i < words.length; i++) {
        // Si le mot est une url, on skip
        if (urlRegex.test(words[i])) continue;

        // On nettoie le message
        const cleaned = cleanMessage(words[i]);
        if (cleaned == undefined) continue;

        // On regarde si le mot à besoin d'une correction ou renvoie une violation
        const type = validate(cleaned);

        switch (type) {
            case AnswerType.Violation:
                // Notifier le message de sortie qu'une violation à été trouvée
                output.violate();
                answer.type = type;
                break;

            case AnswerType.Correction:
                // Ajouter le mot à corriger dans le message de sortie
                output.add(cleaned);
                //* todo, improve
                if (answer.type != AnswerType.Violation) {
                    answer.type = AnswerType.Correction;
                }
                break;

            case AnswerType.None:
                // Le mot ne correspond à rien, il peut être suspect et sera analysé après
                //* todo, improve
                if (
                    answer.type != AnswerType.Violation &&
                    answer.type != AnswerType.Correction
                ) {
                    answer.type = type;
                }
                safeWords.push(cleaned);
                break;
        }
    }

    // Pour tous les mots qui sont safe, on les assemblent pour vérifier si
    // l'utilisateur n'essaie pas de trick le programme
    if (findSuspectsWords(safeWords) == AnswerType.Trick) {
        output.trick();
        answer.type = AnswerType.Trick;
    }

    answer.message = output.compute();
    return answer;
}

/**
 * Remplacer les lettres par d'autre pour faire correspondre une violation
 * @param input Le mot à nettoyer
 * @returns Le mot nettoyé
 */
function cleanMessage(input: string): string {
    let output = input.toLowerCase();

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

/**
 * Vérifier si un mot à besoin d'une correction ou est une violation
 * @param input Le mot à vérifier
 * @returns AnswerType
 */
function validate(input: string): AnswerType {
    if (isViolation(input)) return AnswerType.Violation;
    if (needCorrection(input)) return AnswerType.Correction;
    return AnswerType.None;
}

function findSuspectsWords(input: string[]): AnswerType {
    let merge = '';

    for (let i = 0; i < input.length; i++) {
        let w = input[i];

        for (const s of specialsChars) {
            w = replace(w, [s[0]], s[1]);
        }

        merge += w;

        if (merge.length == 4) {
            if (validate(merge) == AnswerType.Violation)
                return AnswerType.Trick;
        }

        if (w == undefined || merge == w) continue;

        if (merge.length > 4) {
            if (i != 0) i--;
            merge = '';
            continue;
        }
    }

    return AnswerType.None;
}
