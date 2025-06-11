import React from "react";
import { FooterIcons } from "../icons";
import Link from "next/link";
import { FooterData } from "@/constants/data";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12">
      <div className="container mx-auto px-4">

        {/* Top Row: Info Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-3">{FooterData.contactInfo.title}</h3>
            <ul className="text-neutral-400 space-y-4 text-sm">
              {FooterData.contactInfo.details.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-white mt-1">{item.icon}</span>
                  <div>
                    <span className="font-medium text-white">{item.label}:</span><br />
                    {item.label === "Address" ? (
                      <div className="space-y-1">
                        <div>841, The Spire 2, 150 FT. Ring Road</div>
                        <div>Near Shitalpark, Rajkot - 360006</div>
                        <div>Gujarat - 360007</div>
                      </div>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

          </div>

          {/* Travel & Tourism */}
          <div>
            <h3 className="font-semibold mb-3">{FooterData.travelTourism.title}</h3>
            <ul>
              {FooterData.travelTourism.links.map((link, i) => (
                <li key={i} className="mb-2 list-disc list-inside text-neutral-400">
                  <Link href={link.url}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3">{FooterData.services.title}</h3>
            <ul>
              {FooterData.services.links.map((link, i) => (
                <li key={i} className="mb-2 text-neutral-400">
                  <Link href={link.url} className="flex items-center gap-2">
                    <img src={link.icon} width={18} height={18} alt={link.text} />
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Help */}
          <div>
            <h3 className="font-semibold mb-3">{FooterData.supportHelp.title}</h3>
            <ul>
              {FooterData.supportHelp.links.map((link, i) => (
                <li key={i} className="mb-2 list-disc list-inside text-neutral-400">
                  <Link href={link.url}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray my-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-8">
          <div className="flex justify-start">
            <div>
              <h4 className="text-white font-semibold mb-2">Subscribe to our special offers</h4>
              <p className="text-neutral-400 text-sm mb-3">Save with our latest fares and offers</p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="px-2 py-2 rounded-lg text-gray bg-white text-sm"
                />
                <button className="bg-blue-600 px-4 py-2 border text-sm rounded-lg hover:bg-blue-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div>
              <h4 className="text-white font-semibold mb-2">Tripbng App</h4>
              <p className="text-neutral-400 text-sm mb-3">Book and manage your trip</p>
              <div className="flex gap-3">
            <img
              src="/footer/app-store.png"
              width={100}
              height={50}
              alt="App Store"
              className="h-12 w-auto object-contain"
            />
            <img
              src="/footer/play-store.png"
              width={160}
              height={50}
              alt="Google Play"
              className="h-12 w-auto object-contain"
            />
          </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div>
              <h4 className="text-white font-semibold mb-2">Connect with us</h4>
              <p className="text-neutral-400 text-sm mb-3">Share your tripbng experience</p>
              <div className="flex gap-3">
                {FooterIcons.map((icon, i) => (
                  <a
                    href={icon.url}
                    key={i}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
                  >
                    {icon.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray w-4/6"></div>


        <div className="flex flex-col md:flex-row justify-between items-center text-neutral-400 text-sm flex-wrap gap-4 text-center pt-4 w-full">
        <div className="flex flex-wrap justify-start gap-16">
          <Link href="/privacy-policy">
            <span className="cursor-pointer">Privacy Policy</span>
          </Link>
          <Link href="/terms-of-service">
            <span className="cursor-pointer">Terms of Service</span>
          </Link>
          <Link href="/customer-support">
            <span className="cursor-pointer">Customer Support</span>
          </Link>
          <Link href="/cookie-policy">
            <span className="cursor-pointer">Cookie Policy</span>
          </Link>
          <Link href="/payment-security">
            <span className="cursor-pointer">Payment Security</span>
          </Link>
          <Link href="/user-agreement">
            <span className="cursor-pointer ">User Agreement</span>
          </Link>
      </div>

          <div className="mt-4 md:mt-0">
            <img src="/logo.png" width={120} height={100} alt="footer-logo" className="w-40 h-auto" />
          </div>
        </div>

        <div className="text-start text-neutral-500 text-sm mt">
          © {new Date().getFullYear()} TripBNG. All rights reserved.
        </div>
        </div>

    </footer>
  );
}
