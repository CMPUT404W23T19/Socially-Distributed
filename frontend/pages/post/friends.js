import React from 'react'
import TopNavigation from '../TopNavigation'
import SideNav from '../../components/SideNav'

export default function Friends() {
  return (
    <div>
      <TopNavigation />
      <SideNav />
      <div className='mt-20 ml-40'>
        <h1 className="text-3xl font-bold mt-10 mb-5 ml-5">See What Your Friends Are Up to!</h1>
        
      </div>
    </div>
  )
}
