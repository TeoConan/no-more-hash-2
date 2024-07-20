import { Problem, ProblemArray } from './problem';

/**
 * Classe Answer, permet de transférer des informations
 * après traitement du texte, comme par le message, le type
 * de réponse à envoyer etc
 */
export class Answer {
    public time: Date;
    public input: string;
    public message: string;
    public problems: ProblemArray;

    constructor(input: string, problems: ProblemArray) {
        this.input = input;
        this.time = new Date();
        this.problems = problems;
    }

    public getReaction(): string {
        // On traite la réponse et on emet une réaction si besoin
        switch (this.problems.getWorst()) {
            case Problem.Provocation:
                return '🤓';

            case Problem.Correction:
                return '😑';

            case Problem.Violation:
                return '😡';

            case Problem.Trick:
                return '🤡';

            case Problem.BadName:
                return '💩';
        }
    }
}
