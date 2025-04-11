import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // ✅ usa el export correcto

export const uploadImage = async (file, path = "products") => {
  const filename = `${Date.now()}-${file.name}`;
  const fileRef = ref(storage, `${path}/${filename}`);
  const snapshot = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};
