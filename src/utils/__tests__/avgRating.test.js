import GetAvgRating from "../avgRating";

describe("GetAvgRating", () => {
  it("returns 0 for an empty array", () => {
    expect(GetAvgRating([])).toBe(0);
  });

  it("returns 0 when ratingArr is undefined", () => {
    expect(GetAvgRating(undefined)).toBe(0);
  });

  it("returns the rating for a single review", () => {
    expect(GetAvgRating([{ rating: 5 }])).toBe(5);
  });

  it("rounds the average to one decimal place", () => {
    const reviews = [{ rating: 5 }, { rating: 4 }, { rating: 5 }];
    expect(GetAvgRating(reviews)).toBe(4.7);
  });
});
