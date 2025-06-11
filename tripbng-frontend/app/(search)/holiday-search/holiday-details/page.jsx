"use client";

import Image from 'next/image';
import React, { useState } from 'react';

const HotelPage = () => {
  const [date, setDate] = useState('');
  const [pax, setPax] = useState('2 Adults, 0 Child');
  const [isPaxEditing, setIsPaxEditing] = useState(false);
  const [newPax, setNewPax] = useState(pax); 

  const hotel = {
    name: 'Andaman Beach',
    description: 'A beautiful beachfront resort offering a relaxing stay with amazing views of the Andaman Sea.',
    images: [
      '/holiday/holiday-details/holiday1.jpg',
      '/holiday/holiday-details/holiday2.jpg',
      '/holiday/holiday-details/holiday3.jpg',
      '/holiday/holiday-details/holiday4.jpg',
      '/holiday/holiday-details/holiday5.jpg',
      '/holiday/holiday-details/holiday6.jpg',
      '/holiday/holiday-details/holiday7.jpg',
      '/holiday/holiday-details/holiday8.jpg',
      '/holiday/holiday-details/holiday9.jpg',
    ],
  };

  const itinerary = [
    {
      day: 'Day 1',
      date: '02-02-2025',
      description: 'Airport Pickup. Later visit Cellular Jail and Light and Sound Show',
    },
    {
      day: 'Day 2',
      date: '03-02-2025',
      description: 'Port Blair to Havelock in Cruise. Later Radhanagar Beach visit Until Sunset',
    },
    {
      day: 'Day 3',
      date: '04-02-2025',
      description: 'Elephant Beach Trip with Boat Ride. Later Havelock to Port Blair in Cruise',
    },
    {
      day: 'Day 4',
      date: '05-02-2025',
      description: 'Drop to the Airport',
    },
  ];

  const hotels = [
    {
      location: 'Port Blair',
      name: 'J Hotel, Marina Manor, Driftwood Hotel, The Pearl Hotel, The White Coral Hotel, Horizon Hues, Sri KPN Hotel Or Similar',
      dates: 'Sun, 02-02-2025 - Tue, 04-02-2025',
      nights: '2',
      roomType: 'Standard',
      mealPlan: 'Breakfast Only [CP]',
      rating: 3,
      image: '/holiday/holiday-details/hotel.jpg',
    },
    {
      location: 'Havelock',
      name: 'Shangrilas Beach Resort, Golden Pebbles, Radhakrishna Resort, Blue Bird Resort Or Similar',
      dates: 'Tue, 04-02-2025 - Wed, 05-02-2025',
      nights: '1',
      roomType: 'Standard',
      mealPlan: 'Breakfast Only [CP]',
      rating: 3,
      image: '/holiday/holiday-details/hotel.jpg',
    },
  ];


  const defaultImage = '/holiday/holiday-details/activity.jpg';

const activities = [
  {
    description:
      'Accommodation in rooms as given at hotels in Port Blair—Havelock and Neil on Double or triple sharing basis.',
  },
  {
    description: 'Meal Plan: CPAI (Room + Breakfast).',
  },
  {
    description: 'Assistance at all arrival and departure points.',
  },
  {
    description:
      'Sightseeing in private air-conditioned vehicles as per the itinerary at Port Blair—Havelock and Neil, including Airport Pick up and Drop.',
  },
  {
    description:
      'All side ferry charges Included - Port Blair - Havelock - Neil -   Port Blair. By Maccruzz, Nautika, Green Ocean.',
  },
  {
    description: 'Sightseeing as per the itinerary.',
  },
  {
    description: 'Travel assistance by Mytourguru Experts in all the islands.',
  },
];
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handlePaxEdit = () => {
    setIsPaxEditing(true);
  };

  const handleNewPaxChange = (e) => {
    setNewPax(e.target.value);
  };

  const handlePaxUpdate = () => {
    setPax(newPax);
    setIsPaxEditing(false);
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{hotel.name}</h1>
      <p className="mt-2 text-gray-600">{hotel.description}</p>

      <div className="w-full">
        <div className="grid grid-cols-3 gap-4 mt-4">
          {hotel.images.slice(0, 3).map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Hotel Image ${index + 1}`}
              className="rounded-lg object-cover"
              style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
            />
          ))}
        </div>
        <div className="grid grid-cols-6 gap-4 mt-4">
          {hotel.images.slice(3).map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Hotel Image ${index + 4}`}
              className="rounded-lg object-cover"
              style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
            />
          ))}
        </div>
      </div>
      <div className="flex mt-8">
        <div className="w-3/4 p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-bold">Day Wise Itinerary</h2>
          <ul className="mt-4">
            {itinerary.map((item, index) => (
              <li key={index} className="mb-4">
                <div className="flex items-center">
                  <div className="w-1/6 text-yellow font-bold">{item.day}</div>
                  <div className="w-1/6 text-gray-500">{item.date}</div>
                  <div className="w-4/6 text-gray-700">{item.description}</div>
                </div>
                {index < itinerary.length - 1 && (
                  <hr className="my-4 border-gray-300" />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-1/4 p-6 ml-4 border border-gray-300 rounded-lg shadow-md bg-white">
          <h2 className="text-lg font-semibold mb-4 text-yellow">Booking Details</h2>

          <div className="mb-4 relative">
            <p className="text-sm text-gray-600 absolute left-2 top-1 text-yellow">Select your date</p>
            <div className="flex items-center border border-yellow rounded-lg bg-gray-100 p-6">
              <i className="fas fa-calendar-alt text-yellow mr-2"></i>
              <input
                type="date"
                className="bg-gray-100 outline-none w-full text-l text-yellow pl-8"
                value={date}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className="mb-4 relative">
            <p className="text-sm text-gray-600 absolute left-2 top-1 text-yellow">Pax</p>
            <div className="flex items-center border rounded-lg  bg-gray-100 p-6">
              <i className="far fa-user text-yellow-500 mr-2"></i>
              <input
                type="text"
                value={pax}
                className="bg-gray-100 outline-none w-full text-l text-yellow pl-8"
                readOnly
              />
              <button
                className="text-yellow text-m ml-auto"
                onClick={handlePaxEdit}
              >
                Edit
              </button>
            </div>
          </div>

        {isPaxEditing && (
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Edit Pax</h3>
            <input
              type="text"
              value={newPax}
              onChange={handleNewPaxChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            <button
              className="bg-yellow text-white p-2 rounded-lg"
              onClick={handlePaxUpdate}
            >
              Update
            </button>
            <button
              className="ml-4 bg-gray-500 text-white p-2 rounded-lg"
              onClick={() => setIsPaxEditing(false)}
            >
              Cancel
            </button>
          </div>
        )}
          <hr className="my-4 border-gray-300" />
          <div className="mb-4 flex justify-between items-center">
            <p className="text-lg font-bold text-yellow">Total Amount:</p>
            <div className="text-right">
              <p className="text-lg font-bold text-yellow">INR 13,000</p>
              <p className="text-xs text-gray-500">Per Person</p>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />
          <button className="mt-4 w-full p-4 border-2 border-yellow text-yellow rounded-lg text-sm font-medium">
            <i className="fas fa-download mr-2"></i>Download Quotation
          </button>
        </div>
      </div>

      <div className="mt-8 w-3/4">
        <div className="border rounded-lg shadow-md bg-white mb-4 relative overflow-hidden">
          <h2 className="text-xl font-bold">Hotels</h2>
          <hr className="my-4 border-gray-300" />
          <div className="absolute top-14 left-0 bg-yellow text-white px-3 py-1 rounded-br-lg text-sm font-bold">
            Port Blair
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row mb-4">
              <div className="w-1/4">
                <Image
                  src={hotels[0].image}
                  alt="Port Blair Hotel"
                  className="object-cover h-full w-full rounded-l-lg"
                />
              </div>
              <div className="w-3/4 p-4">
                <h3 className="text-xl font-bold mb-2">{hotels[0].name}</h3>
                <div className="text-gray-500 mb-4">
                  <div className="flex items-center">
                    {/* <i className="far fa-calendar-alt mr-2"></i> */}
                    <span>{hotels[0].dates}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <i className="far fa-moon mr-2"></i>
                    <span>Nights: {hotels[0].nights}</span>
                  </div>
                </div>
                <div className="bg-gray-200 p-4 rounded-lg mb-4">
                  <div className="text-gray-600">
                    <p>
                      Room Type: <span className="font-medium">{hotels[0].roomType}</span>
                    </p>
                    <p>
                      Meal Plan: <span className="font-medium">{hotels[0].mealPlan}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(hotels[0].rating)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 mr-1"></i>
                  ))}
                  {[...Array(5 - hotels[0].rating)].map((_, i) => (
                    <i key={i} className="far fa-star text-gray-300 mr-1"></i>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-row relative">
              <div className="absolute top-2 left-2 bg-yellow text-white px-3 py-1 rounded-br-lg text-sm font-bold">
                {hotels[1].location}
              </div>
              <div className="w-1/4">
                <Image
                  src={hotels[1].image}
                  alt="Havelock Island Hotel"
                  className="object-cover h-full w-full rounded-l-lg"
                />
              </div>
              <div className="w-3/4 p-4 relative">
                <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-br-lg text-sm font-bold">
                  {hotels[1].name}
                </div>

                <h3 className="text-xl font-bold mb-2 mt-6">{hotels[1].name}</h3>
                <div className="text-gray-500 mb-4">
                  <div className="flex items-center">
                    {/* <i className="far fa-calendar-alt mr-2"></i> */}
                    <span>{hotels[1].dates}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <i className="far fa-moon mr-2"></i>
                    <span>Nights: {hotels[1].nights}</span>
                  </div>
                </div>
                <div className="bg-gray-200 p-4 rounded-lg mb-4">
                  <div className="text-gray-600">
                    <p>
                      Room Type: <span className="font-medium">{hotels[0].roomType}</span>
                    </p>
                    <p>
                      Meal Plan: <span className="font-medium">{hotels[0].mealPlan}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(hotels[1].rating)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 mr-1"></i>
                  ))}
                  {[...Array(5 - hotels[1].rating)].map((_, i) => (
                    <i key={i} className="far fa-star text-gray-300 mr-1"></i>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
            <div className="mt-8 w-3/4">
        <div className="p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4">Activity Details</h2>
          <hr className="my-4 border-gray-300" />
          <div className="absolute top-14 left-0 bg-yellow text-white px-3 py-1 rounded-br-lg text-sm font-bold">
            Port Blair
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-16 h-16">
                  <Image
                    src={activity.image || defaultImage}
                    alt={`Activity ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <ul className="list-disc list-inside pl-6 text-gray-700 text-xl">
                    <li>{activity.description}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

              <div className="mt-8 w-3/4">
            <div className="p-6 border rounded-lg shadow-md bg-white">
              <h2 className="text-2xl font-bold mb-4">Exclusions</h2>
              <hr className="my-4 border-gray-300" />
              <ul className="list-disc list-inside space-y-2 text-gray-500">
                <li className="text-gray-700 text-xl">Personal expenses like shopping, laundry, etc.</li>
                <li className="text-gray-700 text-xl">Any meal other than the mentioned meal plan.</li>
                <li className="text-gray-700 text-xl">Tips and gratuities to drivers and hotel staff.</li>
                <li className="text-gray-700 text-xl">Any kind of insurance (health, travel, etc.).</li>
                <li className="text-gray-700 text-xl">Any items not specifically mentioned in the itinerary.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 w-3/4">
            <div className="p-6 border rounded-lg shadow-md bg-white">
              <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
              <hr className="my-4 border-gray-300" />
              <ul className="list-disc list-inside space-y-2 text-gray-500">
                <li className="text-gray-700 text-xl">In Andaman mobile networks are BSNL, AIRTEL & VODAFONE and no other networks are supported.</li>
                <li className="text-gray-700 text-xl">All foreign nationals and Indians staying abroad holding passport of different countries (PIO/OCI) 
                  needs to register themselves on arrival on Port Blair Airport (Emigration)
                   which should have valid India visa or obtain RAP - Restricted Area Permit, which is valid for 30 days of stay in Andaman’s.</li>
                <li className="text-gray-700 text-xl">Area Permit, which is valid for 30 days of stay in Andaman’s.
                Our executive will hold the placard outside the airport exit gate.</li>
               
              </ul>
            </div>
          </div>

    </div>
  );
};

export default HotelPage;
