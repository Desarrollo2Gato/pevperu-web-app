import { IUser } from "@/app/types/api";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";

import {
  Column,
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import StatusSpan from "../ui/statusSpan";

interface UsersTableProps {
  dataTable: IUser[];
  changeStatus: (id: number, status: string) => void;
}
const UsersTable: React.FC<UsersTableProps> = ({ dataTable }) => {
  const data: IUser[] = dataTable;
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState<IUser[]>([]);

  // colums
  const columns: ColumnDef<IUser, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      // cell: (info) => info.getValue(),
    },
    {
      accessorKey: "full_name",
      header: "Nombre completo",
    },
    {
      accessorKey: "company",
      header: "Empresa",
      cell: (info) =>
        info.row.original.work_for_company
          ? info.row.original.work_for_company
          : "Sin empresa",
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: (info) =>
        info.row.original.status === "approved" ? (
          <StatusSpan text="Aprobado" bg="bg-green-400" />
        ) : info.row.original.status === "pending" ? (
          <StatusSpan text="Pendiente" bg="bg-blue-600" />
        ) : (
          <StatusSpan text="Rechazdo" bg="bg-green-600" />
        ),
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: (info) => (
        <div className="flex justify-center items-center gap-2">
          {/* switch */}
          changeStatus
        </div>
      ),
    },
  ];

  // table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="min-w-full border-collapse text-zinc-700 border-t border-t-gray-100">
      <thead className=" ">
        {table.getHeaderGroups().map((headerGroup, index) => (
          <tr key={index} className="border-b border-b-gray-200">
            {headerGroup.headers.map((header, hIndex) => (
              <th
                key={hIndex}
                className="px-2 py-2 text-start text-sm font-semibold"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row, index) => (
          <tr
            key={index}
            className={`border-b border-b-gray-200 ${
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            }`}
          >
            {row.getVisibleCells().map((cell, cIndex) => (
              <td key={cIndex} className=" px-2 py-1 text-sm">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
