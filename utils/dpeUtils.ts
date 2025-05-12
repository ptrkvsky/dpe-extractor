export interface DpeResult {
  adresse: string;
  type_bien: string;
  date_realisation: string; // ISO: YYYY-MM-DD
  date_validite: string;
  consommation_energetique: number;
  classe_energetique: string;
  emissions_co2: number;
  classe_ges: string;
  cout_energetique_estime: {
    min: number;
    max: number;
  };
}

/**
 * Calcule la classe énergétique (A à G) à partir de la consommation en kWh/m²/an.
 */
export function getClasseEnergetique(consommation: number): string {
  if (consommation <= 70) return "A";
  if (consommation <= 110) return "B";
  if (consommation <= 180) return "C";
  if (consommation <= 250) return "D";
  if (consommation <= 330) return "E";
  if (consommation <= 420) return "F";
  return "G";
}

/**
 * Calcule la classe GES (A à G) à partir des émissions en kg CO2/m²/an.
 */
export function getClasseGES(emissions: number): string {
  if (emissions <= 6) return "A";
  if (emissions <= 11) return "B";
  if (emissions <= 30) return "C";
  if (emissions <= 50) return "D";
  if (emissions <= 70) return "E";
  if (emissions <= 100) return "F";
  return "G";
}

/**
 * Vérifie et corrige les classes énergétique et GES si GPT a mal estimé.
 */
export function corrigerClassements(dpe: DpeResult): DpeResult {
  const bonneClasseEnergetique = getClasseEnergetique(
    dpe.consommation_energetique
  );
  const bonneClasseGES = getClasseGES(dpe.emissions_co2);

  if (bonneClasseEnergetique !== dpe.classe_energetique) {
    console.warn(
      `⚠️ Correction classe énergétique : ${dpe.classe_energetique} => ${bonneClasseEnergetique}`
    );
    dpe.classe_energetique = bonneClasseEnergetique;
  }

  if (bonneClasseGES !== dpe.classe_ges) {
    console.warn(
      `⚠️ Correction classe GES : ${dpe.classe_ges} => ${bonneClasseGES}`
    );
    dpe.classe_ges = bonneClasseGES;
  }

  return dpe;
}
