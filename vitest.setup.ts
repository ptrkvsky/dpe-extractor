import "@testing-library/jest-dom";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Étendre les matchers de vitest avec ceux de testing-library
expect.extend(matchers);

// Nettoyer après chaque test
afterEach(() => {
  cleanup();
});

// Mocking de date-fns/locale si nécessaire
vi.mock("date-fns/locale", () => ({
  fr: {},
}));
