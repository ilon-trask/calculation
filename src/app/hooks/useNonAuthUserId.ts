import { useMemo } from "react";
import { v4 } from "uuid";

function useNonAuthUserId() {
  return useMemo(() => {
    const label = "userId";
    if (document.cookie.includes(label)) {
      const userIdMatch = document.cookie.match(/userId=([^;]+)/);
      if (!userIdMatch) throw new Error("");
      console.log(userIdMatch[1]);
      return userIdMatch[1];
    }
    const userId = v4();
    document.cookie = `userId=${userId}; path=/`;
    return userId;
  }, []);
}

export default useNonAuthUserId;
