'use client'
import React, { useState } from 'react'
import { Container } from '../ui'
import { AllOffers, BusOffers, FlightOffers, HolidayOffers, HotelOffers } from './travel-offer-slider'

const offerTabs = [
  { name: "All Offers", component: AllOffers },
  { name: "Flights", component: FlightOffers },
  { name: "Hotels", component: HotelOffers },
  { name: "Bus", component: BusOffers },
  { name: "Holidays", component: HolidayOffers }
]

export default function OffersCard() {
  const [activeTab, setActiveTab] = useState(offerTabs[0].name)

  return (
    <Container className="p-4 sm:p-6 md:p-8 mt-10">
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 max-w-7xl mx-auto'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug -ml-5'>
          <span className='text-yellow'>OFFERS</span> makes Trips Cheaper
        </h2>
      </div>

      <div className='bg-white rounded-xl p-4 md:p-6 mt-6 md:mt-8'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex flex-wrap gap-3 sm:gap-4'>
            {offerTabs.map(({ name }) => (
              <button
                key={name}
                className={`text-sm sm:text-base font-medium flex items-center gap-2 border-b-2 sm:border-b-4 pb-1 sm:pb-2 transition-all duration-200 ${
                  activeTab === name
                    ? 'border-blue text-blue'
                    : 'border-transparent hover:border-gray-300 text-gray-700'
                }`}
                onClick={() => setActiveTab(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <button className='text-sm sm:text-base font-semibold text-yellow hover:underline transition-colors'>
            VIEW ALL
          </button>
        </div>
      </div>
      <div className="mt-6 md:mt-8">
        {offerTabs.find(tab => tab.name === activeTab)?.component()}
      </div>
    </Container>
  )
}
