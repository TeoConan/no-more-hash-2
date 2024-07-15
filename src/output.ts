import correction from './ressources/output/corrections';
import liaisons from './ressources/output/liaisons';
import violations from './ressources/output/violations';

export class Output {
    private items: Array<string> = [];
    private hasViolation: boolean = false;

    public compute(): string {
        const lines: Array<string> = [];

        if (this.hasViolation) {
            lines.push(this.getViolation());
        }

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            let text = this.getCorrection(item);

            if (lines.length > 0) {
                text = [this.getLiaison(), text].join(' ');
            }

            text = text.charAt(0).toUpperCase() + text.slice(1);

            lines.push(text);
        }

        return lines.join('\n');
    }

    public add(text: string): void {
        this.items.push(text);
    }

    private getLiaison(): string {
        return this.randomOf(liaisons);
    }

    private getViolation(): string {
        return this.randomOf(violations);
    }

    private getCorrection(text: string): string {
        const c = this.randomOf(correction);
        return c.replace('$1', text.replace('theo', 'teo'));
    }

    private randomOf(arr: Array<string>): string {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    public violate(status = true) {
        this.hasViolation = status;
    }
}
