import Resautrants from '@/components/Restaurants'
import Featured from '@/components/Featured'
import Offer from '@/components/Offer'
import  GoogleMap  from '@/components/GoogleMap'
import Slider from '@/components/Slider'

export default function Home() {
  return (
    <main>
      <Slider/>
      <h1 className='text-center text-red-600 font-black text-6xl p-4'>Restaurants</h1>
      <GoogleMap/>
      <Resautrants/>
      <h1 className='text-center text-red-600 font-black text-6xl p-4'>Featured</h1>
      <Featured/>
      <Offer/>
    </main>
  )
}
