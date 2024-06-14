import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton, UserProfile } from "@clerk/nextjs";
import Image from "next/image";

export function Header() {
    return (<div className="border-b py-4 bg-gray-50">
        <div className="items-center container mx-auto justify-between flex">
            <div className="flex gap-2 items-center"><Image src="/logo.png" width="80" height="80" alt="file drive logo" /> My PHR</div>
            <div className="flex gap-2">
                <OrganizationSwitcher />
                <UserButton />

            </div>
        </div>
    </div>

    );
}