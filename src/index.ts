import violations from './ressources/violations';
import { Output } from './output';

export default function main(input: string): string {
    const output = new Output();

    // On sépare tous les mots en entré
    const words = input.split(' ');

    // Est-ce que de base, un des mots est interdit ?
    for (const w in words) {
        if (isViolation(w)) {
            // On ajoute en sortie la violation
            output.violate();
        }

        if (needCorrection(w)) {
            output.add(w);
        }
    }

    return output.compute();
}

/**
 * Détermine si l'input est un texte interdit
 * @param input Texte à vérifier
 * @returns Est-ce que l'input est un mot de violation
 */
function isViolation(input: string): boolean {
    for (const v in violations) {
        if (input.toLowerCase() == v) return true;
    }

    return false;
}

/**
 * Détermine si l'input contient un texte interdit
 * @param input Texte à vérifier
 * @returns Est-ce que l'input contient un mot de violation
 */
function needCorrection(input: string): boolean {
    return input.toLowerCase().indexOf('theo') > -1;
}

// On suppr tous les espace
// On clean tout les charactère
// Est-ce qu'on trouve théo ?

// On clean les répétition simple & double
// Est-ce qu'un trouve théo ?

// Si oui on isole chaque mot

/*

Pour "t h e o"


*/
