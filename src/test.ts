// Configuration du fichier .env
require('dotenv').config();

import { AnswerType } from './answer';
import main from './index';
import tests from './ressources/tests';

const debug: boolean = process.env.DEBUG?.toLowerCase().trim() == 'true';

// Initialiser un tableau pour compter les résultats attendu
const expected: number[] = Array(Object.keys(AnswerType).length / 2).fill(0);
// Initialiser un tableau pour compter les résultats réalisé
const result: number[] = Array(Object.keys(AnswerType).length / 2).fill(0);

// On compte les différents types de tests qui doivent être réalisé
//@ts-ignore
for (let i = 0; i < tests.length; i++) expected[tests[i][1]] += 1;
// On compte le total de tests à réaliser
const expectedTotal = expected.reduce((acc, v) => acc + v, 0);

/**
 * Lancer tous les tests disponibles dans tests.ts
 */
function runTests() {
    for (const t of tests) {
        // Pour le debug
        //@ts-ignore
        if (debug && t[1] == -1) break;

        // On traite le test
        const answer = main(t[0].toString());

        // On comptabilise le résultat du test
        if (answer.getType() == t[1]) {
            result[t[1]] += 1;
        }

        // Afficher ou non les résultats des tests
        if (!debug || answer.getType() != t[1]) {
            console.log('(' + answerTypeAsLetter(t[1]) + ') > ' + t[0]);

            console.log(
                '(' +
                    answerTypeAsLetter(answer.getType()) +
                    ') : "' +
                    answer.message +
                    '"'
            );
            console.log('');
        }
    }
}

/**
 * Transformer un AnswerType en sa première lettre pour l'affichage des tests
 * @param type AnswerType a transformer en lettre
 * @returns Première lettre de l'AnswerType
 * TODO improve
 */
function answerTypeAsLetter(type: AnswerType | string | number): string {
    switch (type) {
        case AnswerType.None:
            return 'N';

        case AnswerType.Correction:
            return 'C';

        case AnswerType.Violation:
            return 'V';

        case AnswerType.Provocation:
            return 'P';

        case AnswerType.Trick:
            return 'T';
    }

    return '?';
}

runTests();

console.log('End');
const resultTotal = result.reduce((acc, v) => acc + v, 0);

console.log(`Total : ${resultTotal}/${expectedTotal}`);
