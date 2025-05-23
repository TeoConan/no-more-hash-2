import { Problem, ProblemArray } from './problem';
import Groq from 'groq-sdk';
import aiContext from './ai/context';

const aiClient = process.env['GROQ_API_KEY']
    ? new Groq({
          apiKey: process.env['GROQ_API_KEY'], // This is the default and can be omitted
      })
    : false;

const aiModel:
    | (string & {})
    | 'gemma2-9b-it'
    | 'llama-3.3-70b-versatile'
    | 'llama-3.1-8b-instant'
    | 'llama-guard-3-8b'
    | 'llama3-70b-8192'
    | 'llama3-8b-8192' = process.env['GROQ_API_MODEL'] ?? 'gemma2-9b-it';

/**
 * Classe Answer, permet de transférer des informations
 * après traitement du texte, comme par le message, le type
 * de réponse à envoyer etc
 */
export class Answer {
    public time: Date;
    public input: string;
    public from: string;
    private message: string | null = null;
    public problems: ProblemArray;

    constructor(from: string, input: string, problems: ProblemArray) {
        this.from = from;
        this.input = input;
        this.time = new Date();
        this.problems = problems;
    }

    /**
     * S'il y a vraiment besoin de répondre au message
     * @returns
     */
    public needAnswer(): boolean {
        return this.problems.getWorst() != null;
    }

    public getReaction(): string | false {
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

            default:
                return false;
        }
    }

    /**
     * Obtenir le contexte de l'IA modifié pour le message
     * @returns
     */
    public getCustomAIContext(): string {
        switch (this.problems.getWorst()) {
            case Problem.Provocation:
                return `L'utilisateur t'a ping dans son message, ce qui t'agace car tu es solicité inutilement`;

            case Problem.Correction:
                return `L'utilisateur à utilisé un mot contenant "théo" mais qui existe.
                Comme "théorème" par exemple. Rien de grave mais ça t'agace.`;

            case Problem.Violation:
                return `L'utilisateur à écris "Théo" avec un H, tu va devoir l'insulter.`;

            case Problem.Trick:
                return `L'utilisateur à essayé de dissimuler un "Théo" dans son message, mais tu l'as repéré.`;

            case Problem.BadName:
                return `L'utilisateur à un "Théo" avec un h dans son prénom`;

            default:
                return '';
        }
    }

    public async getMessage(): Promise<string> {
        if (this.message != null) return this.message;
        if (process.env['TESTING'] == '1')
            return '(testing mode enabled) no ai message';

        if (aiClient == false) {
            return '(📵) ' + this.getSpareMessage();
        }

        const chatCompletion = await aiClient.chat.completions
            .create({
                messages: [
                    {
                        role: 'system',
                        content: aiContext + '\n' + this.getCustomAIContext(),
                    },
                    {
                        role: 'user',
                        content: `${this.from}: "${this.input}"`,
                    },
                ],
                model: aiModel,
            })
            .catch(async (err) => {
                if (err instanceof Groq.APIError) {
                    console.log('‼️ >> ' + this.input);
                    console.log('‼️ -- ' + err.status);
                    console.log('‼️ -- ' + err.name);
                    console.log('‼️ -- ' + err.headers);
                } else {
                    console.log('‼️‼️‼️');
                    console.log(err);
                    console.log('‼️‼️‼️');
                }

                this.message = '(❌) ' + this.getSpareMessage();
            });

        if (
            chatCompletion &&
            chatCompletion.choices[0].message.content != null
        ) {
            this.message = chatCompletion.choices[0].message.content;
            return this.message;
        } else {
            console.log('‼️ >> ' + this.input);
            console.log('‼️ -- Empty or malformed response object');
            console.log(chatCompletion);
            console.log('‼️‼️‼️');
            this.message = '(⁉️) ' + this.getSpareMessage();
            return this.message;
        }
    }

    public getSpareMessage(): string {
        return this.randomOf([
            'Ton message me clc tellement fort que même mon AI est HS',
            "*bruit de windows qui s'éteint*",
            'Bip bop bip bop *bzzzzzz* **PAF**',
            '💀',
            '😵',
            '😶‍🌫️',
            '😵‍💫',
        ]);
    }

    private randomOf(arr: Array<string>): string {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
