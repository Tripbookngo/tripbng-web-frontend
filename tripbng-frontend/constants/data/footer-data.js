import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export const FooterData = {
  travelTourism: {
    title: "Travel & Tourism",
    links: [
      { text: "Travel Blog", url: "/travel-blog" },
      { text: "Subscribe for Offers", url: "/subscribe" },
      { text: "Testimonials", url: "/testimonials" },
    ]
  },
  services: {
    title: "Services",
    links: [
      { text: "Flight", url: "/flight", icon: "/icons/flights_icon.png" },
      { text: "Hotel", url: "/hotel", icon: "/icons/hotels_icon.png" },
      { text: "Bus", url: "/bus", icon: "/icons/bus_icon.png" },
      { text: "Holiday", url: "/holiday", icon: "/icons/holiday_icon.png" },
      { text: "Visa", url: "/visa", icon: "/icons/visa_icon.png" },
    ]
  },
  supportHelp: {
    title: "Support & Help",
    links: [
      { text: "Become a Partner", url: "/become-partner" },
      { text: "Contact Us", url: "/contact" },
      { text: "About Us", url: "/about" }
    ]
  },
  contactInfo: {
    title: "Contact Info",
    details: [
        {
          label: "Email",
          value: "info@tripbng.com",
          icon: <FaEnvelope />
        },
        {
          label: "Phone",
          value: "+91 9904956474",
          icon: <FaPhoneAlt />
        },
        {
          label: "Address",
          value: "841,The spire 2,150 FT.Ring Road,Near Shitalpark,Rajkot-360006,Gujarat-360007",
          icon: <FaMapMarkerAlt />
        }
      ]
      
  }
};
