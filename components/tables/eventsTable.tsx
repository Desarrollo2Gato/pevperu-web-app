import { IEvents } from "@/types/api";
import { useState } from "react";
import { BiSolidEdit, BiCheck, BiX } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import StatusSpan from "../ui/statusSpan";
import { BootstrapTooltip } from "../ui/tooltip";

interface EventsTableProps {
  dataTable: IEvents[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  isAdmin?: boolean;

}
const EventsTable: React.FC<EventsTableProps> = ({
  dataTable,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  isAdmin = false,

}) => {
  const data: IEvents[] = dataTable;
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState<IEvents[]>([]);

  // colums
  const columns: ColumnDef<IEvents, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      // cell: (info) => info.getValue(),
    },
    {
      accessorKey: "name",
      header: "Titulo",
    },
    {
      accessorKey: "type",
      header: "Tipo",
    },
    {
      accessorKey: "company",
      header: "Autor",
      cell: (info) =>
        info.row.original.company
          ? info.row.original.company.name
          : info.row.original.extern_user
          ? info.row.original.extern_user.work_for_company
          : "sin autor",
    },
    ...(isAdmin
      ? [
          {
            accessorKey: "type",
            header: "Usuario",
            cell: (info: any) =>
              info.row.original.company ? "Empresa" : "Publicista",
          },
        ]
      : []),
    {
      accessorKey: "status",
      header: "Estado",
      cell: (info) =>
        info.row.original.status === "approved" ? (
          <StatusSpan text="Aprobado" bg="bg-green-400" />
        ) : info.row.original.status === "pending" ? (
          <StatusSpan text="Pendiente" bg="bg-blue-600" />
        ) : (
          <StatusSpan text="Rechazado" bg="bg-red-500" />
        ),
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: (info) => (
        <div className="flex flex-col gap-2">
          {info.row.original.status === "pending" && (
            <div className="flex flex-row gap-2">
              {onApprove && (
                <BootstrapTooltip title="Aprobar" placement="top">
                  <button
                    onClick={() => onApprove(Number(info.row.original.id))}
                    className="bg-green-400 hover:bg-green-500 text-white p-1 aspect-square rounded transition-all duration-500"
                  >
                    <BiCheck className="text-lg" />
                  </button>
                </BootstrapTooltip>
              )}
              {onReject && (
                <BootstrapTooltip title="Rechazar" placement="top">
                  <button
                    onClick={() => onReject(Number(info.row.original.id))}
                    className="bg-red-400 hover:bg-red-500 text-white p-1 aspect-square rounded transition-all duration-500"
                  >
                    <BiX className="text-lg" />
                  </button>
                </BootstrapTooltip>
              )}
            </div>
          )}
          <div className="flex flex-row gap-2">
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

export default EventsTable;
