"use client";

import React from "react";
import Button from "@/components/ui/button";
import Image from "next/image";

export default function WebCheckIn() {
  const domesticAirlines = [
    {
      name: "IndiGo Airline",
      logo: "indigo.png",
      checkInUrl:
        "https://www.goindigo.in/web-check-in.html?linkNav=check-in_Header~Check-In",
    },
    {
      name: "Akasa Air",
      logo: "akasa.png",
      checkInUrl: "https://www.akasaair.com/en/check-in",
    },
    {
      name: "Air India Express",
      logo: "airindiaexpress.png",
      checkInUrl: "https://www.airindiaexpress.com/checkin-home",
    },
    {
      name: "SpiceJet Airlines ",
      logo: "spicejet.png",
      checkInUrl: "https://www.spicejet.com/#checkin",
    },
    {
      name: "Air India ",
      logo: "airindia.png",
      checkInUrl: "https://www.airindia.com/in/en/manage/web-checkin.html",
    },
    {
      name: "Vistara Airlines ",
      logo: "vistara.png",
      checkInUrl:
        "https://www.airvistara.com/in/en/travel-information/vistara-experience/on-ground/check-in/web-check-in",
    },
    {
      name: "Alliance Air ",
      logo: "alliance.png",
      checkInUrl: "https://bookme.allianceair.in/web-checkin",
    },
    {
      name: "Star Air ",
      logo: "starair.png",
      checkInUrl: "https://ibook.starair.in/web-checkin",
    },
    {
      name: "Fly91 Airlines ",
      logo: "fly91.png",
      checkInUrl: "https://fly91.in/edit-booking",
    },
    {
      name: "Flybig Airlines ",
      logo: "flybig.png",
      checkInUrl: "https://flybig.in/check-in",
    },
  ];

  const internationalAirlines = [
    {
      name: "Emirates ",
      logo: "emirates.png",
      checkInUrl:
        "https://www.emirates.com/english/manage-booking/online-check-in/",
    },
    {
      name: "Thai Airways ",
      logo: "thai.png",
      checkInUrl:
        "https://www.thaiairways.com/en_SA/before_you_fly/check_in/i_checkin.page",
    },
    {
      name: "Ethihad Airways ",
      logo: "ethihad.png",
      checkInUrl: "https://www.etihad.com/en/manage/check-in",
    },
    {
      name: "Thai Air Asia ",
      logo: "thaiair.png",
      checkInUrl: "https://www.thaiairways.com/en_IN/manage/i_checkin.page?",
    },
    {
      name: "AirAsia International ",
      logo: "thaiair.png",
      checkInUrl: "https://www.airasia.com/check-in/v2/en/gb",
    },
    {
      name: "AirAsia X ",
      logo: "thaiair.png",
      checkInUrl: "https://www.airasia.com/check-in/v2/en/gb",
    },
    {
      name: "Indonesia Airsia ",
      logo: "indonesia.png",
      checkInUrl: "https://www.airasia.com/check-in/v2/en/gb",
    },
    {
      name: "Saudi Arabian Airlines ",
      logo: "saudi.png",
      checkInUrl:
        "https://www.saudia.com/en-IN/checkIn/checkInoverview/checkInStandAlone",
    },
    {
      name: "Gulf Air ",
      logo: "gulf.png",
      checkInUrl:
        "https://dxcheckin.gulfair.com/dx/GFCI/#/check-in/start?locale=en-US",
    },
    {
      name: "Vietjet ",
      logo: "vietjet.png",
      checkInUrl: "https://www.vietjetair.com/en/checkin",
    },
    {
      name: "Air Arabia",
      logo: "airarabia.png",
      checkInUrl:
        "https://webcheckin.airarabia.com/accelaero/en/index.html#/en",
    },
    {
      name: "Qatar Airways ",
      logo: "qatar.png",
      checkInUrl: "https://cki.qatarairways.com/cki/dashboard?iid=ALL81255230",
    },
    {
      name: "Fly Dubai ",
      logo: "flydubai.png",
      checkInUrl:
        "https://www.flydubai.com/en/flying-with-us/check-in/online-check-in/",
    },
    {
      name: "Malindo Air",
      logo: "malindo.png",
      checkInUrl:
        "https://dx.checkin.malindoair.com/dx/ODCI/#/check-in/start?locale=en-US",
    },
    {
      name: "Salam Air ",
      logo: "salam.png",
      checkInUrl: "https://webcheckin.info/salamair/check-in",
    },
    {
      name: "Egypt Air ",
      logo: "egypt.png",
      checkInUrl: "https://digital.egyptair.com/ssci/identification",
    },
    {
      name: "Thai Lion Air ",
      logo: "thailion.png",
      checkInUrl: "https://www.lionairthai.com/en/Flight/Web-Checkin",
    },
    {
      name: "Oman Air ",
      logo: "oman.png",
      checkInUrl: "https://services.omanair.com/gbl/en/check-in?",
    },
    {
      name: "Malaysia Airlines ",
      logo: "malaysia.png",
      checkInUrl:
        "https://www.malaysiaairlines.com/hq/en/travel-info/check-in.html",
    },
    {
      name: "Cathay Pacific Airlines ",
      logo: "cathay.png",
      checkInUrl: "https://www.cathaypacific.com/mb/#!/en_IN/olci/login",
    },
    {
      name: "Turkish Airlines",
      logo: "turkish.png",
      checkInUrl: "https://www.turkishairlines.com/en-us/index.html",
    },
    {
      name: "Flynas Airline ",
      logo: "flynas.png",
      checkInUrl: "https://booking.flynas.com/#/wci/search?lang=en-US",
    },
    {
      name: "Kuwait Airways ",
      logo: "kuwait.png",
      checkInUrl: "https://www.kuwaitairways.com/en/online-check-in",
    },
    {
      name: "SriLankan Airlines ",
      logo: "srilankan.png",
      checkInUrl: "https://www.srilankan.com/online-checkin",
    },
    {
      name: "Singapore Airlines ",
      logo: "singapore.png",
      checkInUrl:
        "https://www.singaporeair.com/en_UK/plan-and-book/your-booking/checkin/",
    },
    {
      name: "Scoot Airways ",
      logo: "scoot.png",
      checkInUrl: "https://checkin.flyscoot.com/",
    },
    {
      name: "China Southern Airlines ",
      logo: "china.png",
      checkInUrl: "https://www.csair.com/en/tourguide/checkin/checkinservice/",
    },
    {
      name: "Lufthansa Airlines ",
      logo: "lufthansa.png",
      checkInUrl: "https://www.lufthansa.com/us/en/online-check-in",
    },
    {
      name: "Uzbekistan Airways ",
      logo: "urbankistan.png",
      checkInUrl: "https://www.uzairways.com/en/flight-check",
    },
    {
      name: "Biman Bangladesh Airlines ",
      logo: "biman.png",
      checkInUrl: "https://www.biman-airlines.com/#check-in",
    },
    {
      name: "Air Astana Airlines ",
      logo: "airastana.png",
      checkInUrl: "https://airastana.com/global-en#checkin",
    },
    {
      name: "Ethiopian Airlines ",
      logo: "ethiopian.png",
      checkInUrl:
        "https://www.ethiopianairlines.com/in/book/booking/web-check-in",
    },
    {
      name: "Air Canada Airlines ",
      logo: "aircanada.png",
      checkInUrl: "https://www.aircanada.com/home/ca/en/aco/checkin",
    },
    {
      name: "Hahn Air ",
      logo: "hahn.png",
      checkInUrl: "https://www.hahnair.com/en/airbus",
    },
    {
      name: "Kenya Airways ",
      logo: "kenya.png",
      checkInUrl:
        "https://www.kenya-airways.com/en-in/book-manage/post-booking/check-in/",
    },
    {
      name: "Vietnam Airlines ",
      logo: "vietnam.png",
      checkInUrl:
        "https://www.vietnamairlines.com/us/en/travel-information/check-in/online-check-in",
    },
    {
      name: "American Airlines ",
      logo: "american.png",
      checkInUrl:
        "https://www.aa.com/reservation/flightCheckInViewReservationsAccess.do",
    },
    {
      name: "Virgin Atlantic Airlines ",
      logo: "virginatlantic.png",
      checkInUrl: "https://www.virginatlantic.com/PCCOciWeb/findBy",
    },
    {
      name: "Air France ",
      logo: "airfrance.png",
      checkInUrl: "https://wwws.airfrance.in/check-in",
    },
    {
      name: "British Airways ",
      logo: "british.png",
      checkInUrl:
        "https://www.britishairways.com/travel/olcilandingpageauthreq/public/en_in",
    },
    {
      name: "Jazeera Airways ",
      logo: "jazeera.png",
      checkInUrl: "https://www.jazeeraairways.com/en-in",
    },
    {
      name: "United Airlines ",
      logo: "united.png",
      checkInUrl: "https://www.united.com/en/us/checkin",
    },
    {
      name: "US-Bangla Airlines ",
      logo: "us-bangla.png",
      checkInUrl:
        "https://fo-asia.ttinteractive.com/Zenith/FrontOffice/USbangla/en-GB/Home/FindBooking?findbookingmode=WebCheckin?",
    },
    {
      name: "Air New Zealand ",
      logo: "airnew.png",
      checkInUrl: "https://www.airnewzealand.co.nz/online-check-in",
    },
    {
      name: "KLM Royal Dutch Airlines ",
      logo: "klm.png",
      checkInUrl: "https://www.klm.co.in/check-in",
    },
    {
      name: "Air China Limited ",
      logo: "airchina.png",
      checkInUrl: "https://www.airchina.com.cn/en/service/check-in/index.shtml",
    },
    {
      name: "Hong Kong Airlines ",
      logo: "hongkong.png",
      checkInUrl:
        "https://m.hkairlines.com/html_en/checkin/checkin_index.html?toDir=login&toWhere=question",
    },
    {
      name: "LOT Polish Airlines ",
      logo: "lot.png",
      checkInUrl: "https://www.lot.com/in/en/check-in",
    },
    {
      name: "Sas Airline (FlySas) ",
      logo: "sas.png",
      checkInUrl: "https://www.flysas.com/en/checkin/",
    },
    {
      name: "Air Mauritius ",
      logo: "airmauritius.png",
      checkInUrl:
        "https://www.airmauritius.com/en/book-and-manage/new_check-in",
    },
    {
      name: "Air Fiji ",
      logo: "airfiji.png",
      checkInUrl: "https://digital.fijiairways.com/fj/ssci/identification",
    },
    {
      name: "China Eastern ",
      logo: "chinaeasturn.png",
      checkInUrl: "https://us.ceair.com/en/check-in.html",
    },
    {
      name: "Delta Airlines ",
      logo: "delta.png",
      checkInUrl: "https://www.delta.com/apac/en",
    },
    {
      name: "Qantas Airlines ",
      logo: "qantas.png",
      checkInUrl: "https://www.qantas.com/in/en/travel-info/check-in.html",
    },
    {
      name: "Virgin Atlantic ",
      logo: "virginatlantic.png",
      checkInUrl: "https://www.virginatlantic.com/PCCOciWeb/findBy",
    },
    {
      name: "Air Baltic ",
      logo: "airbaltic.png",
      checkInUrl: "https://www.airbaltic.com/en-ZZ/index?opentab=CKI",
    },
    {
      name: "All Nippon Airways ",
      logo: "allnippon.png",
      checkInUrl:
        "https://www.ana.co.jp/en/us/travel-information/online-check-in/",
    },
    {
      name: "Finn Air ",
      logo: "finnair.png",
      checkInUrl: "https://www.finnair.com/en/check-in",
    },
    {
      name: "Korean Air ",
      logo: "korean.png",
      checkInUrl: "https://www.koreanair.com/check-in?hl=en",
    },
    {
      name: "Myanmar Airways ",
      logo: "myanmar.png",
      checkInUrl: "https://maiair.com/",
    },
    {
      name: "Neos Air ",
      logo: "neos.png",
      checkInUrl: "https://us.neosair.com/en/before_the_flight/webcheck-in",
    },
    {
      name: "Swiss Airlines ",
      logo: "swiss.png",
      checkInUrl: "https://www.swiss.com/ke/en/fly/check-in/online-check-in",
    },
    {
      name: "Alitalia Airlines ",
      logo: "alitalia.png",
      checkInUrl: "https://www.ita-airways.com/en_in/check-in-search.html",
    },
    {
      name: "Bangkok Airways ",
      logo: "bangkok.png",
      checkInUrl: "https://www.bangkokair.com/self-check-in",
    },
    {
      name: "Ice Land Air ",
      logo: "iceland.png",
      checkInUrl: "https://www.icelandair.com/support/pre-flight/check-in/",
    },
    {
      name: "Ryan Air ",
      logo: "ryan.png",
      checkInUrl: "https://www.ryanair.com/gb/en/lp/check-in",
    },
  ];

  const handleCheckIn = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white min-h-screen p-6 text-gray-900">
      <div className="flex items-center mb-6 bg-blue-600 p-4 rounded-lg shadow-md">
        <button className="bg-red-500 text-white rounded-full px-4 py-2 mr-4 hover:bg-red-600">
          ←
        </button>
        <h1 className="text-black text-2xl font-bold">Web Check-In</h1>
      </div>

      <h2 className="text-center text-gray-800 text-3xl font-semibold mb-8">
        Airline Web Check-in
      </h2>

      <div className="mb-12">
        <h3 className="text-gray-800 text-xl font-bold mb-4 text-center uppercase">
          Domestic
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {domesticAirlines.map((airline, index) => (
            <div
              className="bg-gray-100 rounded-lg shadow-md p-4 flex flex-col items-center text-center"
              key={index}
            >
              <div className="flex flex-col items-center justify-center w-full mb-4 space-y-4">
                <Image
                  src={`/images/${airline.logo}`}
                  alt={airline.name}
                  className="w-16 h-16 rounded-full"
                />
                <span className="font-medium text-lg">{airline.name}</span>
                <Button
                  onClick={() => handleCheckIn(airline.checkInUrl)}
                  color="primary"
                  size="small"
                  className="flex items-center space-x-3 py-3 px-4"
                >
                  <span className="text-xl">Check In</span>
                  <Image
                    src="/images/arrow-right.png"
                    alt="Arrow"
                    className="ml-2 w-6 h-6"
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-gray-800 text-xl font-bold mb-4 text-center uppercase">
          International
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {internationalAirlines.map((airline, index) => (
            <div
              className="bg-gray-100 rounded-lg shadow-md p-4 flex flex-col items-center text-center"
              key={index}
            >
              <div className="flex flex-col items-center justify-center w-full mb-4 space-y-4">
                <Image
                  src={`/images/${airline.logo}`}
                  alt={airline.name}
                  className="w-16 h-16 rounded-full"
                />
                <span className="font-medium text-lg">{airline.name}</span>
                <Button
                  onClick={() => handleCheckIn(airline.checkInUrl)}
                  color="primary"
                  size="small"
                  className="flex items-center space-x-3 py-3 px-4"
                >
                  <span className="text-xl">Check In</span>
                  <Image
                    src="/images/arrow-right.png"
                    alt="Arrow"
                    className="ml-2 w-6 h-6"
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
