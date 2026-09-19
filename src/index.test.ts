import { describe, it, expect } from "vitest";
import { build } from "./index";

describe("build", () => {
  it("renders $top", () => {
    expect(build({ top: 10 })).toBe("?$top=10");
  });

  it("returns an empty string when there are no options", () => {
    expect(build({})).toBe("");
  });
});
