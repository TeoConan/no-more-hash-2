import { AnswerType } from './answer';
import main from './index';
import tests from './ressources/tests';

for (const t of tests) {
    if (t[1] == -1) break;

    const answer = main(t[0].toString());

    console.log(' > ' + t[0]);

    if (answer.type == AnswerType.None) {
        console.log('(No answer)');
    } else {
        console.log(answer.message);
    }

    console.log('');
}
