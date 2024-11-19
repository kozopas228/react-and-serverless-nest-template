import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/shadcn/components/ui/sheet';
import { Button } from '@/shadcn/components/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from '@/shadcn/components/ui/navigation-menu';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import reactLogo from '../../assets/react.svg';
import React from 'react';
import { ModeToggle } from '@/shadcn/components/mode-toggle.tsx';

export default function Header() {
    const str =
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque deserunt ex facere ipsa ipsum laboriosam laudantium libero molestiae, nam necessitatibus placeat quibusdam quos rerum saepe totam unde velit? Architecto atque eaque esse expedita quae ut veniam voluptatibus! Ipsam laborum mollitia nam quia sequi! At atque eius laborum magnam modi placeat quidem unde vero! Accusamus accusantium alias aut ducimus, esse fugiat itaque, libero magni nemo nihil odit perspiciatis praesentium quae quos repellat sint sit suscipit vitae! Aliquam culpa deserunt dicta dignissimos ducimus non reiciendis soluta tempore voluptas. Adipisci consectetur eum ut? Commodi eveniet ipsa magnam nobis quam ut vero vitae voluptatem!';

    return (
        <header className='sticky top-0 z-10 w-full shrink-0 bg-background'>
            <div className='container mx-auto flex h-20 shrink-0 items-center px-4 md:px-6'>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            className='lg:hidden'>
                            <Menu className='h-6 w-6' />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side='left'>
                        <NavLink to='/'>
                            <img
                                src={reactLogo}
                                className='h-6 w-6'
                                alt='logo'
                            />
                            <span className='sr-only'>ShadCN</span>
                        </NavLink>
                        <div className='grid gap-2 py-6'>
                            <SheetClose asChild>
                                <NavLink
                                    to='/'
                                    className='flex w-full items-center py-2 text-lg font-semibold'>
                                    Home
                                </NavLink>
                            </SheetClose>
                            <SheetClose asChild>
                                <NavLink
                                    to='/about'
                                    className='flex w-full items-center py-2 text-lg font-semibold'>
                                    About
                                </NavLink>
                            </SheetClose>
                        </div>
                    </SheetContent>
                </Sheet>
                <NavLink
                    to='/'
                    className='mr-6 hidden lg:flex'>
                    <img
                        src={reactLogo}
                        className='h-6 w-6'
                        alt='logo'
                    />
                </NavLink>
                <NavigationMenu className='hidden lg:flex'>
                    <NavigationMenuList>
                        <NavigationMenuLink asChild>
                            <NavLink to='/'>
                                <Button variant={'ghost'}>Home</Button>
                            </NavLink>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                            <NavLink to='/about'>
                                <Button variant={'ghost'}>About</Button>
                            </NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className='ml-auto flex gap-2'>
                    <Button variant='outline'>Sign in</Button>
                    <Button>Sign Up</Button>
                    <div className={'lg:ml-8'}>
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
