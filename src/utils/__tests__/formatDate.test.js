import { formattedDate } from "../formatDate";

describe("formattedDate", () => {
  it("formats a valid date string", () => {
    expect(formattedDate("2024-01-15")).toBe("January 15, 2024");
  });

  it("formats a Date object", () => {
    expect(formattedDate(new Date(2024, 0, 15))).toBe("January 15, 2024");
  });
});
