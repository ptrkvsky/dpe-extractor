import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { DPEData } from "./types";

declare global {
  interface Window {
    showMeTheMagic: () => void;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string | null {
  if (!dateString) return null;

  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return null;
    return format(date, "dd MMMM yyyy", { locale: fr });
  } catch (error) {
    return null;
  }
}

export function isDateValid(dateString?: string): boolean {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch (error) {
    return false;
  }
}

export function isDateBeforeToday(dateString?: string): boolean {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date <= today;
  } catch (error) {
    return false;
  }
}

export function validateDPEData(dpeData: DPEData): string[] {
  const errors: string[] = [];

  // Date validations
  if (!dpeData.date_realisation) {
    errors.push("La date de réalisation du DPE est obligatoire");
  } else if (!isDateValid(dpeData.date_realisation)) {
    errors.push("Le format de la date de réalisation est invalide");
  } else if (!isDateBeforeToday(dpeData.date_realisation)) {
    errors.push(
      "La date de réalisation ne peut pas être postérieure à la date du jour"
    );
  }

  if (!dpeData.date_validite) {
    errors.push("La date de fin de validité est manquante");
  } else if (!isDateValid(dpeData.date_validite)) {
    errors.push("Le format de la date de validité est invalide");
  }

  // Check if validity date is 10 years after creation date
  if (
    dpeData.date_realisation &&
    dpeData.date_validite &&
    isDateValid(dpeData.date_realisation) &&
    isDateValid(dpeData.date_validite)
  ) {
    const creationDate = parseISO(dpeData.date_realisation);
    const validityDate = parseISO(dpeData.date_validite);

    // Calculate expected validity date (10 years after creation)
    const expectedValidityDate = new Date(creationDate);
    expectedValidityDate.setFullYear(expectedValidityDate.getFullYear() + 10);

    // Allow 1 day difference to account for timezone issues
    const timeDiff = Math.abs(
      validityDate.getTime() - expectedValidityDate.getTime()
    );
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff > 1) {
      errors.push(
        "La date de validité doit être exactement 10 ans après la date de réalisation"
      );
    }
  }

  // Required fields validations
  if (!dpeData.adresse) {
    errors.push("L'adresse du bien est manquante");
  }

  if (!dpeData.type_bien) {
    errors.push("Le type de bien est manquant");
  }

  if (!dpeData.consommation_energetique) {
    errors.push("La consommation énergétique est manquante");
  }

  if (!dpeData.classe_energetique) {
    errors.push("La classe énergétique est manquante");
  } else if (!/^[A-G]$/i.test(dpeData.classe_energetique)) {
    errors.push("La classe énergétique doit être une lettre entre A et G");
  }

  if (!dpeData.emissions_co2) {
    errors.push("Les émissions de CO₂ sont manquantes");
  }

  if (!dpeData.classe_ges) {
    errors.push("La classe GES est manquante");
  } else if (!/^[A-G]$/i.test(dpeData.classe_ges)) {
    errors.push("La classe GES doit être une lettre entre A et G");
  }

  if (!dpeData.cout_energetique_estime) {
    errors.push("Le coût énergétique estimé est manquant");
  } else {
    if (typeof dpeData.cout_energetique_estime.min !== "number") {
      errors.push(
        "La valeur minimale du coût énergétique est manquante ou invalide"
      );
    }
    if (typeof dpeData.cout_energetique_estime.max !== "number") {
      errors.push(
        "La valeur maximale du coût énergétique est manquante ou invalide"
      );
    }
  }

  return errors;
}

// Ajoutez ce code dans votre fichier principal (ex: _app.js ou layout.js)

/**
 * Console Easter Egg pour les développeurs
 * A afficher lors du chargement de l'application
 */
export const consoleEasterEgg = () => {
  if (typeof window !== "undefined") {
    const styles = {
      title: [
        "font-weight: bold",
        "font-size: 40px",
        "color: #3e005a",
        "text-shadow: 2px 2px 0 #ec6725",
      ].join(";"),
      subtitle: [
        "font-size: 20px",
        "font-weight: bold",
        "color: #5e1973",
        "margin: 5px 0",
      ].join(";"),
      info: ["font-size: 16px", "color: #589e29"].join(";"),
      jsBox: [
        "font-size: 18px",
        "font-weight: bold",
        "background: #f7df1e",
        "color: #000",
        "padding: 10px 15px",
        "border-radius: 5px 0 0 5px",
        "margin-right: 0",
      ].join(";"),
      compareSign: [
        "font-size: 28px",
        "font-weight: bold",
        "background: #e2e8f0",
        "color: #1e293b",
        "padding: 4px 15px",
      ].join(";"),
      phpBox: [
        "font-size: 18px",
        "font-weight: bold",
        "background: #8993be",
        "color: #fff",
        "padding: 10px 15px",
        "border-radius: 0 5px 5px 0",
        "text-decoration: line-through",
      ].join(";"),
      footer: ["font-size: 14px", "font-style: italic", "color: #64748b"].join(
        ";"
      ),
    };

    // ASCII Art logo
    console.log(`
    ▓█████▄  ██▓███  ▓█████ 
    ▒██▀ ██▌▓██░  ██▒▓█   ▀ 
    ░██   █▌▓██░ ██▓▒▒███   
    ░▓█▄   ▌▒██▄█▓▒ ▒▒▓█  ▄ 
    ░▒████▓ ▒██▒ ░  ░░▒████▒
    ▒▒▓  ▒ ▒▓▒░ ░  ░░░ ▒░ ░
    ░ ▒  ▒ ░▒ ░      ░ ░  ░
    ░ ░  ░ ░░          ░   
    ░               ░  ░
    ░                     
    `);

    // Titre stylisé
    console.log("%cValidateur DPE", styles.title);

    // Sous-titre
    console.log(
      "%cL'application de validation des diagnostics énergétiques",
      styles.subtitle
    );

    // Infos techniques
    console.log("%cBuild avec Next.js, React et l'IA d'OpenAI", styles.info);

    // JS > PHP (le message humoristique)
    console.log(
      "%cJavaScript%c > %cPHP",
      styles.jsBox,
      styles.compareSign,
      styles.phpBox
    );

    // Ajout d'un petit tableau informatif
    console.table({
      Version: "1.0.0",
      Environnement: process.env.NODE_ENV,
      Framework: "Next.js 13.4.19",
      "Date de build": new Date().toLocaleDateString(),
      "Powered by": "☕ & 💻 & 🌩️ Bolt & 👴 Claude",
    });

    // Message caché pour les plus curieux
    console.log(
      '%c🔍 Psst... Pour plus de logs secrets, essaie la commande "showMeTheMagic()" dans cette console',
      "color: #e1171e; font-style: italic;"
    );

    // Fonction cachée pour les très curieux
    window!.showMeTheMagic = () => {
      console.log(
        "%c✨ Tu as découvert la fonctionnalité secrète ! Bravo !",
        "font-size: 24px; color: #f8d910; background: #3e005a; padding: 10px; border-radius: 5px;"
      );
      console.log(
        "%c(En vrai, il n'y a pas de magie, juste du JavaScript 😉)",
        "font-style: italic; color: #64748b;"
      );
    };
  }
};
