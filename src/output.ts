import correction from './ressources/output/corrections';
import liaisons from './ressources/output/liaisons';
import violations from './ressources/output/violations';
import tricks from './ressources/output/tricks';
import provocations from './ressources/output/provocations';

/**
 * La classe Output permet de générer un message semi-aléatoire
 * selon les problèmes trouvé dans le message reçu
 */
export class Output {
    // Liste des corrections à afficher dans le message de sortie
    private corrections: Array<string> = [];

    // Est-ce qu'il y a eu une violation ?
    private hasViolation: boolean = false;
    // Est-ce qu'il y a eu une tentative de trick ?
    private hasTrick: boolean = false;
    // Est-ce qu'il y aura une provocation ?
    private hasProvocation: boolean = false;

    /**
     * Générer le message final à envoyer
     * @returns Le message final
     */
    public compute(): string {
        const lines: Array<string> = [];

        // Afficher ou non un header pour la violation
        if (this.hasViolation) {
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
        if (this.hasTrick) {
            let t = this.getTrick();
            t = lines.length > 0 ? 'Et ' + t : this.capitalize(t);
            lines.push(t);
        }

        // Si aucuns problèmes n'ont été trouvé, on peut provoquer
        if (lines.length == 0) {
            if (this.hasProvocation) return this.getProvocation();
            return '';
        }

        return lines.join('\n');
    }

    /**
     * Ajouter une correction à afficher dans le message final
     * @param text Le texte à corriger
     */
    public add(text: string): void {
        if (this.corrections.indexOf(text) == -1) this.corrections.push(text);
    }

    /**
     * Signaler une violation dans le texte
     * @param status Violation présente
     */
    public violate(status = true) {
        this.hasViolation = status;
    }

    /**
     * Signaler un trick dans le texte
     * @param status Trick présent
     */
    public trick(status = true) {
        this.hasTrick = status;
    }

    /**
     * Émettre une provocation s'il n'y a pas d'autre soucis dans le texte
     * @param status Afficher une provocation
     */
    public provocate(status = true) {
        this.hasProvocation = status;
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
