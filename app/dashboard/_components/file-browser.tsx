'use client';

import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";
import { query } from "@/convex/_generated/server";
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton, useOrganization, useSession, useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input"
import { useMutation, useQuery } from "convex/react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Coins, FileIcon, Files, Loader2, StarIcon } from "lucide-react";
import { useState } from "react";
import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { SearchBar } from "./search-bar";
import Link from "next/link";



function PlaceHolder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a pictur e and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">
        You have no files, upload one now.
      </div>
      <UploadButton />
    </div>
  );
}

export function FileBrowser({ title, favoritesOnly }: { title: string, favoritesOnly?: boolean }) {

  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  //console.log(organization?.id);
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const favorites = useQuery(api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  // const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip"); {should include query}
  const files = useQuery(api.files.getFiles, orgId ? { orgId, query, favorites: favoritesOnly } : "skip");
  const isLoading = files === undefined;

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <div className="text-2xl">Loading...</div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex justify-between item-center ">
            <h1 className="text-4xl font-bold mb-8">{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>

          {files.length === 0 && <PlaceHolder />}

          <div className="grid grid-cols-3 gap-4">
            {files?.map((file) => {
              return (<FileCard
                favorites={favorites ?? []}
                key={file._id}
                file={file}
              />
              );
            })}
          </div>
        </>
      )}
    </div>


  );
}
