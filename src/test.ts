import { AnswerType } from './answer';
import main from './index';
import tests from './ressources/tests';

// Initialiser un tableau pour compter les résultats attendu
const expected: number[] = Array(Object.keys(AnswerType).length / 2).fill(0);
// Initialiser un tableau pour compter les résultats réalisé
const result: number[] = Array(Object.keys(AnswerType).length / 2).fill(0);

// On compte les différents types de tests qui doivent être réalisé
for (let i = 0; i < tests.length; i++) expected[tests[i][1]] += 1;
// On compte le total de tests à réaliser
const expectedTotal = expected.reduce((acc, v) => acc + v, 0);

function runTests() {
    for (const t of tests) {
        //* debug
        //if (t[1] == -1) break;

        // On traite le test
        const answer = main(t[0].toString());

        // On comptabilise le résultat du test
        if (answer.type == t[1]) {
            result[t[1]] += 1;
        } else {
            console.log('(' + answerTypeAsLetter(t[1]) + ') > ' + t[0]);

            console.log(
                '(' +
                    answerTypeAsLetter(answer.type) +
                    ') : "' +
                    answer.message +
                    '"'
            );
            console.log('');
        }
    }
}

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
