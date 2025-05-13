// utils.test.ts
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from "vitest";
import {
  cn,
  formatDate,
  isDateValid,
  isDateBeforeToday,
  validateDPEData,
} from "./utils";
import { parseISO, addYears, subDays, addDays } from "date-fns";
import { DPEData } from "./types";
// lib/utils.test.ts

// Vous n'avez pas besoin de mocker date-fns/locale ici si c'est déjà fait dans vitest.setup.ts

describe("Date utility functions", () => {
  beforeAll(() => {
    // Mock la date système
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-05-13"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe("formatDate", () => {
    it("formats a valid date string correctly", () => {
      expect(formatDate("2023-01-15")).toBe("15 janvier 2023");
    });

    it("returns null for invalid date string", () => {
      expect(formatDate("invalid-date")).toBeNull();
    });

    it("returns null for undefined input", () => {
      expect(formatDate(undefined)).toBeNull();
    });
  });
});

describe("validateDPEData", () => {
  it("devrait retourner une erreur si la date de réalisation est manquante", () => {
    const dpeData: DPEData = {
      date_realisation: "",
      date_validite: "2035-05-13",
      adresse: "123 Rue Exemple",
      type_bien: "Maison",
      consommation_energetique: 120,
      classe_energetique: "C",
      emissions_co2: 15,
      classe_ges: "B",
      cout_energetique_estime: { min: 500, max: 1000 },
    };

    const errors = validateDPEData(dpeData);
    expect(errors).toContain("La date de réalisation du DPE est obligatoire");
  });

  it("devrait retourner une erreur si la date de réalisation est invalide", () => {
    const dpeData: DPEData = {
      date_realisation: "2025-13-01", // Date invalide
      date_validite: "2035-05-13",
      adresse: "123 Rue Exemple",
      type_bien: "Maison",
      consommation_energetique: 120,
      classe_energetique: "C",
      emissions_co2: 15,
      classe_ges: "B",
      cout_energetique_estime: { min: 500, max: 1000 },
    };

    const errors = validateDPEData(dpeData);
    expect(errors).toContain(
      "Le format de la date de réalisation est invalide"
    );
  });

  it("devrait retourner une erreur si la date de validité est manquante", () => {
    const dpeData: DPEData = {
      date_realisation: "2025-05-13",
      date_validite: "",
      adresse: "123 Rue Exemple",
      type_bien: "Maison",
      consommation_energetique: 120,
      classe_energetique: "C",
      emissions_co2: 15,
      classe_ges: "B",
      cout_energetique_estime: { min: 500, max: 1000 },
    };

    const errors = validateDPEData(dpeData);
    expect(errors).toContain("La date de fin de validité est manquante");
  });

  it("devrait retourner une erreur si la classe énergétique est invalide", () => {
    const dpeData: DPEData = {
      date_realisation: "2025-05-13",
      date_validite: "2035-05-13",
      adresse: "123 Rue Exemple",
      type_bien: "Maison",
      consommation_energetique: 120,
      classe_energetique: "Z", // Classe invalide
      emissions_co2: 15,
      classe_ges: "B",
      cout_energetique_estime: { min: 500, max: 1000 },
    };

    const errors = validateDPEData(dpeData);
    expect(errors).toContain(
      "La classe énergétique doit être une lettre entre A et G"
    );
  });

  it("devrait retourner une erreur si le coût énergétique estimé est manquant", () => {
    const dpeData: any = {
      date_realisation: "2025-05-13",
      date_validite: "2035-05-13",
      adresse: "123 Rue Exemple",
      type_bien: "Maison",
      consommation_energetique: 120,
      classe_energetique: "C",
      emissions_co2: 15,
      classe_ges: "B",
      cout_energetique_estime: null, // Coût manquant
    };

    const errors = validateDPEData(dpeData);
    expect(errors).toContain("Le coût énergétique estimé est manquant");
  });

  it("ne devrait retourner aucune erreur pour des données valides", () => {
    const dpeData: DPEData = {
      date_realisation: "2025-05-13",
      date_validite: "2035-05-13",
      adresse: "123 Rue Exemple",
      type_bien: "Maison",
      consommation_energetique: 120,
      classe_energetique: "C",
      emissions_co2: 15,
      classe_ges: "B",
      cout_energetique_estime: { min: 500, max: 1000 },
    };

    const errors = validateDPEData(dpeData);
    expect(errors).toHaveLength(0);
  });
});
