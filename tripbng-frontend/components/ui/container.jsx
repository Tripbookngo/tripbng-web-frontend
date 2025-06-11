import { cn } from '@/lib/utils'
import React from 'react'

export default function Container({ children, className }) {
    return (
        <div className='container'>
            <div className={cn("bg-white rounded-lg shadow-md mb-8", className)}>
                {children}
            </div>
        </div>
    )
}
