// src/services/productService.js
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

const productsRef = collection(db, 'products');

export const getProducts = async () => {
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateProduct = async (id, data) => {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, data);
};
  

export const deleteProduct = async (id) => {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
};

export const addProduct = async (product) => {
  await addDoc(collection(db, 'products'), product);
};
