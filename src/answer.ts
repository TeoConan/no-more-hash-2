export class Answer {
    public from: string;
    public time: Date;
    public input: string;
    public message: string;
    public type: AnswerType;

    constructor(input: string, from: string) {
        this.input = input;
        this.time = new Date();
        this.from = from;
        this.type = AnswerType.None;
    }
}

export enum AnswerType {
    None,
    Violation,
    Correction,
    Trick,
    Provocation,
}
