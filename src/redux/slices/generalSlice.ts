import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeneralState {
  selectedCycles: {
    regular: number | null;
    intersemestral: number | null;
  };
  cycles: any[];
}

// Ejemplo realizado por el ingeniero Camilo Andred Galindo Rivera
const initialState: GeneralState = {
  selectedCycles: {
    regular: null,
    intersemestral: null,
  },
  cycles: [],
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setCycles: (
      state,
      action: PayloadAction<{
        selectedCycles: {
          regular: number;
          intersemestral: number;
        };
      }>,
    ) => {
      state.selectedCycles = action.payload.selectedCycles;
    },
  },
});

export const { setCycles } = generalSlice.actions;

export default generalSlice.reducer;
