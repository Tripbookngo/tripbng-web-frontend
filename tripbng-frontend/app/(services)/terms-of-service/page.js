import Footer from '@/components/layout/footer'
import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="relative w-full h-64">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold text-black mt-12 tracking-widest">TERMS OF SERVICES</h1>
          <Link href="/" className="mt-4 text-black underline text-xl hover:text-gray-300">
            &lt; Back to Home
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full px-6 py-12 text-gray-800 space-y-6">
        <p className="text-2xl">
          These Terms and Conditions govern your use of the website and services. By accessing or
          using our website, you agree to be bound by these Terms and Conditions. If you do not
          agree with any part of these terms, you may not use our services.
        </p>

        <h2 className="text-2xl font-semibold">Use of Our Services</h2>
        <ul className="list-disc pl-6 space-y-2 text-2xl">
          <li>
            You agree to provide accurate and complete information when using our services, including
            during registration and booking processes.
          </li>
          <li>
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activities that occur under your account.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">Booking and Transactions</h2>
        <ul className="list-disc pl-6 space-y-2 text-2xl">
          <li>
            All bookings made through our website are subject to availability and confirmation by the
            company and our service providers.
          </li>
          <li>
            Prices displayed on our website are subject to change without prior notice. We reserve
            the right to modify or cancel bookings if inaccuracies are found.
          </li>
          <li>
            Payment for bookings must be made in full at the time of booking unless otherwise
            specified.
          </li>
          <li>
            Refunds, cancellations, and modifications to bookings are subject to our Refund and
            Cancellation Policy, which is outlined separately on our website.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">User Content</h2>
        <ul className="list-disc pl-6 space-y-2 text-2xl">
          <li>
            By submitting content (such as reviews, comments, or feedback) to our website, you grant
            company a non-exclusive, royalty-free, perpetual, and worldwide license to use,
            reproduce, modify, adapt, publish, translate, distribute, and display such content.
          </li>
          <li>
            You are solely responsible for the content you submit, and it must not violate any
            third-party rights or applicable laws.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">Intellectual Property</h2>
        <ul className="list-disc pl-6 space-y-2 text-2xl">
          <li>
            All content and materials on the company’s website, including but not limited to text,
            graphics, logos, images, and software, are the property of company or its licensors and
            are protected by copyright, trademark, and other intellectual property laws.
          </li>
          <li>
            You may not use, reproduce, modify, distribute, or display any content from our website
            without prior written consent from the company.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
        <ul className="list-disc pl-6 space-y-2 text-2xl">
          <li>
            We shall not be liable for any direct, indirect, incidental, special, or consequential
            damages arising out of or in any way connected with the use of our website or services,
            including but not limited to loss of profits, data, or goodwill.
          </li>
          <li>
            In no event shall Bonton Holidays' total liability to you exceed the amount paid by you
            for the services rendered.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">Indemnification</h2>
        <p className="text-2xl">
          You agree to indemnify and hold the company harmless from any claims, damages, losses,
          liabilities, costs, and expenses (including legal fees) arising out of or in connection
          with your use of our website or services, your violation of these Terms and Conditions, or
          your violation of any rights of a third party.
        </p>

        <h2 className="text-2xl font-semibold">Modifications to Terms and Conditions</h2>
        <p className="text-2xl">
          Company reserves the right to modify or update these Terms and Conditions at any time
          without prior notice. The updated Terms and Conditions will be effective upon posting on
          our website. Your continued use of our services after any such changes constitutes
          acceptance of the revised Terms and Conditions.
        </p>
      </div>

      <Footer />
    </div>
  )
}

export default page
