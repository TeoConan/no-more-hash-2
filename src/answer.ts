/**
 * Classe Answer, permet de transférer des informations
 * après traitement du texte, comme par le message, le type
 * de réponse à envoyer etc
 */
export class Answer {
    public time: Date;
    public input: string;
    public message: string;
    private type: AnswerType;

    constructor(input: string) {
        this.input = input;
        this.time = new Date();
        this.type = AnswerType.None;
    }

    public getType(): AnswerType {
        return this.type;
    }

    /**
     * Permet de définir un niveau supérieur de AnswerType
     * @param type AnswerType
     */
    public setType(type: AnswerType) {
        if (type > this.type) this.type = type;
    }
}

/**
 * Les différentes types de réponse possible
 */
export enum AnswerType {
    None, // Aucuns soucis détecté
    Provocation, // Le bot à été ping, on pourrait le provoquer en retour
    Correction, // Une ou plusieurs mots on besoin d'une correction
    Violation, // Le message contient un "théo"
    Trick, // L'utilisateur à essayer de cacher un "théo"
}
