import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, off, query, orderByChild, limitToLast, startAt, endAt } from 'firebase/database';
import { collection, query as firestoreQuery, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, database } from '../config/firebase';

export const useFirebaseQuery = (path, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    type = 'realtime',
    orderByField,
    orderDirection = 'asc',
    limitTo = 10,
    startAfter,
    endBefore,
    whereField,
    whereOperator,
    whereValue
  } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (type === 'realtime') {
        let dbRef = ref(database, path);

        // Aplicar ordenamiento si se especifica
        if (orderByField) {
          dbRef = query(dbRef, orderByChild(orderByField));
        }

        // Aplicar límite
        if (limitTo) {
          dbRef = query(dbRef, limitToLast(limitTo));
        }

        // Aplicar rangos
        if (startAfter) {
          dbRef = query(dbRef, startAt(startAfter));
        }
        if (endBefore) {
          dbRef = query(dbRef, endAt(endBefore));
        }

        const unsubscribe = onValue(dbRef, (snapshot) => {
          const result = snapshot.val();
          setData(result);
          setLoading(false);
        }, (error) => {
          setError(error);
          setLoading(false);
        });

        return () => {
          off(dbRef);
          unsubscribe();
        };
      } else {
        // Firestore query
        let q = collection(db, path);

        // Aplicar filtros where
        if (whereField && whereOperator && whereValue) {
          q = firestoreQuery(q, where(whereField, whereOperator, whereValue));
        }

        // Aplicar ordenamiento
        if (orderByField) {
          q = firestoreQuery(q, orderBy(orderByField, orderDirection));
        }

        // Aplicar límite
        if (limitTo) {
          q = firestoreQuery(q, limit(limitTo));
        }

        const querySnapshot = await getDocs(q);
        const result = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [path, type, orderByField, orderDirection, limitTo, startAfter, endBefore, whereField, whereOperator, whereValue]);

  useEffect(() => {
    const unsubscribe = fetchData();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}; 