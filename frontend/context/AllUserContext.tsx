import { db } from "@/service/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { createContext, FC, useContext, useEffect, useState } from "react";

export interface User {
  userId: string;
  name: string;
  email: string;
  role: "User" | "Admin";
}
interface AllUserContextData {
  users: User[] | null;
  loading: boolean;
}

const AllUserContext = createContext<AllUserContextData>(
  {} as AllUserContextData
);

export const AllUserProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userCollection = collection(db, "users");

    const unsubscribe = onSnapshot(userCollection, (querySnapshot) => {
      const userList: User[] = [];
      querySnapshot.forEach((doc) => {
        const { userId, name, email, role } = doc.data();
        userList.push({ userId, name, email, role });
      });
      setUsers(userList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("All User context:", users);
  }, [users]);

  return (
    <AllUserContext.Provider value={{ users, loading }}>
      {children}
    </AllUserContext.Provider>
  );
};

export const useAllUser = () => useContext(AllUserContext);
