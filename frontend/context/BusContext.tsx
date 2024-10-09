import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../service/firebase';
import { Bus } from '@/types/Bus';

interface BusContextProps {
    buses: Bus[];
    loading: boolean;
    error: string | null;
}

export const BusContext = createContext<BusContextProps>({
    buses: [],
    loading: true,
    error: null,
});

const BusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Set up a real-time listener for the "buses" collection
        const busCollection = collection(db, 'buses');

        const unsubscribe = onSnapshot(
            busCollection,
            (snapshot) => {
                const busList: Bus[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Bus[];
                setBuses(busList);
                setLoading(false);
            },
            (err) => {
                setError('Failed to fetch buses');
                console.error(err);
                setLoading(false);
            }
        );

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    return (
        <BusContext.Provider value={{ buses, loading, error }}>
            {children}
        </BusContext.Provider>
    );
};

export default BusProvider;
