import correction from './ressources/output/corrections';
import liaisons from './ressources/output/liaisons';
import violations from './ressources/output/violations';
import tricks from './ressources/output/tricks';
import provocations from './ressources/output/provocations';
import name from './ressources/output/name';
import { Problem, ProblemArray } from './problem';
import Groq from 'groq-sdk';
import aiContext from './ai/context';

const aiClient = new Groq({
    apiKey: process.env['GROQ_API_KEY'], // This is the default and can be omitted
});

const aiModel = process.env['GROQ_API_MODEL'];

/**
 * La classe Output permet de générer un message semi-aléatoire
 * selon les problèmes trouvé dans le message reçu
 */
export class Output {
    // Liste des corrections à afficher dans le message de sortie
    private corrections: Array<string> = [];
    // Liste des problèmes du message
    public problems: ProblemArray;
    private inputMessage: string;

    constructor(problems: ProblemArray, input: string) {
        this.problems = problems;
        this.inputMessage = input;
    }

    /**
     * Générer le message final à envoyer
     * @returns Le message final
     */
    public async compute(): Promise<string> {
        const chatCompletion = await aiClient.chat.completions
            .create({
                messages: [
                    { role: 'system', content: aiContext },
                    {
                        role: 'user',
                        content: this.inputMessage,
                    },
                ],
                model: 'gemma2-9b-it',
            })
            .catch(async (err) => {
                if (err instanceof Groq.APIError) {
                    console.log('‼️ >> ' + this.inputMessage);
                    console.log('‼️ -- ' + err.status);
                    console.log('‼️ -- ' + err.name);
                    console.log('‼️ -- ' + err.headers);
                } else {
                    throw err;
                }
            });

        if (
            chatCompletion &&
            chatCompletion.choices[0].message.content != null
        ) {
            return chatCompletion.choices[0].message.content;
        }

        const lines: Array<string> = [];

        // Afficher ou non un header pour la violation
        if (this.problems.has(Problem.Violation)) {
            lines.push(this.getViolation());
        }

        // Pour chaque correction à traiter
        for (let i = 0; i < this.corrections.length; i++) {
            const item = this.corrections[i];
            // On corrige le texte
            let text = this.getCorrection(item);

            if (lines.length > 0) {
                // On ajoute une liaison de phrase si besoin
                text = [this.getLiaison(), text].join(' ');
            }

            text = this.capitalize(text);

            lines.push(text);
        }

        // Si l'utilisateur tente de trick, on le notifie
        if (this.problems.has(Problem.Trick)) {
            let t = this.getTrick();
            t = lines.length > 0 ? 'Et ' + t : this.capitalize(t);
            lines.push(t);
        }

        // Si l'utilisateur s'appelle "Théo"
        if (this.problems.has(Problem.BadName)) {
            let n = this.getName();
            n = lines.length > 0 ? 'Et aussi, ' + n : this.capitalize(n);
            lines.push(n);
        }

        // Si aucuns problèmes n'ont été trouvé, on peut provoquer
        if (lines.length == 0) {
            if (this.problems.has(Problem.Provocation))
                return this.getProvocation();
            return '';
        }

        return lines.join('\n');
    }

    /**
     * Ajouter une correction à afficher dans le message final
     * @param text Le texte à corriger
     */
    public addCorrection(text: string): void {
        if (this.corrections.indexOf(text) == -1) this.corrections.push(text);
    }

    // Fonctions privées
    private getLiaison(): string {
        return this.randomOf(liaisons);
    }

    private getViolation(): string {
        return this.randomOf(violations);
    }

    private getTrick(): string {
        return this.randomOf(tricks);
    }

    private getProvocation(): string {
        return this.randomOf(provocations);
    }

    private getName(): string {
        return this.randomOf(name);
    }

    private getCorrection(text: string): string {
        const c = this.randomOf(correction);
        return c.replace('$1', text.replace('theo', 'teo'));
    }

    // Utilitaires
    private capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    private randomOf(arr: Array<string>): string {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
