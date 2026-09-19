import { describe, it, expect } from "vitest";
import { build } from "./index";
import { and, contains, eq, gt } from "./helpers";

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
      build(
        { orderBy: [{ field: "Age", direction: "desc" }, "Name"] },
        { encode: false },
      ),
    ).toBe("?$orderby=Age desc,Name");
  });

  it("joins multiple options with &", () => {
    expect(build({ top: 10, skip: 20, count: true })).toBe(
      "?$top=10&$skip=20&$count=true",
    );
  });

  it("renders $filter", () => {
    expect(build({ filter: gt("Age", 18) }, { encode: false })).toBe(
      "?$filter=Age gt 18",
    );
  });

  it("renders a compound $filter alongside other options", () => {
    expect(
      build(
        {
          filter: and(gt("Age", 18), contains("Name", "ob")),
          top: 5,
        },
        { encode: false },
      ),
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

  it("renders nested $select inside $expand", () => {
    expect(
      build(
        {
          expand: [{ path: "Orders", options: { select: ["Id", "Total"] } }],
        },
        { encode: false },
      ),
    ).toBe("?$expand=Orders($select=Id,Total)");
  });

  it("joins nested options with ;", () => {
    expect(
      build(
        {
          expand: [
            {
              path: "Orders",
              options: { filter: gt("Total", 10), select: ["Id"] },
            },
          ],
        },
        { encode: false },
      ),
    ).toBe("?$expand=Orders($filter=Total gt 10;$select=Id)");
  });

  it("supports expand within expand", () => {
    expect(
      build({
        expand: [
          {
            path: "Orders",
            options: {
              expand: [{ path: "Items", options: { select: ["Sku"] } }],
            },
          },
        ],
      }),
    ).toBe("?$expand=Orders($expand=Items($select=Sku))");
  });

  it("mixes plain and nested items", () => {
    expect(
      build({ expand: ["Address", { path: "Orders", options: { top: 3 } }] }),
    ).toBe("?$expand=Address,Orders($top=3)");
  });

  it("renders no parentheses when nested options are empty", () => {
    expect(build({ expand: [{ path: "Orders", options: {} }] })).toBe(
      "?$expand=Orders",
    );
  });

  it("percent-encodes by default", () => {
    expect(build({ filter: eq("Name", "a&b c") })).toBe(
      "?$filter=Name%20eq%20'a%26b%20c'",
    );
  });

  it("can skip encoding", () => {
    expect(build({ filter: eq("Name", "a&b c") }, { encode: false })).toBe(
      "?$filter=Name eq 'a&b c'",
    );
  });
});
