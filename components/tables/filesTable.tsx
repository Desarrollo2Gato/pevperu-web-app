import { BiSolidEdit } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";
import { FaArrowDown } from "react-icons/fa";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { imgUrl } from "@/utils/img/imgUrl";
import Link from "next/link";
import { BootstrapTooltip } from "../ui/tooltip";

interface FilesTableProps {
  dataTable: any[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}
const FilesTable: React.FC<FilesTableProps> = ({
  dataTable,
  onEdit,
  onDelete,
}) => {
  const data: any[] = dataTable;

  // colums
  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "product",
      header: "Producto",
      cell: (info) => info.row.original.product.name,
    },
    {
      accessorKey: "category",
      header: "Categoría",
      cell: (info) => (
        <span
          style={{
            backgroundColor: info.row.original.product.category.background_color,
            color: info.row.original.product.category.text_color,
          }}
          className={`rounded-full px-2 py-0.5 text-xs font-medium `}
        >
          {info.row.original.product.category.name}
        </span>
      ),
    },
    {
      accessorKey: "file_type",
      header: "Tipo de archivo",
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: (info) => (
        <div className="flex justify-center items-center gap-2">
          <BootstrapTooltip title="Descargar" placement="top">
            <Link
              target="_blank"
              href={imgUrl(info.row.original.file_url)}
              className="bg-purple-400 hover:bg-purple-500 text-white p-1 aspect-square rounded transition-all duration-500"
            >
              <FaArrowDown className="text-lg" />
            </Link>
          </BootstrapTooltip>
          {onEdit && (
            <button
              onClick={() => onEdit(Number(info.row.original.id))}
              className="bg-teal-400 hover:bg-teal-500 text-white p-1 aspect-square rounded transition-all duration-500"
            >
              <BiSolidEdit className="text-lg" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(Number(info.row.original.id))}
              className="bg-yellow-400 hover:bg-yellow-500 text-white  p-1 rounded aspect-square transition-all duration-500"
            >
              <FiTrash className="text-lg" />
            </button>
          )}
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

export default FilesTable;
