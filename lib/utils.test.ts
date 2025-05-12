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
