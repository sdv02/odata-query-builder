import { describe, it, expect } from "vitest";
import { build } from "./index";

describe("build", () => {
  it("renders $top", () => {
    expect(build({ top: 10 })).toBe("?$top=10");
  });

  it("returns an empty string when there are no options", () => {
    expect(build({})).toBe("");
  });

  it("renders $skip", () => {
    expect(build({ skip: 20 })).toBe("?$skip=20");
  });

  it("renders $count", () => {
    expect(build({ count: true })).toBe("?$count=true");
    expect(build({ count: false })).toBe("?$count=false");
  });

  it("renders $select", () => {
    expect(build({ select: ["Name", "Age"] })).toBe("?$select=Name,Age");
  });

  it("omits $select when the list is empty", () => {
    expect(build({ select: [] })).toBe("");
  });

  it("renders $orderby", () => {
    expect(build({ orderBy: ["Name"] })).toBe("?$orderby=Name");
    expect(
      build({ orderBy: [{ field: "Age", direction: "desc" }, "Name"] }),
    ).toBe("?$orderby=Age desc,Name");
  });

  it("joins multiple options with &", () => {
    expect(build({ top: 10, skip: 20, count: true })).toBe(
      "?$top=10&$skip=20&$count=true",
    );
  });
});
