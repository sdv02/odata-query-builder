import { describe, it, expect } from "vitest";
import { build } from "./index";
import { and, contains, gt } from "./helpers";

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

  it("renders $filter", () => {
    expect(build({ filter: gt("Age", 18) })).toBe("?$filter=Age gt 18");
  });

  it("renders a compound $filter alongside other options", () => {
    expect(
      build({
        filter: and(gt("Age", 18), contains("Name", "ob")),
        top: 5,
      }),
    ).toBe("?$top=5&$filter=Age gt 18 and contains(Name,'ob')");
  });

  it("renders a simple $expand", () => {
    expect(build({ expand: ["Orders"] })).toBe("?$expand=Orders");
    expect(build({ expand: ["Orders", "Address"] })).toBe(
      "?$expand=Orders,Address",
    );
  });

  it("omits $expand when the list is empty", () => {
    expect(build({ expand: [] })).toBe("");
  });

  it("renders $expand alongside other options", () => {
    expect(build({ top: 5, expand: ["Orders"] })).toBe(
      "?$top=5&$expand=Orders",
    );
  });
});
