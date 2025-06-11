"use client";
import Button from "@/components/ui/button";
import { visaDocuments } from "@/constants/data/visaDocuments";
import { apiService } from "@/lib/api";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [params, setParams] = useState(null);
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [travelerData, setTravelerData] = useState(
    travelers.map((traveler) => ({
      id: traveler.id,
      documents: visaDocuments.map((doc) => ({
        ...doc,
        selectedFile: null,
        fileUrl: null,
        loading: false,
        status: "Not Uploaded",
      })),
    }))
  );

  const [travelerFiles, setTravelerFiles] = useState(
    travelers && visaDocuments
      ? travelers.reduce((acc, traveler) => {
          acc[traveler.id] = visaDocuments.map((doc) => ({
            ...doc,
            selectedFile: null,
            loading: false,
          }));
          return acc;
        }, {})
      : {}
  );
  const [forceRerender, setForceRerender] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
  
  
      if (token && storedUser) {
        setUser(JSON.parse(storedUser)); 
      }
    }, []);

  const handleToggle = (id) => {
    setTravelers((prevTravelers) =>
      prevTravelers.map((traveler) => {
        if (traveler.id === id) {
          if (traveler.isOpen) {
            setTravelerFiles((prevFiles) => ({
              ...prevFiles,
              [id]: prevFiles[id].map((file) => ({
                ...file,
                selectedFile: null,
                loading: false,
              })),
            }));
          }
          return { ...traveler, isOpen: !traveler.isOpen };
        }
        return traveler;
      })
    );

    setForceRerender((prev) => !prev);
  };

  useEffect(() => {
    if (travelers && visaDocuments) {
      setTravelerFiles(
        travelers.reduce((acc, traveler) => {
          acc[traveler.id] = visaDocuments.map((doc) => ({
            ...doc,
            selectedFile: null,
            loading: false,
          }));
          return acc;
        }, {})
      );
    }
  }, [travelers]);

  const processPaxType = (travelers) => {
    const paxType = {
      adult: 0,
      child: 0,
      infant: 0,
    };

    travelers.forEach((traveler) => {
      if (traveler.type === "Adult") {
        paxType.adult += 1;
      } else if (traveler.type === "Child") {
        paxType.child += 1;
      } else if (traveler.type === "Infant") {
        paxType.infant += 1;
      }
    });

    return paxType;
  };

  useEffect(() => {
    if (searchParams) {
      const paramsObject = {
        country: searchParams.get("country"),
        date: searchParams.get("date")
          ? new Date(searchParams.get("date"))
          : null,
        visaType: searchParams.get("visaType"),
        stayingDays: searchParams.get("stayingDays")
          ? parseInt(searchParams.get("stayingDays"))
          : 0,
        adult: searchParams.get("adult")
          ? parseInt(searchParams.get("adult"))
          : 0,
        child: searchParams.get("child")
          ? parseInt(searchParams.get("child"))
          : 0,
        infant: searchParams.get("infant")
          ? parseInt(searchParams.get("infant"))
          : 0,
      };

      setParams(paramsObject);
    }
  }, [searchParams]);

  const handleInputChange = (id, field, value) => {
    setTravelerData((prev) => {
      const updatedData = [...prev];
      const travelerIndex = updatedData.findIndex((t) => t.id === id);
      if (travelerIndex !== -1) {
        updatedData[travelerIndex][field] = value;
      } else {
        updatedData.push({ id, [field]: value });
      }
      return updatedData;
    });
  };

  const handleFileUpload = async (file, travelerId, field) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiService.post(
        "/user/visa/upload",
        formData,
        true
      );

      if (response.success) {
        const fileUrl = response.data.data;

        setTravelerData((prevData) =>
          prevData.map((traveler) =>
            traveler.id === travelerId
              ? {
                  ...traveler,
                  [field]: { file, url: fileUrl },
                }
              : traveler
          )
        );

        setTravelerFiles((prevFiles) => {
          const updatedFiles = prevFiles[travelerId].map((doc) => {
            if (doc.id === field) {
              return {
                ...doc,
                selectedFile: file,
                fileUrl: fileUrl,
                loading: false,
                status: "Uploaded",
              };
            }
            return doc;
          });

          return {
            ...prevFiles,
            [travelerId]: updatedFiles,
          };
        });
      } else {
        console.error("File upload failed:", response.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  useEffect(() => {
    if (params) {
      const newTravelers = [];

      for (let i = 1; i <= params.adult; i++) {
        newTravelers.push({ id: i, type: "Adult", isOpen: false });
      }

      for (let i = 1; i <= params.child; i++) {
        newTravelers.push({
          id: i + params.adult,
          type: "Child",
          isOpen: false,
        });
      }

      for (let i = 1; i <= params.infant; i++) {
        newTravelers.push({
          id: i + params.adult + params.child,
          type: "Infant",
          isOpen: false,
        });
      }

      // Open the first traveler by default
      if (newTravelers.length > 0) {
        newTravelers[0].isOpen = true;
      }

      setTravelers(newTravelers);
    }
  }, [params]);

  const saveVisaRequest = async (type) => {
    if (loading) return;

    setLoading(true);

    const paxType = processPaxType(travelers);

    const travellersDetail = travelerData.map((traveler) => ({
      traveller: `Traveller ${traveler.id}`,
      paxType: "adult",
      firstName: traveler.firstName || "",
      lastName: traveler.lastName || "",
      fatherName: traveler.fatherName || "",
      motherName: traveler.motherName || "",
      gender: traveler.gender || "",
      dob: traveler.dob || "",
      maritalStatus: traveler.maritalStatus || "",
      passportIssueDate: traveler.passportIssueDate || "",
      passportNumber: traveler.passportNumber || "",
      passportValidTill: traveler.passportValidTill || "",
      photo: traveler[1]?.url || "",
      passportfrontPage: traveler[2]?.url || "",
      passportLastPage: traveler[3]?.url || "",
      returnTicket: traveler[4]?.url || "",
      hotelVoucher: traveler[5]?.url || "",
    }));

    const payload = {
      destination: params?.country,
      visaType: params?.visaType,
      date: params?.date,
      lengthOfStay: params?.stayingDays,
      validity: "2025-09-10",
      entry: "Single",
      paxType,
      travellersDetail,
    };

    try {
      const response = await apiService.post("/user/visa/save", payload);

      if (response?.success) {
        if (type === "payment") {
          await handlePayment(response?.data?._id);
        } else {
          toast.success(response.message);
        }
      } else {
        toast.error(
          response?.message || "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const response = await apiService.post("/user/makePayment", {
        email: user?.email,
        name: user?.name,
        phone: user?.mobile,
        category: "visa",
        bookingId,
        amount: 100,
      });

      if (response?.success) {
        const payuParams = {
          key: response?.data?.key,
          txnid: response?.data?.txnid,
          amount: response?.data?.amount,
          firstname: response?.data?.firstname,
          email: response?.data?.email,
          phone: response?.data?.phone,
          productinfo: response?.data?.productinfo,
          surl: response?.data?.surl,
          furl: response?.data?.furl,
          hash: response?.data?.hash,
        };

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://test.payu.in/_payment";

        Object.keys(payuParams).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = payuParams[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error("Payment failed:", response?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error making payment:", error.message);
      toast.error("Failed to process payment.");
    }
  };
  return (
    <div className="md:container py-10 px-3 md:px-3 flex flex-col gap-4">
      <div className=" grid-cols-6 bg-white rounded-xl hidden sm:grid w-full ">
        <div className="border rounded-l-xl p-4">
          <p className="text-sm">CITY, AREA or PROPERTY</p>
          <p className="text-md font-semibold"> {params?.country}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Travel Date</p>
          <p className="text-md font-semibold">{formatDate(params?.date)} </p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Visa Type</p>
          <p className="text-md font-semibold">{params?.visaType}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Length Of Stay</p>
          <p className="text-md font-semibold">{params?.stayingDays}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Pax</p>
          <p className="text-md font-semibold">
            {params?.adult} Adults {params?.child} Child {params?.infant} Infant
          </p>
        </div>
        <div className="border p-4 rounded-r-xl flex items-center">
          <Button
            onClick={() => {
              router.back();
            }}
          >
            Modify
          </Button>
        </div>
      </div>
      <div className="flex md:flex-row flex-col items-start w-full gap-3">
        <div className=" lg:w-[75%]">
          <div className="p-4 border rounded-lg mb-4">
            <ul className="flex items-center justify-between">
              <li className="flex flex-col items-start">
                <p className="text-sm text-gray-500 font-medium">Destination</p>
                <p className="text-sm  font-medium">{params?.country}</p>
              </li>
              <li className="flex flex-col items-start">
                <p className="text-sm text-gray-500 font-medium">Visa Type</p>
                <p className="text-sm  font-medium">{params?.visaType}</p>
              </li>
              <li className="flex flex-col items-start">
                <p className="text-sm text-gray-500 font-medium">
                  Length of Stay
                </p>
                <p className="text-sm  font-medium">
                  {params?.stayingDays} Days
                </p>
              </li>
              <li className="flex flex-col items-start">
                <p className="text-sm text-gray-500 font-medium">Validity</p>
                <p className="text-sm  font-medium">60 Days</p>
              </li>
              <li className="flex flex-col items-start">
                <p className="text-sm text-gray-500 font-medium">Entry</p>
                <p className="text-sm  font-medium">Single</p>
              </li>
            </ul>
            <div className="mt-10">
              <h1 className="text-lg font-semibold ">Required Documents</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Image src="/icons/dot.png" className="w-6 h-6" alt="Visa img" width={100} height={100} />
                  <p className="text-gray-500">Passport Size Photo</p>
                </span>
                <span className="flex items-center gap-1">
                  <Image src="/icons/dot.png" className="w-6 h-6" alt="Visa img" width={100} height={100}/>
                  <p className="text-gray-500">Passport Front Page</p>
                </span>
                <span className="flex items-center gap-1">
                  <Image src="/icons/dot.png" className="w-6 h-6" alt="Visa img"  width={100} height={100}/>
                  <p className="text-gray-500">Passport Last Page</p>
                </span>
                <span className="flex items-center gap-1">
                  <Image src="/icons/dot.png" className="w-6 h-6" alt="Visa img"  width={100} height={100}/>
                  <p className="text-gray-500">Return Ticket</p>
                </span>
                <span className="flex items-center gap-1">
                  <Image src="/icons/dot.png" className="w-6 h-6" alt="Visa img" width={100} height={100}/>
                  <p className="text-gray-500">Hotel Voucher</p>
                </span>
              </div>
            </div>
            <div className="mt-10 bg-gray-500/20 p-4 rounded-lg">
              <h1 className="text-lg font-semibold ">Special Notes</h1>
              <span className="flex items-center gap-1">
                <Image src="/icons/dot.png" className="w-6 h-6" alt="Visa img" width={100} height={100}/>
                <p className="text-red-500">
                  Only Indian passport holders can apply for VISA
                </p>
              </span>
            </div>
          </div>
          {travelers.map((traveler) => (
            <div
              key={`${traveler.id}-${forceRerender}`}
              className=" border rounded-lg mb-4"
            >
              <div className="py-2 px-4 flex items-center justify-between ">
                <div>
                  <h2 className="text-lg font-semibold">
                    Traveller {traveler.id}{" "}
                    <span className="text-sm text-yellow">
                      ({traveler.type})
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Fill up these details same as your passport copy
                  </p>
                </div>
                <button onClick={() => handleToggle(traveler.id)}>
                  <Image src="/hotels/down.png" className="w-6 h-6" alt="Visa img" width={100} height={100}/>
                </button>
              </div>
              {traveler.isOpen && (
                <div>
                  <span className="border-b flex"></span>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label
                        htmlFor={`first-name-${traveler.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`first-name-${traveler.id}`}
                        className="border rounded-lg p-2 w-full"
                        type="text"
                        onChange={(e) =>
                          handleInputChange(
                            traveler.id,
                            "firstName",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        htmlFor={`last-name-${traveler.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`last-name-${traveler.id}`}
                        className="border rounded-lg p-2 w-full"
                        type="text"
                        onChange={(e) =>
                          handleInputChange(
                            traveler.id,
                            "lastName",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Father Name */}
                    <div>
                      <label
                        htmlFor={`father-name-${traveler.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Father Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`father-name-${traveler.id}`}
                        className="border rounded-lg p-2 w-full"
                        type="text"
                        onChange={(e) =>
                          handleInputChange(
                            traveler.id,
                            "fatherName",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Mother Name */}
                    <div>
                      <label
                        htmlFor={`mother-name-${traveler.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mother Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`mother-name-${traveler.id}`}
                        className="border rounded-lg p-2 w-full"
                        type="text"
                        onChange={(e) =>
                          handleInputChange(
                            traveler.id,
                            "motherName",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label
                        htmlFor={`gender-${traveler.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id={`gender-${traveler.id}`}
                        className="border rounded-lg p-2 w-full"
                        onChange={(e) =>
                          handleInputChange(
                            traveler.id,
                            "gender",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label
                        htmlFor={`dob-${traveler.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`dob-${traveler.id}`}
                        className="border rounded-lg p-2 w-full"
                        type="date"
                        onChange={(e) =>
                          handleInputChange(traveler.id, "dob", e.target.value)
                        }
                      />
                    </div>

                    {/* Marital Status */}
                    <div>
                      <label
                        htmlFor={`marital-status-${traveler.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Marital Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        id={`marital-status-${traveler.id}`}
                        className="border rounded-lg p-2 w-full"
                        onChange={(e) =>
                          handleInputChange(
                            traveler.id,
                            "maritalStatus",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                      </select>
                    </div>

                    {/* Passport Issue Date */}
                    <div>
                      <label
                        htmlFor={`passport-issue-date-${traveler.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Passport Issue Date{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`passport-issue-date-${traveler.id}`}
                        className="border rounded-lg p-2 w-full"
                        type="date"
                        onChange={(e) =>
                          handleInputChange(
                            traveler.id,
                            "passportIssueDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Passport Number */}
                    <div>
                      <label
                        htmlFor={`passport-no-${traveler.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Passport No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`passport-no-${traveler.id}`}
                        className="border rounded-lg p-2 w-full"
                        type="text"
                        onChange={(e) =>
                          handleInputChange(
                            traveler.id,
                            "passportNumber",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Passport Valid Till */}
                    <div>
                      <label
                        htmlFor={`passport-valid-till-${traveler.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Passport Valid Till{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`passport-valid-till-${traveler.id}`}
                        className="border rounded-lg p-2 w-full"
                        type="date"
                        onChange={(e) =>
                          handleInputChange(
                            traveler.id,
                            "passportValidTill",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">Upload Documents</h2>
                    {travelerFiles[traveler.id] &&
                    travelerFiles[traveler.id].length > 0 ? (
                      travelerFiles[traveler.id].map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 sm:p-2 mt-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden">
                              {doc.selectedFile ? (
                                doc.selectedFile.type.startsWith("image/") ? (
                                  <Image
                                    src={URL.createObjectURL(doc.selectedFile)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                    width={100}
                                    height={100}
                                  />
                                ) : (
                                  <p className="text-xs text-center">
                                    {doc.selectedFile.name}
                                  </p>
                                )
                              ) : doc.loading ? (
                                <div className="w-8 h-8 border-4 border-t-4 border-gray-500 rounded-full animate-spin"></div>
                              ) : (
                                <p className="text-xs text-center">No file</p>
                              )}
                            </div>

                            <div className="flex flex-col items-center sm:items-start">
                              <p className="text-sm font-medium">
                                {doc.name}
                                <span>*</span>
                              </p>
                              <p className="text-sm font-medium text-gray-500">
                                ({doc.formats.join(",")})
                              </p>
                              <p className="text-sm font-medium">
                                Maximum File Size is {doc.maxSize}
                              </p>
                            </div>
                            <span className="bg-gray-500/20 flex items-center justify-center text-sm rounded-lg py-2 px-3 text-yellow font-semibold">
                              {doc.status}
                            </span>
                          </div>

                          <label className="mt-4 sm:mt-0 border border-yellow rounded-lg py-2 px-3 flex items-center justify-center gap-2 cursor-pointer">
                            <Image
                              src={doc.uploadIcon}
                              alt="upload icon"
                              className="w-4 h-4"
                              width={100}
                              height={100}
                            />
                            <p className="text-sm font-semibold text-yellow">
                              {doc.loading ? (
                                <div className="w-5 h-5 border-2 border-t-transparent border-yellow rounded-full animate-spin"></div>
                              ) : (
                                "Upload"
                              )}
                            </p>
                            <input
                              type="file"
                              accept={doc.formats
                                .map((format) => `.${format}`)
                                .join(",")}
                              className="hidden"
                              disabled={doc.loading}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const selectedFile = e.target.files[0];
                                  doc.selectedFile = selectedFile;
                                  doc.loading = true;
                                  handleFileUpload(
                                    selectedFile,
                                    traveler.id,
                                    doc.id
                                  );
                                }
                              }}
                            />
                          </label>
                        </div>
                      ))
                    ) : (
                      <p>No documents available for this traveler.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="lg:w-[25%] w-full">
          <div className=" border rounded-lg  bg-white">
            <h2 className=" p-3 text-lg font-semibold">Payment Summary</h2>
            <span className="border-b flex "></span>
            <span className="p-3 flex items-center justify-between">
              <p className="text-sm text-gray-500">Adult Fees</p>
              <p className="font-semibold">INR 6219 x 2</p>
            </span>
            <span className="border-b flex border-dashed "></span>
            <span className="p-3 flex items-center justify-between">
              <p className="text-sm text-gray-500">Taxes</p>
              <p className="font-semibold">INR 0</p>
            </span>
            <span className="border-b flex border-dashed"></span>
            <div className="p-2">
              <span className="bg-gray-500/20 p-3 rounded-lg flex items-center justify-between">
                <p className="text-yellow font-semibold">Total Amount</p>
                <p className="text-yellow font-semibold">INR 12438</p>
              </span>
            </div>
          </div>
          <button
            className="bg-yellow text-white font-medium text-lg w-full mt-3 rounded-lg py-3 px-3"
            onClick={() => saveVisaRequest("payment")}
          >
            Make Payment
          </button>

          <button
            className="border border-yellow text-yellow font-medium text-lg w-full mt-3 rounded-lg py-3 px-3 flex items-center justify-center"
            onClick={() => saveVisaRequest("save")}
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-yellow rounded-full animate-spin"></div>
            ) : (
              "Save Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
