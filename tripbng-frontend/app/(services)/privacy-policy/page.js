import Footer from '@/components/layout/footer'
import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="relative w-full h-64">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold text-black mt-12 tracking-widest">PRIVACY POLICY</h1>
          <Link href="/" className="mt-4 text-black underline text-xl hover:text-gray-300">
            &lt; Back to Home
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full px-6 py-12 text-gray-800 space-y-6">
        <p className="text-2xl">
          We value the privacy of our customers and are committed to protecting their personal
          information. We believe that the personal information of our customers should not be
          shared with third parties without prior consent. This Privacy Policy outlines how we
          collect, use, and safeguard your information when you use our services.
        </p>

        <h2 className="text-2xl font-semibold">Information We Collect</h2>
        <p className="text-2xl">We collect the following types of information:</p>
        <ul className="list-disc pl-6 space-y-2 text-2xl">
          <li>
            <strong>Personal Information:</strong> Information provided by you during registration or
            booking, including your name, contact number, email address, and physical address.
          </li>
          <li>
            <strong>Transaction Information:</strong> Details of transactions made on our website,
            including booking details and payment information.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our websites, such as pages
            visited, IP address, and device information.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
        <p className="text-2xl">We use your information for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2 text-2xl">
          <li>To provide and personalize our services to you.</li>
          <li>To communicate with you regarding your bookings, updates, and promotions.</li>
          <li>To process transactions and bookings efficiently.</li>
          <li>To improve our website and services based on usage patterns and feedback.</li>
        </ul>

        <h2 className="text-2xl font-semibold">Data Security Information</h2>
        <p className="text-2xl">
          We have implemented extensive security measures to protect your information, including
          firewalls and monitoring systems. Any suspicious activity or transactions are thoroughly
          investigated to maintain the integrity of our services.
        </p>

        <h2 className="text-2xl font-semibold">Third-Party Entities</h2>
        <p className="text-2xl">
          Our privacy policy applies only to information collected and processed by the company. It
          does not cover third-party entities or websites that are not under our control.
        </p>

        <h2 className="text-2xl font-semibold">Type of Information We Collect and Its Legal Basis</h2>
        <p className="text-2xl">
          We collect personal information to provide our services and fulfil legal obligations. This
          includes information provided during registration, booking, and transactions. We use this
          information to process bookings, confirm reservations, and keep you informed of transaction
          status and updates.
        </p>

        <h2 className="text-2xl font-semibold">How We Use Your Personal Information</h2>
        <p className="text-2xl">
          We may use your personal information to facilitate bookings, confirm reservations, and send
          updates via email or WhatsApp. Your information may also be used for customer support and
          to improve our services.
        </p>

        <h2 className="text-2xl font-semibold">Reviews and Feedback</h2>
        <p className="text-2xl">
          We welcome your feedback and reviews. Please email us with any comments or concerns
          regarding our privacy policy or services.
        </p>
      </div>

      <Footer />
    </div>
  )
}

export default page
