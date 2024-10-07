import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs } from 'firebase/firestore';
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
        const fetchBuses = async () => {
            try {
                const busCollection = collection(db, 'buses');
                const busSnapshot = await getDocs(busCollection);
                const busList: Bus[] = busSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Bus[];
                setBuses(busList);
            } catch (err) {
                setError('Failed to fetch buses');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBuses();
    }, []);

    return (
        <BusContext.Provider value={{ buses, loading, error }}>
            {children}
        </BusContext.Provider>
    );
};

export default BusProvider;
