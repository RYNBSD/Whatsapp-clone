import { ImagePickerAsset } from "expo-image-picker";
import { create } from "zustand";

export const useImagePicker = create<{
  image: ImagePickerAsset | null;
  setImage: (image: ImagePickerAsset | null) => void;
  reset: () => void;
}>((set) => ({
  image: null,
  setImage: (image: ImagePickerAsset | null) => set({ image }),
  reset: () => set({ image: null }),
}));
