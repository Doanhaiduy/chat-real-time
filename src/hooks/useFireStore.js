import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useFireStore = (collection, condition) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        let collectionRef = db.collection(collection).orderBy("createdAt");
        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                return;
            }
            collectionRef = collectionRef.where(condition.fieldName, condition.operator, condition.compareValue);
        }

        const unsubscribe = collectionRef.onSnapshot((Snapshot) => {
            const document = Snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setDocuments(document);
        });

        return unsubscribe;
    }, [collection, condition]);
    return documents;
};

export default useFireStore;
