import { useMemo } from "react";
import { v4 } from "uuid";

function useNonAuthUserId() {
  return useMemo(() => {
    const label = "userId";
    const userId = localStorage.getItem(label);
    if (userId) return userId;
    const newId = v4();
    localStorage.setItem(label, newId);
    return newId;
  }, []);
}

export default useNonAuthUserId;
