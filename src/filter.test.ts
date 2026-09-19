import { describe, it, expect } from "vitest";
import { formatValue, renderFilter, type FilterNode } from "./filter";

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

describe("renderFilter", () => {
  const age: FilterNode = {
    type: "comparison",
    field: "Age",
    op: "gt",
    value: 18,
  };
  const name: FilterNode = {
    type: "comparison",
    field: "Name",
    op: "eq",
    value: "Bob",
  };
  const city: FilterNode = {
    type: "comparison",
    field: "City",
    op: "eq",
    value: "Pune",
  };

  it("renders a comparison", () => {
    expect(renderFilter(age)).toBe("Age gt 18");
    expect(renderFilter(name)).toBe("Name eq 'Bob'");
  });

  it("renders null comparisons", () => {
    expect(
      renderFilter({
        type: "comparison",
        field: "Email",
        op: "eq",
        value: null,
      }),
    ).toBe("Email eq null");
  });

  it("renders string functions", () => {
    expect(
      renderFilter({
        type: "function",
        name: "contains",
        field: "Name",
        value: "ob",
      }),
    ).toBe("contains(Name,'ob')");
    expect(
      renderFilter({
        type: "function",
        name: "startswith",
        field: "Name",
        value: "O'B",
      }),
    ).toBe("startswith(Name,'O''B')");
  });

  it("joins a group with its operator", () => {
    expect(
      renderFilter({ type: "group", op: "and", conditions: [age, name] }),
    ).toBe("Age gt 18 and Name eq 'Bob'");
    expect(
      renderFilter({ type: "group", op: "or", conditions: [age, name, city] }),
    ).toBe("Age gt 18 or Name eq 'Bob' or City eq 'Pune'");
  });

  it("renders a single-condition group without the operator", () => {
    expect(renderFilter({ type: "group", op: "and", conditions: [age] })).toBe(
      "Age gt 18",
    );
  });

  it("wraps a nested group of a different operator in parentheses", () => {
    const tree: FilterNode = {
      type: "group",
      op: "and",
      conditions: [age, { type: "group", op: "or", conditions: [name, city] }],
    };
    expect(renderFilter(tree)).toBe(
      "Age gt 18 and (Name eq 'Bob' or City eq 'Pune')",
    );
  });

  it("does not add parentheses for a nested group of the same operator", () => {
    const tree: FilterNode = {
      type: "group",
      op: "and",
      conditions: [age, { type: "group", op: "and", conditions: [name, city] }],
    };
    expect(renderFilter(tree)).toBe(
      "Age gt 18 and Name eq 'Bob' and City eq 'Pune'",
    );
  });

  it("renders not with parentheses", () => {
    expect(renderFilter({ type: "not", condition: age })).toBe(
      "not (Age gt 18)",
    );
  });

  it("throws on an empty group", () => {
    expect(() =>
      renderFilter({ type: "group", op: "and", conditions: [] }),
    ).toThrow();
  });
});
