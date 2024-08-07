import main from '../src';
import { Problem } from '../src/problem';
import negatives from './lists/negatives';
import provocations from './lists/provocations';
import tricks from './lists/tricks';
import violations from './lists/violations';
import correction from './lists/correction';
import badNames from './lists/bad-names';

function truncate(str: string): string {
    return str.length > 32 ? str.slice(0, 29) + '...' : str;
}

describe('Testing negatives matches', () => {
    for (const n of negatives) {
        test(`👍 : ${truncate(n)}`, () => {
            expect(main(n, '').problems.getWorst()).toBe(null);
        });
    }
});

describe('Testing provocations', () => {
    for (const p of provocations) {
        test(`🤓 : ${truncate(p)}`, () => {
            expect(main(p, '').problems.getWorst()).toBe(Problem.Provocation);
        });
    }
});

describe('Testing tricks', () => {
    for (const t of tricks) {
        test(`🤡 : ${truncate(t)}`, () => {
            expect(main(t, '').problems.getWorst()).toBe(Problem.Trick);
        });
    }
});

describe('Testing violations', () => {
    for (const v of violations) {
        test(`😡 : ${truncate(v)}`, () => {
            expect(main(v, '').problems.getWorst()).toBe(Problem.Violation);
        });
    }
});

describe('Testing corrections', () => {
    for (const c of correction) {
        test(`😑 : ${truncate(c)}`, () => {
            expect(main(c, '').problems.getWorst()).toBe(Problem.Correction);
        });
    }
});

describe('Testing bad names', () => {
    for (const b of badNames) {
        test(`😡 : ${truncate(b)}`, () => {
            expect(main('', b).problems.getWorst()).toBe(Problem.BadName);
        });
    }
});
