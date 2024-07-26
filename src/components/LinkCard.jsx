import { Copy, Delete, Download, LinkIcon, Trash } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import useFetch from '@/hooks/use-fetch'
import { BeatLoader } from 'react-spinners'
import { deleteUrl } from '@/db/apiUrls'
import { TRIMMR_URL } from '@/const'

const LinkCard = ({ url, fnUrls }) => {

    const downloadImage = () => {
        console.log('click')
        const imageUrl = url?.qr;
        const fileName = url?.title;

        const anchor = document.createElement('a');
        anchor.href = imageUrl;
        anchor.download = fileName;

        document.body.appendChild(anchor);

        anchor.click()
        document.body.removeChild(anchor);

    }

    const { loading, error, fn: fnDelete } = useFetch(deleteUrl, url?.id)
    return (
        <div className='flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg'>
            <img src={url?.qr} className='h-32 object-contain ring  ring-blue-500 self-start' alt='QR code' />
            <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
                <span className="text-3xl font-extrabold hover:underline cursor-pointer">
                    {url?.title}
                </span>
                <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
                {TRIMMR_URL}{url?.custom_url ? url?.custom_url : url.short_url}
                </span>
                <span className="flex items-center gap-1 hover:underline cursor-pointer">
                    <LinkIcon className="p-1" />
                    {url?.original_url}
                </span>
                <span className="flex items-end font-extralight text-sm flex-1">
                    {new Date(url?.created_at).toLocaleString()}
                </span>
            </Link>
            <div className='flex gap-2'>
                <Button variant='ghost' onClick={() => navigator.clipboard.writeText(`${TRIMMR_URL}${url?.short_url}`)}><Copy /></Button>
                <Button variant='ghost' onClick={() => downloadImage()}><Download /></Button>
                <Button variant='ghost' onClick={() => { fnDelete().then(() => fnUrls()) }}>
                    {loading ? <BeatLoader size={10} color='#36d7b7' /> : <Trash />}
                </Button>
            </div>
        </div>
    )
}

export default LinkCard