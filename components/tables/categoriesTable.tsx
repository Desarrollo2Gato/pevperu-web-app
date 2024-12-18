import { ICategory } from "@/types/api";
import { useEffect, useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa6";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { imgUrl } from "@/utils/img/imgUrl";

interface CategoryTableProps {
  dataTable: ICategory[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
const CategoryTable: React.FC<CategoryTableProps> = ({
  dataTable,
  onEdit,
  onDelete,
}) => {
  const data: ICategory[] = dataTable;

  // colums
  const columns: ColumnDef<ICategory, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "icon",
      header: "Ícono",
      cell: (info) =>
        info.row.original.icon ? (
          <img
            className="w-8 h-8 object-contain"
            src={imgUrl(info.row.original.icon)}
            alt="icon"
          />
        ) : (
          <div className="w-8 h-8 rounded flex justify-center items-center border border-green-800  text-green-800">
            <FaRegImage />
          </div>
        ),
    },

    {
      accessorKey: "name",
      header: "Categoría",
    },
    {
      accessorKey: "filter",
      header: "Filtros",
      cell: (info) =>
        info.row.original.filters && info.row.original.filters.length > 0 ? (
          <div className="flex flex-wrap flex-row gap-1">
            {info.row.original.filters.map((filter, index) => (
              <span
                key={index}
                className="rounded-full px-2 py-0.5 text-xs font-medium bg-gray-200 text-zinc-700"
              >
                {filter.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs font-medium">Sin filtros</span>
        ),
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
            className="bg-yellow-400 hover:bg-yellow-500 text-white  p-1 rounded aspect-square transition-all duration-500"
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
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row, index) => (
            <tr
              key={index}
              className={`border-b border-b-gray-200 ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              }`}
            >
              {row.getVisibleCells().map((cell, cIndex) => (
                <td key={cIndex} className="px-2 py-1 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={table.getAllColumns().length}
              className="px-2 py-1 text-center text-zinc-600 text-sm"
            >
              No se encontraron registros
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CategoryTable;
