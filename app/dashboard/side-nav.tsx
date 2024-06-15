'use client'

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav() {
    const pathname = usePathname()

    return (

        <div className="w-40 flex flex-col gap-4">
            <Link href="/dashboard/files">
                <Button variant={"link"} className={clsx("flex gap-2", { "text-blue-500": pathname.includes("/dashboard/files") })}>
                    <FileIcon /> All records
                </Button>
            </Link>

            <Link href="/dashboard/favorites">
                <Button variant={"link"} className={clsx("flex gap-2", { "text-blue-500": pathname.includes("/dashboard/favorites") })}>
                    <StarIcon /> Favorites
                </Button>
            </Link>

            <Link href="/dashboard/trash">
                <Button variant={"link"} className={clsx("flex gap-2", { "text-blue-500": pathname.includes("/dashboard/trash") })}>
                    <Trash2Icon /> Trash
                </Button>
            </Link>
        </div>
    );
}