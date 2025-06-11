'use client'

import React, { useState } from 'react'

export default function Yatch() {
  const [isRoundSelect, setIsRoundSelect] = useState("")

  const handleSelectTrip = (id) => {
    console.log(id)
  }
  const round = ["One Way", "Round Trip", "Multiple City"]

  return (
    <div className='bg-white p-8 rounded-xl'>
      <div className="flex mb-6 space-x-4">
        {round.map((el, i) => (
          <button key={i} className={`text-sm bg-yellow/10 rounded-full px-2 py-1  flex items-center gap-2 font-light ${isRoundSelect ? "" : ""}`} onClick={handleSelectTrip}>
            <span className={`h-4 w-4 bg-yellow rounded-full block ${isRoundSelect ? "" : ""}`}></span>
            <span>{el}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">From</label>
          <input
            type="text"
            value="Ahmedabad"
            readOnly
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700">To</label>
          <input
            type="text"
            value="Phuket"
            readOnly
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Departure</label>
          <input
            type="date"
            value="2024-08-28"
            readOnly
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700">Return</label>
          <input
            type="text"
            placeholder="Choose Return date & Get bigger discount"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Travelers & Class</label>
          <input
            type="text"
            value="2 Travelers, Economy/Premium Economy"
            readOnly
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <input type="radio" id="regular" name="fare" checked className="mr-2" />
          <label htmlFor="regular" className="text-gray-700">Regular</label>
        </div>
        <div className="flex items-center">
          <input type="radio" id="senior" name="fare" className="mr-2" />
          <label htmlFor="senior" className="text-gray-700">Senior Citizen</label>
        </div>
        <div className="flex items-center">
          <input type="radio" id="armed" name="fare" className="mr-2" />
          <label htmlFor="armed" className="text-gray-700">Armed Forces</label>
        </div>
        <div className="flex items-center">
          <input type="radio" id="doctor" name="fare" className="mr-2" />
          <label htmlFor="doctor" className="text-gray-700">Doctor and Nurses</label>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="bg-yellow text-white py-2 px-6 rounded-lg">Search</button>
      </div>
    </div>
  )
}
