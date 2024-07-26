import { storeClicks } from '@/db/apiCliks'
import { getLongUrl } from '@/db/apiUrls'
import useFetch from '@/hooks/use-fetch'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

const RedirectLink = () => {
  let { id } = useParams()
  let { loading, data, fn: fnGetLongUrl } = useFetch(getLongUrl, id);

  let { loading: loadingStoreClicks, fn: fnStats } = useFetch(storeClicks, { id: data?.id, originalUrl: data?.original_url })

  useEffect(() => {
    fnGetLongUrl();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading])

  if (loading || loadingStoreClicks) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    )
  }
  return null;
}

export default RedirectLink