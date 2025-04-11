// src/services/uploadCarouselImage.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export const uploadCarouselImage = async (file) => {
  const filename = `${Date.now()}-${file.name}`;
  const fileRef = ref(storage, `carousel/${filename}`);
  const snapshot = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};
