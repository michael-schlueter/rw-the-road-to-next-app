import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "@prisma/client";
import { getAuth } from "../queries/get-auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isFetched, setIsFetched] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      const { user } = await getAuth();
      setUser(user);
      setIsFetched(true);
    }
    fetchUser();
  }, [pathname]);

  return { user, isFetched };
}
