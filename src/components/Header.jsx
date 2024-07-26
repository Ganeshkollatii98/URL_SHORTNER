import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkIcon, LogOut } from 'lucide-react'
import { UrlState } from '@/context/context'
import useFetch from '@/hooks/use-fetch'
import { Logout } from '@/db/apiAuth'
import { BarLoader } from 'react-spinners'



const Header = () => {

    const navigate = useNavigate();
    let { user, fetchUser } = UrlState();
    let { loading, fn: logoutFn } = useFetch(Logout)
    console.log('Header', user)

    const handleLogout = () => {
        logoutFn().then(() => {
            fetchUser();
            navigate('/')
        })
    }

    return (
        <>
            <nav className='flex justify-between p-6 items-center'>
                <Link to={'/'}>
                    <img src='/logo2.png' alt='Trimmr' className='h-16' />
                </Link>
                <div>
                    {!user ?
                        <Button onClick={() => navigate('/auth')}>Login</Button> :
                        <DropdownMenu>
                            <DropdownMenuTrigger className='w-10 overflow-hidden rounded-full'><Avatar>
                                <AvatarImage src={user?.user_metadata?.profile_pic} />
                                <AvatarFallback>T</AvatarFallback>
                            </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>{user?.user_metadata?.name}</DropdownMenuItem>
                                <DropdownMenuItem><Link to={'/dashboard'} className='flex'><LinkIcon className='mr-2 h-4 w-4' /> My Links</Link></DropdownMenuItem>
                                <DropdownMenuItem className='text-red-400' onClick={() => handleLogout()}>
                                    <LogOut className='mr-2 h-4 w-4' ></LogOut><span>Logout</span></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    }
                </div>
            </nav>
            {loading && <BarLoader className='mb-4' width={"100%"} color="#36d7b7" />}
        </>
    )
}

export default Header