import { convertSecondsToDuration } from "../secToDuration";

describe("convertSecondsToDuration", () => {
  it("returns 0s for zero", () => {
    expect(convertSecondsToDuration(0)).toBe("0s");
  });

  it("returns seconds only for under a minute", () => {
    expect(convertSecondsToDuration(45)).toBe("45s");
  });

  it("formats minutes and seconds", () => {
    expect(convertSecondsToDuration(90)).toBe("1m 30s");
  });

  it("formats hours and minutes", () => {
    expect(convertSecondsToDuration(3600)).toBe("1h 0m");
  });

  it("formats full hours, minutes, seconds", () => {
    expect(convertSecondsToDuration(7325)).toBe("2h 2m");
  });

  it("floors fractional seconds", () => {
    expect(convertSecondsToDuration(89.9)).toBe("1m 29s");
  });
});
