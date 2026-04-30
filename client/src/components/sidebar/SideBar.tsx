import { useState } from "react";
import { SideBarMenu } from "./SideBarMenu";
import { UserButton } from "../user/UserButton";
import { UserMenu } from "../user/UserMenu";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Menu, X } from "lucide-react";

export function SideBar(){

    const [isOpen, setIsOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    return (
        <div className="w-full md:w-60 md:h-screen md:fixed md:top-0 md:left-0 flex flex-col md:p-[50px]">
            {/* Top bar — logo always visible, hamburger only on mobile */}
            <div className="flex items-center justify-between p-5 md:p-0">
                <Link to="/dashboard" className="block rounded-lg transition-opacity duration-200 hover:opacity-75">
                    <img src={logo} alt="logo" className="w-28 h-auto object-contain md:pb-[30px] md:w-32"/>
                </Link>
                {/* user button */}
                <button
                    className="md:hidden p-2 rounded-lg text-muted-fg hover:bg-surface-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Collapsible content — hidden on mobile until toggled, always visible on desktop */}
            <div className={`${isOpen ? "flex" : "hidden"} md:flex flex-col flex-1 px-5 pb-5 md:px-0 md:pb-0`}>
                <SideBarMenu />

                {/* User button — mobile only, sits at the bottom of the open drawer */}
                <div className="md:hidden mt-auto pt-4 border-t border-border relative">
                    <UserButton isOpen={isUserOpen} setIsOpen={setIsUserOpen} />
                    {isUserOpen && <UserMenu />}
                </div>
            </div>
        </div>
    );
}
