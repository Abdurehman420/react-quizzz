import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { MdDelete } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLeatherBoard } from "../services/apiLeatherboard";
import toast from "react-hot-toast";

function LeaderBoaardTable({ data, isLoggedIn }) {
  const tableData = useMemo(() => {
    return data
      .map((user) => {
        const score = (user.scored_points / user.total_points).toFixed(2);

        return { ...user, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [data]);

  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const formatSeconds = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const columns = [
    {
      header: "Rank",
      accessorFn: (row, index) => index + 1,
    },
    {
      header: "Username",
      accessorKey: "username",
    },
    {
      header: "Questions",
      accessorKey: "total_questions",
    },
    {
      header: "Score / total",
      accessorFn: (row) => `${row.scored_points} / ${row.total_points}`,
    },
    {
      header: "Time Taken",
      accessorFn: (row) => `${formatSeconds(row.time_taken)} / ${formatSeconds(row.total_time)}`,
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (id) => deleteLeatherBoard(id),
    onSuccess: () => {
      toast.success("Board deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["leatherboards"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClick = (row) => {
    mutate(row.original.id);
  };

  return (
    <>
      <input
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        placeholder="Search"
      />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}{" "}
                  {{ asc: "▲", desc: "▼" }[header.column.getIsSorted() ?? null]}
                </th>
              ))}
              <th> </th>
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())} </td>
              ))}
              {isLoggedIn && (
                <td className="DeleteTableRow" onClick={() => handleClick(row)} disabled={isLoading}>
                  <MdDelete size={25} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className="btn" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
          Previous Page
        </button>
        <button className="btn" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
          Next Page
        </button>
      </div>
    </>
  );
}

export default LeaderBoaardTable;
