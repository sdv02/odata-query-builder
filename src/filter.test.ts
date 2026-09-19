import { describe, it, expect } from "vitest";
import { formatValue } from "./filter";

describe("formatValue", () => {
  it("quotes strings", () => {
    expect(formatValue("Bob")).toBe("'Bob'");
  });

  it("doubles inner single quotes", () => {
    expect(formatValue("O'Brien")).toBe("'O''Brien'");
  });

  it("renders numbers as-is", () => {
    expect(formatValue(42)).toBe("42");
    expect(formatValue(-3.5)).toBe("-3.5");
  });

  it("renders booleans", () => {
    expect(formatValue(true)).toBe("true");
    expect(formatValue(false)).toBe("false");
  });

  it("renders null", () => {
    expect(formatValue(null)).toBe("null");
  });

  it("renders dates as unquoted ISO 8601", () => {
    expect(formatValue(new Date("2024-01-15T10:30:00Z"))).toBe(
      "2024-01-15T10:30:00.000Z",
    );
  });

  it("rejects NaN and Infinity", () => {
    expect(() => formatValue(NaN)).toThrow();
    expect(() => formatValue(Infinity)).toThrow();
  });
});
