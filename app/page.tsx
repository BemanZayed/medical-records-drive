
'use client';

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { query } from "@/convex/_generated/server";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
export default function Home() {
  const Files = useQuery(api.MedicalFiles.getFiles);

  const createFile = useMutation(api.MedicalFiles.createFiles);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>

      {Files?.map((file) => {
        return <div key={file.id}>{file.name}</div>;
      })}

      <Button onClick={() => {
        createFile({
          name: "hello world",
        });
      }}
      >
        Click me
      </Button>
    </main>
  );
}
