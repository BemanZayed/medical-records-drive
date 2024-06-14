'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { api } from "../../../convex/_generated/api";
import { query } from "@/convex/_generated/server";
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton, useOrganization, useSession, useUser } from "@clerk/nextjs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useMutation } from "convex/react";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Coins, Files, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Doc } from "../../../convex/_generated/dataModel";

const formSchema = z.object({
    title: z.string().min(1).max(200),
    file: z
        .custom<FileList>((val) => val instanceof FileList, "Required")
        .refine((files) => files.length > 0, "Required")
});

export default function UploadButton() {

    const { toast } = useToast();//
    const organization = useOrganization();
    const user = useUser();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    });

    const fileRef = form.register("file");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!orgId) return;

        const postUrl = await generateUploadUrl();
        const fileType = values.file[0].type;

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": fileType },
            body: values.file[0],
        });

        const { storageId } = await result.json();

        const types =
            {
                "image/png": "image",
                "application/pdf": "pdf",
                "text/csv": "csv",
            } as Record<string, Doc<'files'>["type"]>;

        try {

            await createFile({
                name: values.title,
                fileId: storageId,
                orgId,
                type: types[fileType],
            });
            form.reset();

            setIsFileDialogOpen(false);

            toast({
                variant: "success",
                title: "File Uploaded",
                description: "Every on can on your organization can view this file.",
            });
        } catch (err) {
            toast({
                variant: "destructive",
                title: "something went wrong",
                description: "You file couldn't be uploaded.",
            });

        }

    }

    //console.log(organization?.id);
    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
    const files = (api.files.getFiles, orgId ? { orgId } : "skip");

    const createFile = useMutation(api.files.createFiles);

    return (

        <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen);
            form.reset();
        }}
        >
            <DialogTrigger asChild>
                <Button >
                    Upload File
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-8">Upload Your File Here</DialogTitle>
                    <DialogDescription>

                        <div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    The title of your file.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>File</FormLabel>
                                                <FormControl>
                                                    <Input type="file" {...fileRef}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-1">
                                        {form.formState.isSubmitting && (
                                            <Loader2 className=" h-4 w-4 animate-spin" />
                                        )}Submit</Button>
                                </form>
                            </Form>
                        </div>

                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>


    );
}
