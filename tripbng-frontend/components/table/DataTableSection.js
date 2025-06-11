// components/DataTableSection.jsx

import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

const DataTableSection = ({ title, icon, columns, rows }) => {
  const [searchText, setSearchText] = useState("");
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  const filteredRows = useMemo(() => {
    if (!searchText) return rows;
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, rows]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex justify-center items-center h-12 w-12 rounded-full bg-blue-100">
          {icon}
        </div>
        <h1 className="font-semibold text-gray-800 text-2xl">{title}</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mt-4 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex justify-center py-6">
        <div className="w-full overflow-x-auto">
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              checkboxSelection
              sx={{ border: 0 }}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default DataTableSection;
