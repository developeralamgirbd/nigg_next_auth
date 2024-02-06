import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import SignOut from "./ui/signout"


export async function SiteHeader() {
    const session = await getServerSession(authOptions);
    
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <MainNav 
                
                items={session ? siteConfig.authMainNav : siteConfig.mainNav } 
                
                />
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-1">
                        <Link
                            href={siteConfig.links.linkedin}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div
                                className={buttonVariants({
                                    size: "sm",
                                    variant: "ghost",
                                })}
                            >
                                <Icons.linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </div>
                        </Link>
                        <Link
                            href={siteConfig.links.twitter}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div
                                className={buttonVariants({
                                    size: "sm",
                                    variant: "ghost",
                                })}
                            >
                                <Icons.twitter className="h-5 w-5 fill-current" />
                                <span className="sr-only">Twitter</span>
                            </div>
                        </Link>
                        <div>
                            
                                {
                                    session?.user ? <SignOut /> :"User"  
                                }

                            
                        </div>
                        {/* <ThemeToggle /> */}

                        <Link
                            href={'/signin'}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div
                                className={buttonVariants({
                                    size: "sm",
                                    variant: "ghost",
                                })}
                            >
                                {/*<Icons.twitter className="h-5 w-5 fill-current" />*/}
                                <span className="sr-only">Sign In</span>
                            </div>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
