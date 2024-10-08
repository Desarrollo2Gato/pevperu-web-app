import { IUser } from "@/types/api";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import StatusSpan from "../ui/statusSpan";
import { FaBan } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { BootstrapTooltip } from "../ui/tooltip";

interface UsersTableProps {
  dataTable: IUser[];
  onSuspend: (id: number) => void;
  onUnsuspend: (id: number) => void;
}
const UsersTable: React.FC<UsersTableProps> = ({
  dataTable,
  onSuspend,
  onUnsuspend,
}) => {
  const data: IUser[] = dataTable;

  // colums
  const columns: ColumnDef<IUser, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
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
          <StatusSpan text="Activo" bg="bg-green-400" />
        ) : (
          <StatusSpan text="Baneado" bg="bg-red-600" />
        ),
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: (info) => (
        <>
          {info.row.original.status === "approved" ? (
            <BootstrapTooltip title="Banear" placement="top">
              <button
                onClick={() => onSuspend(Number(info.row.original.id))}
                className="bg-red-500 hover:bg-red-600 text-white p-1 aspect-square rounded transition-all duration-500"
              >
                <FaBan className="text-lg" />
              </button>
            </BootstrapTooltip>
          ) : (
            <BootstrapTooltip title="Desbanear" placement="top">
              <button
                onClick={() => onUnsuspend(Number(info.row.original.id))}
                className="bg-green-400 hover:bg-green-500 text-white p-1 aspect-square rounded transition-all duration-500"
              >
                <FaCheck className="text-lg" />
              </button>
            </BootstrapTooltip>
          )}
        </>
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

export default UsersTable;
