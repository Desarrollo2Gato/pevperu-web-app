import { ICourse } from "@/app/types/api";
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
import useFormatDate from "@/app/utils/formateDate";

interface CoursesTableProps {
  dataTable: ICourse[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
const CoursesTable: React.FC<CoursesTableProps> = ({
  dataTable,
  onEdit,
  onDelete,
}) => {
  const data: ICourse[] = dataTable;
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState<ICourse[]>([]);

  // colums
  const columns: ColumnDef<ICourse, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      // cell: (info) => info.getValue(),
    },
    {
      accessorKey: "title",
      header: "Curso",
    },
    {
      accessorKey: "company",
      header: "Empresa",
      cell: (info) => info.row.original.company.name,
    },
    {
      accessorKey: "link",
      header: "Correo de contacto",
      cell: (info) =>
        info.row.original.link ? info.row.original.link : "Sin correo",
    },
    {
      accessorKey: "link",
      header: "Ultima actualización",
      cell: (info) => new Date(info.row.original.updated_at).toLocaleDateString(),
    },

    {
      accessorKey: "actions",
      header: "Acciones",
      cell: (info) => (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onEdit(Number(info.row.original.id))}
            className="bg-teal-400 hover:bg-teal-500 text-white p-1 aspect-square rounded transition-all duration-500"
          >
            <BiSolidEdit className="text-lg" />
          </button>
          <button
            onClick={() => onDelete(Number(info.row.original.id))}
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

export default CoursesTable;