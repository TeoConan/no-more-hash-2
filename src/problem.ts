/**
 * Permet de gérer une liste de problèmes dans un message en prenant en compte le plus important
 */
export class ProblemArray {
    private items: Array<Problem> = [];

    /**
     * Ajouter un nouveau problem pour un message
     * @param problem Problem
     */
    public add(problem: Problem | null) {
        if (problem == null) return;
        if (!this.has(problem)) this.items.push(problem);
    }

    /**
     * Vérifier si le message contient un certain type
     * @param type Type a rechercher
     * @returns
     */
    public has(problem: Problem): boolean {
        return this.items.indexOf(problem) != -1;
    }

    /**
     * Obtenir le problème le plus "grave" de la liste
     * @returns Le problème le plus "grave"
     */
    public getWorst(): Problem | null {
        if (this.items.length == 0) return null;

        return this.items.reduce((acc, value) => {
            return Math.max(acc, value);
        }, this.items[0]);
    }
}

/**
 * Les différents problèmes possible dans un message
 */
export enum Problem {
    Provocation, // Le bot à été ping, on pourrait le provoquer en retour
    Correction, // Une ou plusieurs mots on besoin d'une correction
    Violation, // Le message contient un "théo"
    Trick, // L'utilisateur à essayer de cacher un "théo"
    BadName, // L'expéditeur s'appelle "Théo"
}
