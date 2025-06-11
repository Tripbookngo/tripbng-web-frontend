import FailureCard from '@/components/failed/page';
import React from 'react';

const failed = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <FailureCard message="Payment failed. Please try again." />
    </div>
  );
};

export default failed;
