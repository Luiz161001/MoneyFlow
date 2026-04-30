import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "./sidebar/SideBar";
import { UserButton } from "./user/UserButton";
import { UserMenu } from "./user/UserMenu";

export function AppLayout() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col md:block">
            <SideBar />
            {/* main component, this is where I defined the layout of the app! */}
            <div className="relative flex-1 md:ml-60 md:pt-[50px]">
                {/* the user button */}
                <div className="absolute top-4 right-4 hidden md:block">
                    <UserButton isOpen={isOpen} setIsOpen={setIsOpen} />
                    {isOpen && <UserMenu />}
                </div>
                <Outlet />
            </div>
        </div>
    );
}
