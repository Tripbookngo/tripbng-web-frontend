"use client";
import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

const PaxDropdown = ({ rooms, setRooms, open, setOpen }) => {
  const dropdownRef = useRef(null);

  const handleAddRoom = () => {
    setRooms([...rooms, { adults: 1, children: 0, childAges: [] }]);
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };

  const handleAdultChange = (index, value) => {
    const updatedRooms = [...rooms];
    const newValue = Math.min(8, Math.max(1, value));
    updatedRooms[index].adults = newValue;
    setRooms(updatedRooms);
  };

  const handleChildrenChange = (index, value) => {
    const updatedRooms = [...rooms];
    const newValue = Math.min(4, Math.max(0, value));
    updatedRooms[index].children = newValue;
    updatedRooms[index].childAges = updatedRooms[index].childAges.slice(
      0,
      newValue
    );
    while (updatedRooms[index].childAges.length < newValue) {
      updatedRooms[index].childAges.push("1");
    }
    setRooms(updatedRooms);
  };

  const handleChildAgeChange = (roomIndex, ageIndex, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].childAges[ageIndex] = value;
    setRooms(updatedRooms);
  };

  const handleDone = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-12 left-0 w-80 bg-white border shadow-xl rounded-xl mt-2 p-4 z-50"
      ref={dropdownRef}
    >
      {rooms.map((room, roomIndex) => (
        <div
          key={roomIndex}
          className="mb-4 border-b pb-4 last:border-none"
        >
          <h3 className="font-semibold mb-3 text-lg">
            Room {roomIndex + 1}
          </h3>

          {/* Adults */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium">Adults</p>
              <p className="text-xs text-neutral-400">
                Age 18 and above
              </p>
            </div>
            <input
              type="number"
              min="1"
              value={room.adults}
              onChange={(e) =>
                handleAdultChange(roomIndex, parseInt(e.target.value))
              }
              className="w-16 border rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Children */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium">Children</p>
              <p className="text-xs text-neutral-400">
                Age 17 and below
              </p>
            </div>
            <input
              type="number"
              min="0"
              value={room.children}
              onChange={(e) =>
                handleChildrenChange(
                  roomIndex,
                  parseInt(e.target.value)
                )
              }
              className="w-16 border rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {room.children > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">
                Children's Ages
              </p>
              <div className="flex gap-2 flex-wrap">
                {room.childAges.map((age, ageIndex) => (
                  <input
                    key={ageIndex}
                    type="number"
                    min="1"
                    max="17"
                    value={age}
                    onChange={(e) =>
                      handleChildAgeChange(
                        roomIndex,
                        ageIndex,
                        e.target.value
                      )
                    }
                    className="w-12 border rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            {rooms.length > 1 && (
              <button
                onClick={() => handleRemoveRoom(roomIndex)}
                className="text-red-500 text-sm flex items-center hover:text-red-700 transition-colors"
              >
                <Minus className="w-4 h-4 mr-1" /> Remove Room
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add Room Button */}
      <button
        onClick={handleAddRoom}
        className="w-full py-2 border rounded-xl text-blue-600 hover:bg-blue-50 flex items-center justify-center mb-3 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Room
      </button>

      {/* Done Button */}
      <button
        onClick={handleDone}
        className="w-full py-2 bg-yellow text-white text-lg font-semibold rounded-xl hover:bg-yellow/50 transition-all"
      >
        Done
      </button>
    </motion.div>
  );
};

export default PaxDropdown;