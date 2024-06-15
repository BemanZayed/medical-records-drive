import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Doc, Id, } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { DeleteIcon, EllipsisVertical, FileIcon, FileTextIcon, GanttChart, GanttChartIcon, ImageIcon, StarHalf, StarIcon, TrashIcon, UndoIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { ReactNode, useState } from "react";
import Image from 'next/image';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { MutationCtx, mutation } from "@/convex/_generated/server";
import { Protect } from "@clerk/nextjs";




export function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited: boolean }) {
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const toggleFavorite = useMutation(api.files.toggleFavorite);

    const { toast } = useToast();
    const me = useQuery(api.users.getMe);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will mark the file for our deletion process.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deleteFile({ fileId: file._id });
                            toast({
                                variant: "default",
                                title: "File marked for deletion",
                                description: "You file will be deleted soon.",
                            });
                        }}

                        >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => {
                            window.open(getFileUrl(file.fileId), "_blank");
                        }}
                        className="flex gap-1 items-center cursor-pointer">
                        <FileIcon className="w-4 h-4" /> Download

                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            toggleFavorite({
                                fileId: file._id,
                            });
                        }}
                        className="flex gap-1 items-center cursor-pointer">
                        {isFavorited ? (
                            <div className="flex gap-1 items-center">
                                <StarIcon className="w-4 h-4" /> Unfavorite </div>
                        ) : (
                            <div className="flex gap-1 items-center">
                                <StarHalf className="w-4 h-4" />favorite </div>
                        )}

                    </DropdownMenuItem>



                    <Protect

                        condition={(check) => {
                            return (check({
                                role: "org:admin",
                            }) || file.userId === me?._id
                            );
                        }}
                        fallback={<></>}
                    >
                        <DropdownMenuSeparator />


                        <DropdownMenuItem
                            onClick={() => {
                                if (file.shouldDelete) {
                                    restoreFile({
                                        fileId: file._id,
                                    })

                                }
                                else {
                                    setIsConfirmOpen(true)
                                }
                            }}
                            className="flex gap-1 items-center cursor-pointer">

                            {file.shouldDelete ? (
                                <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                                    <UndoIcon className="w-4 h-4" /> Restore
                                </div>) : (
                                <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                                    <TrashIcon className="w-4 h-4" /> Delete
                                </div>
                            )}
                        </DropdownMenuItem>
                    </Protect>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
// export const GetStorageUrl = mutation({
//     handler: async (ctx: MutationCtx, args: { fileId: Id<"_storage"> }) => {
//         return await ctx.storage.getUrl(args.fileId);
//     },
// });

// export const getStorageUrl = mutation({
//     handler: async (ctx: MutationCtx, args: { fileId: Id<"_storage"> }) => {
//         return await ctx.storage.getUrl(args.fileId);
//     },
// });


export function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

