import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { PostDataType } from "data/types";

export interface MediaRunningState {
  postData?: PostDataType;
  state?: "loading" | "playing" | "paused" | "ended" | null;
  listAudioUrls?: string[];
}

const initialState: MediaRunningState = {};

export const mediaRunningSlice = createSlice({
  name: "mediaRunning",
  initialState,
  reducers: {
    changeCurrentMediaRunning: (
      state,
      action: PayloadAction<MediaRunningState>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeStateMediaRunning: (
      state,
      action: PayloadAction<MediaRunningState["state"]>
    ) => {
      return {
        ...state,
        state: action.payload,
      };
    },
    removeMediaRunning: (state) => {
      return {
        listAudioUrls: state.listAudioUrls,
      };
    },
    //
    addNewListAudioUrls: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        listAudioUrls: [...(state.listAudioUrls || []), action.payload],
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  changeCurrentMediaRunning,
  changeStateMediaRunning,
  removeMediaRunning,
  addNewListAudioUrls,
} = mediaRunningSlice.actions;

export const selectCurrentMediaRunning = (state: RootState) =>
  state.mediaRunning;

export const selectCurrentAudioUrl = (state: RootState) =>
  state.mediaRunning.postData?.audioUrl;

export default mediaRunningSlice.reducer;
