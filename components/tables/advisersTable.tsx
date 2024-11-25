import { IAdviser } from "@/types/api";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import { BootstrapTooltip } from "../ui/tooltip";
import { FiEye, FiTrash } from "react-icons/fi";

interface AdviserTableProps {
  dataTable: IAdviser[];
  onDelete?: (id: number) => void;
  onShow?: (id: number) => void;
}
const AdviserTable: React.FC<AdviserTableProps> = ({
  dataTable,
  onDelete,
  onShow,
}) => {
  const data: IAdviser[] = dataTable;

  // colums
  const columns: ColumnDef<IAdviser, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "names",
      header: "Nombres",
    },
    {
      accessorKey: "last_names",
      header: "Apellidos",
    },
    {
      accessorKey: "nationality",
      header: "Nacionalidad",
    },
    {
      accessorKey: "specialty",
      header: "Especialidad",
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: (info) => (
        <div className="flex gap-2 flex-wrap">
          {onDelete && (
            // <BootstrapTooltip title="Banear" placement="top">
            <button
              onClick={() => onDelete(Number(info.row.original.id))}
              className="bg-red-500 hover:bg-red-600 text-white p-1 aspect-square rounded transition-all duration-500"
            >
              <FiTrash className="text-lg" />
            </button>
            // </BootstrapTooltip>
          )}
          {onShow && (
            <button
              onClick={() => onShow(Number(info.row.original.id))}
              className="bg-sky-500 hover:bg-sky-600 text-white p-1 aspect-square rounded transition-all duration-500"
            >
              <FiEye className="text-lg" />
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

export default AdviserTable;
