import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchCriteria: {
    locationId: null,
    dateRange: { from: null, to: null },
    guests: 1,
    isFromHeroSearch: false,
  },
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchCriteria: (state, action) => {
      state.searchCriteria = {
        ...action.payload,
        isFromHeroSearch: true,
      };
    },
    clearSearchCriteria: (state) => {
      state.searchCriteria = {
        locationId: null,
        dateRange: { from: null, to: null },
        guests: 1,
        isFromHeroSearch: false,
      };
    },
    updateSearchDates: (state, action) => {
      state.searchCriteria.dateRange = action.payload;
    },
    updateSearchGuests: (state, action) => {
      state.searchCriteria.guests = action.payload;
    },
  },
});

export const {
  setSearchCriteria,
  clearSearchCriteria,
  updateSearchDates,
  updateSearchGuests,
} = searchSlice.actions;
export default searchSlice.reducer;
