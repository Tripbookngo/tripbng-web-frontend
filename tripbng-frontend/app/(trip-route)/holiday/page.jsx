"use client";
import React, { useState, useEffect } from "react";
import { DatePicker, Slider, Spin, Select, Input, Button, Steps } from "antd";
import { useRouter } from "next/navigation";
import LocationSelector, {
  DropdownProvider,
} from "@/components/flight/LocationSelector";
import { apiService } from "@/lib/api";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import FlightTraveller from "@/components/flight/FlightTraveller";

const { TextArea } = Input;
const { Step } = Steps;

export default function Holiday() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [stayingDays, setStayingDays] = useState(1);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTripType, setSelectedTripType] = useState("Domestic");
  const [selectedPackageType, setSelectedPackageType] = useState("Family");
  const [travelerCounts, setTravelerCounts] = useState({
    a: 1,
    c: 0,
    i: 0,
  });
  const [additionalPlaces, setAdditionalPlaces] = useState([]);
  const [notes, setNotes] = useState("");
  console.log(travelerCounts);

  const tripTypes = ["Domestic", "International"];
  const packageTypes = ["Family", "Business", "Friends", "Honeymoon"];

  const handleSearchClick = async () => {
    if (!origin) {
      toast.error("Please select an origin location.");
      return;
    }

    if (!destination) {
      toast.error("Please select a destination location.");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a travel date.");
      return;
    }
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        toast.error("User not found. Please log in.");
        router.push("/login");
        return;
      }

      const { name, email, mobile } = storedUser;
      const response = await apiService.post("/holiday/searchpackage", {
        username: name,
        email,
        contact: mobile,
        travel_type: selectedTripType === "Domestic" ? 0 : 1,
        package_type: selectedPackageType,
        from_city: origin.name,
        destination: destination.name,
        travel_date: dayjs(selectedDate).format("YYYY-MM-DD"),
        no_of_person: [
          {
            adult: travelerCounts.a.toString(),
            child: travelerCounts.c.toString(),
            inflant: travelerCounts.i.toString(),
          },
        ],
        days: stayingDays + 1,
        nights: stayingDays,
        additional_city: additionalPlaces.map((item, index)=>(item.name)),
        discription: notes,
      });

      response.status === 200
        ? toast.success(response.message)
        : toast.error(response.message);
    } catch (error) {
      console.error("Error fetching package:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const disabledDate = (current) => {
    return current && current < dayjs().add(1, "day").startOf("day");
  };
  return (
    <DropdownProvider>
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-7xl mx-auto">
        <Steps current={step} size="small" className="mb-6 custom-steps">
          <Step title="Trip Details" />
          <Step title="Traveler Info" />
          <Step title="Review & Submit" />
        </Steps>

        {step === 0 && (
          <div>
            <p className="mb-3">Select the Trip Type:</p>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {tripTypes.map((type) => (
            <Button
            key={type}
            className={`custom-btn ${selectedTripType === type ? 'selected' : ''}`}
            type={selectedTripType === type ? "primary" : "default"}
            onClick={() => setSelectedTripType(type)}
          >
            {type}
          </Button>
          
           
              
              
              ))}
            </div>

            <p className="mb-3">Select Package Type:</p>
<Select
  placeholder="Select package type"
  value={selectedPackageType}
  onChange={setSelectedPackageType}
  options={packageTypes.map((pkg) => ({ label: pkg, value: pkg }))}
  className="w-full"
  status="warning" // warning gives orange color
  style={{
    borderColor: '#FF8E00',
  }}
  dropdownStyle={{
    borderColor: '#FF8E00',
  }}
  popupClassName="custom-select-dropdown"

/>

          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="border p-4 rounded-lg  flex flex-col justify-center">
                <LocationSelector 
                  label="From"
                  placeholder="Select Origin"
                  value={origin}
                  onChange={setOrigin}
                  module="Holiday"
                  selectedTripType={selectedTripType}
                  countryCode={selectedTripType === "Domestic" ? "IN" : null}
                  showAllCountries={selectedTripType === "International"}
                />
              </div>
              {/* "To" */}
              <div className="border p-4 rounded-lg  flex flex-col justify-center">
                <LocationSelector
                  label="To"
                  placeholder="Select Destination"
                  value={destination}
                  onChange={setDestination}
                  module="Holiday"
                  selectedTripType={selectedTripType}
                  countryCode={selectedTripType === "Domestic" ? "IN" : null}
                  showAllCountries={selectedTripType === "International"}
                  disabled={!origin}
                />
              </div>

              <div className="border p-4 rounded-lg  flex flex-col justify-center">
                <p className="text-sm font-medium mb-2">Travel Date:</p>
                <DatePicker
                  className="w-full border-none"
                  onChange={setSelectedDate}
                  value={selectedDate}
                  format="MMM DD, YYYY"
                  disabledDate={disabledDate}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
              <div className="border p-4 rounded-lg  flex flex-col justify-center">
                <FlightTraveller
                  travelerCounts={travelerCounts}
                  setTravelerCounts={setTravelerCounts}
                />
              </div>
              <div className="border p-4 rounded-lg  flex flex-col justify-center">
                <p className="text-sm font-medium my-2">Duration (Nights):</p>
                <Slider
                  min={1}
                  max={10}
                  value={stayingDays}
                  onChange={setStayingDays}
                />
                <p className="text-center mt-2">
                  {stayingDays} Night{stayingDays > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="border p-3 rounded-lg flex flex-col -mt-3 h-auto">
              <p className="text-sm font-medium mb-1">Additional Places:</p>
              <p className="text-xs text-gray-500 mb-2">
                You can select multiple locations.
              </p>

              <div className="flex items-center gap-3">
                {additionalPlaces.map((place, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 border rounded-xl px-2"
                  >
                    <LocationSelector
                      label={`Place ${index + 1}`}
                      placeholder="Select Additional Place"
                      value={place}
                      onChange={(newPlace) => {
                        const updatedPlaces = [...additionalPlaces];
                        updatedPlaces[index] = newPlace;
                        setAdditionalPlaces(updatedPlaces);
                      }}
                      module="Holiday"
                      additional="Cities"
                      isMultiple={false}
                      selectedTripType={selectedTripType}
                      destination={destination}
                      className=""
                      disabled={!destination} 
                    />
                    <button
                      onClick={() => {
                        setAdditionalPlaces(
                          additionalPlaces.filter((_, i) => i !== index)
                        );
                      }}
                      className="text-red-500 text-xs px-1 py-1 rounded hover:bg-red-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (additionalPlaces.length < 4) {
                    setAdditionalPlaces([...additionalPlaces, ""]);
                  } else {
                    toast.error("You can add up to 4 additional places only.");
                  }
                }}
                className={`mt-2 px-3 py-2 bg-yellow text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition w-full md:w-auto ${
                  !destination ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!destination} 
              >
                + Add More
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-sm font-medium">Notes / Special Requests</p>
            <TextArea
  placeholder="Add any special requests here..."
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  rows={3}
  className="w-full mt-2 custom-textarea"
  style={{
    borderColor: notes ? '#FF8E00' : '#d9d9d9', // Default border color
    color: notes ? 'black' : 'gray', // Text color
  }}
/>

          </div>
        )}
        {/* Navigation Buttons */}
        <div
          className={`flex justify-between ${step === 1 ? "mt-0" : "mt-5"}`}
        >
          {step > 0 && (
            <Button
  onClick={() => setStep(step - 1)}
  className="custom-btn"
  style={{
    backgroundColor: 'white',
    borderColor: '#d9d9d9',
    color: 'black',
  }}
>
  Back
</Button>
        )}
          {step < 2 ? (
           <Button
           type="primary"
           onClick={() => setStep(step + 1)}
           style={{
             backgroundColor: '#FF8E00',
             borderColor: '#FF8E00',
             color: 'white',
           }}
           className="custom-btn"

         >
           Next
         </Button>
         
          ) : (
            <Button
              type="primary"
              onClick={handleSearchClick}
              style={{
                backgroundColor: '#FF8E00',
                borderColor: '#FF8E00',
                color: 'white',
              }}
              className="custom-btn"
              disabled={loading}
            >
              {loading ? <Spin /> : "Get a CallBack"}
            </Button>
          )}
        </div>
      </div>
    </DropdownProvider>
  );
}