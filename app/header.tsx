import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton, UserProfile } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Header() {
    return (<div className="relative z-10 border-b py-4 bg-gray-50">
        <div className="items-center container mx-auto justify-between flex">
            <Link href="/" className="flex gap-2 items-center font-bold text-l"><Image src="/logo.png" width="50" height="50" alt="file drive logo" /> My PHR
            </Link>
            <></>
            {/* <Button variant={"outline"}>
                <Link href={"/dashboard/files"}>Your Files</Link>
            </Button> */}

            <div className="flex gap-2">
                <OrganizationSwitcher />
                <UserButton />


            </div>

        </div>

    </div>

    );
}