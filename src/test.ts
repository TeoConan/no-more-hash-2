// Configuration du fichier .env
require('dotenv').config();

import main from './index';
import { Problem } from './problem';
import tests from './ressources/tests';

const debug: boolean = process.env.DEBUG?.toLowerCase().trim() == 'true';
let successOutput = 0;

/**
 * Lancer tous les tests disponibles dans tests.ts
 */
function runTests() {
    for (const t of tests) {
        const input: string = t[0]?.toString() ?? '';
        const expected: string = problemAsLetter(t[1]);

        // Pour le debug
        //@ts-ignore
        if (debug && t[1] == -1) break;

        // On traite le test
        const answer = main(input, '');
        const output = problemAsLetter(answer.problems.getWorst());

        // On comptabilise le résultat du test
        if (expected == output) successOutput++;

        // Afficher ou non les résultats des tests
        if (!debug || expected == output) {
            console.log('(' + expected + ') > ' + input);
            console.log('(' + output + ') : "' + answer.message + '"');
            console.log('');
        }
    }
}

/**
 * Transformer un Problem en sa première lettre pour l'affichage des tests
 * @param type Problem a transformer en lettre
 * @returns Première lettre de l'Problem
 */
function problemAsLetter(type: Problem | string | number | null): string {
    if (type == null) return 'N';

    switch (type) {
        default:
            return '?';

        case Problem.Correction:
            return 'C';

        case Problem.Violation:
            return 'V';

        case Problem.Provocation:
            return 'P';

        case Problem.Trick:
            return 'T';

        case Problem.BadName:
            return 'B';
    }
}

runTests();

console.log('End');
console.log(`Total : ${successOutput}/${tests.length}`);
