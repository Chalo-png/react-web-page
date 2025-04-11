import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // ajusta si usas otra ruta

function useFirestoreOptions(collectionName) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOptions(data);
      } catch (err) {
        console.error(`Error cargando ${collectionName}:`, err);
      }
    }

    fetchOptions();
  }, [collectionName]);

  return options;
}

export default useFirestoreOptions;
