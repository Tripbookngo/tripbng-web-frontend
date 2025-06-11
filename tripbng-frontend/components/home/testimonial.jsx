import Image from 'next/image'
import React from 'react'

const testimonials = [
    {
        name: "Maskhan Singh",
        role: "Punjab",
        image: "/images/makkhan.png",
        quote: "I've used Tripbooking for all my business travels and they never disappoint. The seamless booking process and great prices keep me coming back.",
        rating: 5
    },
    {
        name: "Sarah M.",
        role: "Mumbai",
        image: "/images/sarah.png",
        quote: "Booking my holiday was a breeze with Tripbooking. Their customer service was exceptional, and I got amazing deals on flights. I will highly recommend them!",
        rating: 5
    },
    {
        name: "Michel",
        role: "Japan",
        image: "/images/michel.png",
        quote: "Our family vacation was perfect thanks to Tripbooking. They found us the best deals and even helped us with itinerary planning. A fantastic experience!",
        rating: 5
    }
];

const StarRating = ({ rating }) => {
    return (
        <div className="flex gap-1 mt-2">
            {[...Array(rating)].map((_, i) => (
                <Image
                    key={i}
                    src={"/icons/star.png"}
                    width={18}
                    height={18}
                    alt="star-icon"
                />
            ))}
        </div>
    )
};

export default function Testimonial() {
    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: "#125a9b" }}>
                    Great Words from Our Customers
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200"
                        >
                            <div className="w-24 h-24 mb-6">
                                <Image
                                    className="rounded-full object-cover"
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    width={96}
                                    height={96}
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{testimonial.role}</p>
                            <p className="text-gray-600 text-sm mb-6">{testimonial.quote}</p>
                            <StarRating rating={testimonial.rating} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
