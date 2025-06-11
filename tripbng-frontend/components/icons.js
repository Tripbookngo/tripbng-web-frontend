import {
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  MoveRight,
  Icon,
} from "lucide-react";

export const Icons = {
  earth: "/icons/earth.png",
  boarding: "/icons/boarding.png",
  giftCard: "/icons/gift-card.png",
  people: "/icons/people.png",
  compass: "/icons/compass.png",
  globe: "/icons/globe.png",
  mail: <Mail size={20} />,
  facebook: <Facebook size={20} />,
  instagram: <Instagram size={20} />,
  linkedin: <Linkedin size={20} />,
  arrowRight: <MoveRight size={20} />,
  busColor: "./icons/bus-color.svg",
  busDark: "./icons/bus-dark.svg",
  cruiseColor: "./icons/cruise-color.svg",
  cruiseDark: "./icons/cruise-dark.svg",
  flightColor: "./icons/flight-color.svg",
  flightDark: "./icons/flight-dark.svg",
  hotelColor: "./icons/hotel-color.svg",
  hotelDark: "./icons/hotel-dark.svg",
  passportColor: "./icons/passport-color.svg",
  passportDark: "./icons/passport-dark.svg",
  visaColor: "./icons/visa-color.svg",
  visaDark: "./icons/visa-dark.svg",
};

export function FacebookIcon({ size = 30 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      fill="url(#a)"
      height={size}
      width={size}
    >
      <defs>
      <linearGradient x1="50%" x2="50%" y1="97.078%" y2="0%" id="a">
  <stop offset="0%" stopColor="#0062E0" />
  <stop offset="100%" stopColor="#19AFFF" />
</linearGradient>

      </defs>
      <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
      <path
        fill="#FFF"
        d="m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
      />
    </svg>
  );
}
export function GoogleIcon({ size = 30 }) {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 256 262"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
    >
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </svg>
  );
}

export function FlightVector() {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.2793 8.53387L1.7793 6.53387L0.279297 6.53387L1.2793 10.0339L0.279296 13.5339L1.7793 13.5339L3.2793 11.5339L8.7793 11.5339L6.2793 19.5339L8.2793 19.5339L13.2793 11.5339L18.7793 11.5339C19.6093 11.5339 20.2793 10.8639 20.2793 10.0339C20.2793 9.20387 19.6093 8.53387 18.7793 8.53387L13.2793 8.53387L8.2793 0.533874L6.2793 0.533874L8.7793 8.53387L3.2793 8.53387Z"
        fill="url(#paint0_linear_126_1895)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_126_1895"
          x1="10.2793"
          y1="0.533874"
          x2="10.1004"
          y2="16.8352"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#125C9C" />
          <stop offset="1" stopColor="#47AAFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const HeroIcon = {
  color: [
    {
      name: "Yatch",
      icon: Icon.cruiseColor,
      url: "/",
    },
    {
      name: "Bus",
      icon: Icon.busColor,
      url: "/bus",
    },
    {
      name: "Flight",
      icon: Icon.flightColor,
      url: "/flight",
    },
    {
      name: "Hotel",
      icon: Icon.hotelColor,
      url: "/hotel",
    },
    {
      name: "Visa",
      icon: Icons.visaColor,
      url: "/visa",
    },
    {
      name: "Passport",
      icon: Icons.passportColor,
      url: "/passport",
    },
  ],
  dark: [
    {
      name: "Yatch",
      icon: Icon.cruiseDark,
      url: "/",
    },
    {
      name: "Bus",
      icon: Icon.busDark,
      url: "/bus",
    },
    {
      name: "Flight",
      icon: Icon.flightDark,
      url: "/flight",
    },
    {
      name: "Hotel",
      icon: Icon.hotelDark,
      url: "/hotel",
    },
    {
      name: "Visa",
      icon: Icons.visaDark,
      url: "/visa",
    },
    {
      name: "Passport",
      icon: Icons.passportDark,
      url: "/passport",
    },
  ],
};

export const FooterIcons = [
  {
    icon: Icons.mail,
    url: "/",
  },
  {
    icon: Icons.facebook,
    url: "/",
  },
  {
    icon: Icons.instagram,
    url: "/",
  },
  {
    icon: Icons.linkedin,
    url: "/",
  },
];
