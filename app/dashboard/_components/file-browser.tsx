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
import { Coins, FileIcon, Files, GridIcon, Loader2, Rows2Icon, StarIcon, TableIcon } from "lucide-react";
import { useState } from "react";
import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { SearchBar } from "./search-bar";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Doc } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";




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

export function FileBrowser({ title, favoritesOnly, deletedOnly, }:
  { title: string, favoritesOnly?: boolean, deletedOnly?: boolean }) {

  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  //console.log(organization?.id);
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const favorites = useQuery(api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  // const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip"); {should include query}
  const files = useQuery(
    api.files.getFiles,
    orgId ? {
      orgId,
      type: type === "all" ? undefined : type,
      query,
      favorites: favoritesOnly,
      deletedOnly
    }
      : "skip"
  );

  const isLoading = files === undefined;

  const modifiedFiles = files?.map(file => ({
    ...file,
    isFavorited: (favorites ?? []).some(
      (favorite) => favorite.fileId === file._id),
  })) ?? [];

  return (
    <div>

      <div className="flex justify-between item-center ">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
        <UploadButton />
      </div>

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList className="mb-4">
            <TabsTrigger value="grid" className="flex gap-2 item-center"><GridIcon />Grid</TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2 item-center"><Rows2Icon />Table</TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select">Type Filter</Label>

            <Select
              value={type}
              onValueChange={
                (newType) => {
                  setType(newType as any);
                }
              }>
              <SelectTrigger
                id="type-select"
                className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>

          </div>

        </div>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading...</div>
          </div>
        )}

        <TabsContent value="grid">
          <div className="grid grid-cols-3 gap-4">
            {modifiedFiles?.map((file) => {
              return <FileCard
                key={file._id}
                file={file}
              />;
            })}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <DataTable columns={columns} data={modifiedFiles} />
        </TabsContent>

      </Tabs>


      {files?.length === 0 && <PlaceHolder />}
    </div>


  );
}
