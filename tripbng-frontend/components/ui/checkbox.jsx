'use client'

import React from 'react';

export default function Checkbox({ checked }) {
    return (
        <div className="relative h-fit w-fit">
            <input
                type="checkbox"
                defaultChecked={checked}  // Use defaultChecked for uncontrolled component
                className="sr-only"
                readOnly  // Ensure it's read-only if you don't want to change the state
            />
            <div className={`w-5 h-5 border-2 rounded-full ${checked ? 'border-black bg-black' : 'border-gray-400'}`}>
                {checked && (
                    <svg
                        className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </div>
    );
};
