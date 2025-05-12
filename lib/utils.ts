import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DPEData } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string | null {
  if (!dateString) return null;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return null;
    return format(date, 'dd MMMM yyyy', { locale: fr });
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
    errors.push("La date de réalisation ne peut pas être postérieure à la date du jour");
  }
  
  if (!dpeData.date_validite) {
    errors.push("La date de fin de validité est manquante");
  } else if (!isDateValid(dpeData.date_validite)) {
    errors.push("Le format de la date de validité est invalide");
  }
  
  // Check if validity date is 10 years after creation date
  if (dpeData.date_realisation && dpeData.date_validite && 
      isDateValid(dpeData.date_realisation) && isDateValid(dpeData.date_validite)) {
    const creationDate = parseISO(dpeData.date_realisation);
    const validityDate = parseISO(dpeData.date_validite);
    
    // Calculate expected validity date (10 years after creation)
    const expectedValidityDate = new Date(creationDate);
    expectedValidityDate.setFullYear(expectedValidityDate.getFullYear() + 10);
    
    // Allow 1 day difference to account for timezone issues
    const timeDiff = Math.abs(validityDate.getTime() - expectedValidityDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff > 1) {
      errors.push("La date de validité doit être exactement 10 ans après la date de réalisation");
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
    if (typeof dpeData.cout_energetique_estime.min !== 'number') {
      errors.push("La valeur minimale du coût énergétique est manquante ou invalide");
    }
    if (typeof dpeData.cout_energetique_estime.max !== 'number') {
      errors.push("La valeur maximale du coût énergétique est manquante ou invalide");
    }
  }
  
  return errors;
}