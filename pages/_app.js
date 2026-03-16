import '../styles/globals.css'
import AppLayout from '../components/layout/AppLayout'

export default function App({ Component, pageProps }) {
  // Pages can opt out of AppLayout by setting getLayout
  const getLayout = Component.getLayout || ((page) => <AppLayout>{page}</AppLayout>)
  return getLayout(<Component {...pageProps} />)
}
