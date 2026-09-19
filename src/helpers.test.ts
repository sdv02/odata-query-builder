import { describe, it, expect } from "vitest";
import {
  eq,
  ne,
  gt,
  ge,
  lt,
  le,
  contains,
  startsWith,
  endsWith,
  and,
  or,
  not,
} from "./helpers";
import { renderFilter } from "./filter";

describe("helpers", () => {
  it("build comparison nodes", () => {
    expect(renderFilter(eq("Name", "Bob"))).toBe("Name eq 'Bob'");
    expect(renderFilter(ne("Age", 5))).toBe("Age ne 5");
    expect(renderFilter(gt("Age", 18))).toBe("Age gt 18");
    expect(renderFilter(ge("Age", 18))).toBe("Age ge 18");
    expect(renderFilter(lt("Age", 65))).toBe("Age lt 65");
    expect(renderFilter(le("Age", 65))).toBe("Age le 65");
  });

  it("build function nodes", () => {
    expect(renderFilter(contains("Name", "ob"))).toBe("contains(Name,'ob')");
    expect(renderFilter(startsWith("Name", "B"))).toBe("startswith(Name,'B')");
    expect(renderFilter(endsWith("Name", "b"))).toBe("endswith(Name,'b')");
  });

  it("combine with and / or / not", () => {
    expect(renderFilter(and(gt("Age", 18), eq("City", "Pune")))).toBe(
      "Age gt 18 and City eq 'Pune'",
    );
    expect(renderFilter(or(eq("A", 1), eq("B", 2), eq("C", 3)))).toBe(
      "A eq 1 or B eq 2 or C eq 3",
    );
    expect(renderFilter(not(eq("Active", false)))).toBe(
      "not (Active eq false)",
    );
  });

  it("nest correctly", () => {
    expect(
      renderFilter(
        and(gt("Age", 18), or(eq("City", "Pune"), eq("City", "Delhi"))),
      ),
    ).toBe("Age gt 18 and (City eq 'Pune' or City eq 'Delhi')");
  });
});
