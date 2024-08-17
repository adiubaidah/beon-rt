import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { Calendar } from "~/components/ui/calendar";
import { axiosInstance, dateFormat, rupiahFormat, cn } from "~/lib/utls";
import {
  Pengeluaran as PengeluaranType,
  NewPengeluaran,
  ModalOperation,
} from "~/schema/type";
import { Input } from "~/components/ui/input";
import AddPengeluaran from "./add";
import EditPengeluaran from "./edit";
import DeletePengeluaran from "./delete";

type DataModal = {
  data?: PengeluaranType;
  operation: ModalOperation;
};

function Pengeluaran() {
  const [openModal, setOpenModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [dataModal, setDataModal] = useState<DataModal>({
    operation: "delete",
  });
  const [date, setDate] = useState<DateRange>();

  const { data = [], isLoading } = useQuery<PengeluaranType[]>({
    queryKey: ["pengeluaran", date, searchParams.get("q")],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/pengeluaran", {
        params: {
          from: date?.from,
          to: date?.to,
          q: searchParams.get("q") || "",
        },
      });
      return data;
    },
  });

  const handleSearchChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const params = new URLSearchParams();
      params.set("q", value);
      const queryString = params.toString();
      setSearchParams(queryString);
    },
    400
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Daftar Pengeluaran</h1>
      <div className="mt-3">
        <div>
          <Button
            variant={"outline"}
            onClick={() => {
              setOpenModal(true);
              setDataModal({ operation: "create" });
            }}
          >
            Tambah Pengeluaran
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Input
            className="w-1/3"
            placeholder="Cari nama pengeluaran"
            onChange={handleSearchChange}
            defaultValue={searchParams.get("q") || ""}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Cari tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                numberOfMonths={2}
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableCell>Loading...</TableCell>
          ) : (
            data?.map((pengeluaran) => (
              <TableRow>
                <TableCell>
                  {dateFormat(pengeluaran.tanggal.toString())}
                </TableCell>
                <TableCell>{pengeluaran.nama}</TableCell>
                <TableCell>{rupiahFormat(pengeluaran.nominal)}</TableCell>
                <TableCell>{pengeluaran.keterangan}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="flex items-center gap-x-3 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setDataModal({
                            data: pengeluaran,
                            operation: "update",
                          });
                        }}
                      >
                        <Pencil size={20} color="orange" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-x-3 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setDataModal({
                            data: pengeluaran,
                            operation: "delete",
                          });
                        }}
                      >
                        <Trash2 size={20} color="red" />
                        <span>Hapus</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <AddPengeluaran
        data={dataModal.data as NewPengeluaran}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
      <EditPengeluaran
        data={dataModal.data as PengeluaranType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
      <DeletePengeluaran
        data={dataModal.data as PengeluaranType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
    </div>
  );
}

export default Pengeluaran;
