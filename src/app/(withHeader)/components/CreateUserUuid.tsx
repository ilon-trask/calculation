"use client";
import useNonAuthUserId from "@/app/hooks/useNonAuthUserId";
import React from "react";

function CreateUserUuid({ userId }: { userId: string | undefined }) {
  if (!userId) {
    useNonAuthUserId();
  }
  return <></>;
}

export default CreateUserUuid;
