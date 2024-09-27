import { ICompany, IPlan, ISubscription } from "@/app/types/api";
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
import { getTokenFromCookie } from "@/app/utils/api/getToken";
import { on } from "events";
import StatusSpan from "../ui/statusSpan";

interface SubsTableProps {
  dataTable: ISubscription[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
const SubsTable: React.FC<SubsTableProps> = ({
  dataTable,
  onEdit,
  onDelete,
}) => {
  const data: ISubscription[] = dataTable;
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState<ISubscription[]>([]);

  // colums
  const columns: ColumnDef<ISubscription, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      // cell: (info) => info.getValue(),
    },
    {
      accessorKey: "company",
      header: "Empresa",
      cell: (info) => info.row.original.company.name,
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: (info) => info.row.original.plan.name,
    },
    {
      accessorKey: "is_active",
      header: "Estado",
      cell: (info) =>
        info.row.original.is_active ? (
          <StatusSpan text="Activo" bg="bg-green-400"/>
        ) : (
          <StatusSpan text="Inactivo" bg="bg-red-500"/>
        ),
    },
    {
      accessorKey: "start_date",
      header: "Fecha de inicio",
      cell: (info) =>
        new Date(info.row.original.start_date).toLocaleDateString(),
    },
    {
      accessorKey: "end_date",
      header: "Fecha de fin",
      cell: (info) => new Date(info.row.original.end_date).toLocaleDateString(),
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: (info) => (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onEdit(info.row.original.id)}
            className="bg-teal-400 hover:bg-teal-500 text-white p-1 aspect-square rounded transition-all duration-500"
          >
            <BiSolidEdit className="text-lg" />
          </button>
          <button
            onClick={() => onDelete(info.row.original.id)}
            className="bg-red-400 hover:bg-red-500 text-white  p-1 rounded aspect-square transition-all duration-500"
          >
            <FiTrash className="text-lg" />
          </button>
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

export default SubsTable;
