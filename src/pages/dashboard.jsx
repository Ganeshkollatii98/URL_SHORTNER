import { CreateLink } from '@/components/create-link'
import Error from '@/components/error'
import LinkCard from '@/components/LinkCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { UrlState } from '@/context/context'
import { getClicksForUrls } from '@/db/apiCliks'
import { getUrls } from '@/db/apiUrls'
import useFetch from '@/hooks/use-fetch'
import { Filter } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'

const Dashboard = () => {
  let [searchQuery, setSearchQuery] = useState('')
  let { user } = UrlState()
  let { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user.id)
  let { loadingClicks, data: clicks, fn: fnLinks } = useFetch(getClicksForUrls, urls?.map((url) => url.id))

  useEffect(() => {
    fnUrls();
  }, [])

  const filteredUrls = urls?.filter((url) =>
    url?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (urls?.length) {
      fnLinks();
    }
  }, [urls?.length])

  return (
    <div className='flex flex-col gap-8'>
      {(loading || loadingClicks) && <BarLoader className='mb-4' width={"100%"} color="#36d7b7" />}

      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className='flex justify-between'>
        <h1 className='text-4xl font-extrabold'> My Links</h1>
        <CreateLink/>
      </div>

      <div className='relative'>
        <Input type="text" placeholder="Filter Links..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Filter className='absolute top-2 right-2 p-1' />
      </div>

      {error && <Error message={error.message}></Error>}

      {
        (filteredUrls || [] ).map((url, i) => {
          return <LinkCard key={i} url={url} fnUrls={fnUrls} />
        })
      }

    </div>
  )
}

export default Dashboard