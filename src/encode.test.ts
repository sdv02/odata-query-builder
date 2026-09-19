import { describe, it, expect } from "vitest";
import { encodeQuery } from "./encode";

describe("encodeQuery", () => {
  it("encodes spaces between tokens", () => {
    expect(encodeQuery("$filter=Age gt 18")).toBe("$filter=Age%20gt%2018");
  });

  it("leaves OData delimiters alone", () => {
    const q = "$select=A,B&$expand=C($top=1;$skip=2)";
    expect(encodeQuery(q)).toBe(q);
  });

  it("encodes reserved characters inside string literals", () => {
    expect(encodeQuery("$filter=Name eq 'a&b'")).toBe(
      "$filter=Name%20eq%20'a%26b'",
    );
    expect(encodeQuery("$filter=Name eq 'x#y+z%'")).toBe(
      "$filter=Name%20eq%20'x%23y%2Bz%25'",
    );
  });

  it("keeps doubled single quotes", () => {
    expect(encodeQuery("$filter=Name eq 'O''Brien'")).toBe(
      "$filter=Name%20eq%20'O''Brien'",
    );
  });

  it("encodes spaces and non-ASCII characters inside literals", () => {
    expect(encodeQuery("$filter=Name eq 'José Ñ'")).toBe(
      "$filter=Name%20eq%20'Jos%C3%A9%20%C3%91'",
    );
  });

  it("handles empty strings and several literals", () => {
    expect(encodeQuery("$filter=A eq '' and B eq 'x y'")).toBe(
      "$filter=A%20eq%20''%20and%20B%20eq%20'x%20y'",
    );
  });
});
