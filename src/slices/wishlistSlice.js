import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
  loading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist(state, value) {
      state.wishlist = value.payload;
    },
    addToWishlist(state, value) {
      state.wishlist = [...state.wishlist, value.payload];
    },
    removeFromWishlist(state, value) {
      state.wishlist = state.wishlist.filter((id) => id !== value.payload);
    },
    setWishlistLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  setWishlistLoading,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
