'use client'

import { AppConfig, UserSession } from '@stacks/connect'
import { StacksProvider } from '@stacks/connect-react'

const appConfig = new AppConfig(['store_write', 'publish_data'])
export const userSession = new UserSession({ appConfig })

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StacksProvider appConfig={appConfig}>
      {children}
    </StacksProvider>
  )
}

