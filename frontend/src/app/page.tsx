'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken } from './services/api.service'
import { Loader2 } from 'lucide-react'
import { delay } from '@/lib/utils'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken()

        await delay(700)
        
        if (token) {
          router.push('/workflow')
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
    // We can safely disable the exhaustive-deps rule here since we only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {isLoading && <Loader2 className="h-8 w-8 animate-spin duration-100" />}
    </div>
  )
}
