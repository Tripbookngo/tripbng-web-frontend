export const depositTableColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "referenceNumber", headerName: "Reference Number", width: 130 },
  { field: "date", headerName: "Date", width: 130 },
  {
    field: "status",
    headerName: "Status",
    width: 90,
  },
  {
    field: "amount",
    headerName: "Amount",

    width: 160,
  },
  {
    field: "attachment",
    headerName: "Attachment",

    width: 160,
  },
  {
    field: "mop",
    headerName: "MOP",

    width: 160,
  },
];

export const depositTableRows = [
  {
    id: 1,
    referenceNumber: "REC01082024185943985",
    date: "2025-02-19 18:59:13",
    status: "Pending",
    amount: "INR 10000",
    attachment: "-",
    mop: "Payment Gateway",
  },
  {
    id: 2,
    referenceNumber: "REC01082024185943985",
    date: "2025-02-19 18:59:13",
    status: "Failed",
    amount: "INR 10000",
    attachment: "-",
    mop: "Payment Gateway",
  },
  {
    id: 3,
    referenceNumber: "REC01082024185943985",
    date: "2025-02-19 18:59:13",
    status: "Approved",
    amount: "INR 10000",
    attachment: "-",
    mop: "Payment Gateway",
  },
  // ... more entries
];
