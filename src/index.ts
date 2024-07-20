// Configuration du fichier .env
require('dotenv').config();

import { Output } from './output';
import { Answer } from './answer';
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
import { Problem, ProblemArray } from './problem';

/**
 * Traitement principal du message reçu
 * @param input Message à traiter en entré
 * @param from Auteur du message
 * @returns Problem
 */
export default function main(input: string, from: string): Answer {
    // Liste des mots qui seront re-traiter après
    const urlRegex = new RegExp(/^http(|s):\/\//);
    // Est-ce que le message mentionne le bot ?
    const pinged = input.indexOf(`<@${process.env.APP_ID}>`) != -1;
    const safeWords: string[] = [];

    const problems: ProblemArray = new ProblemArray();

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

        if (type != null) {
            // Notifier le message de sortie qu'un problem à été trouvée
            problems.add(type);
        } else {
            // Le mot ne correspond à rien, il peut être suspect et sera analysé après
            safeWords.push(cleaned);
        }
    }

    // L'utilisateur à ping le bot, on va donc prendre ça comme une provocation
    if (pinged) problems.add(Problem.Provocation);

    // Pour tous les mots qui sont safe, on les assemblent pour vérifier si
    // l'utilisateur n'essaie pas de trick le programme
    if (findSuspectsWords(safeWords) == Problem.Trick)
        problems.add(Problem.Trick);

    // Vérification du nom de l'utilisateur
    problems.add(checkUsername(from));

    // Réponse à renvoyer
    const answer = new Answer(input, problems);
    // Message à renvoyer
    const output = new Output(problems);

    // On génère le message
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
 * @returns Problem
 */
function validate(input: string): Problem | null {
    if (isViolation(input)) return Problem.Violation;
    if (needCorrection(input)) return Problem.Correction;
    return null;
}

/**
 * Vérifier si le username ne pose de problèmes
 * @param name Display name de l'expéditeur Discord
 * @returns
 */
function checkUsername(name: string): Problem | null {
    const words = name.split(' ').map((e) => cleanMessage(e));
    if (findSuspectsWords(words) != null) return Problem.BadName;
    return null;
}

/**
 * Fusionne les mots "suspects" à savoir trop court et sans problème
 * pour essayer de trouver une combinaison qui pourrait amener à un "theo"
 * @param input Liste des mots "safe"
 * @returns Problem
 */
function findSuspectsWords(input: string[]): Problem | null {
    let merge = '';

    // Pour chaque mot
    for (let i = 0; i < input.length; i++) {
        let w = input[i];

        // On remplace tous les "specials chars"
        for (const s of specialsChars) {
            w = replace(w, [s[0]], s[1]);
        }

        // On merge le mot courant avec le précedent
        merge += w;

        // Si le mot fait pile la longueur de "theo" on le vérifie
        //* Les répétitions on déjà été nettoyée précedement
        if (merge.length == 4) {
            // La violation était "cachée" entre plusieurs mots
            if (validate(merge) == Problem.Violation) return Problem.Trick;
        }

        if (w == undefined || merge == w) continue;

        // Si le merge est plus grand que "theo", alors pas d'inquiètude,
        // On reset le merge, on recule dans la boucle et on continue les fusions
        if (merge.length > 4) {
            if (i != 0) i--;
            merge = '';
            continue;
        }
    }

    return null;
}
