import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { axiosInstance, dateFormat, rupiahFormat, cn } from "~/lib/utls";
import { Button } from "~/components/ui/button";
import { MoreHorizontal, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { IuranBulanan, ModalOperation } from "~/schema/type";
import { useParams } from "react-router-dom";
import AddIuran from "./add";
import EditIuran from "./edit";
import DeleteIuran from "./delete";
import { DateRange } from "react-day-picker";

type DataModal = {
  data?: IuranBulanan;
  operation: ModalOperation;
};

function Iuran() {
  const { kepemilikanId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState<DataModal>({
    operation: "delete",
  });

  const [date, setDate] = useState<DateRange>();

  const { data = [] } = useQuery<IuranBulanan[]>({
    queryKey: ["iuran-bulan", { kepemilikan: kepemilikanId }, date],
    queryFn: async () => {
      return (
        await axiosInstance.get("/iuran-bulan", {
          params: {
            kepemilikan: kepemilikanId,
            from: date?.from,
            to: date?.to,
          },
        })
      ).data;
    },
    enabled: !!kepemilikanId,
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Iuran Bulan</h1>

      <ul>
        <li>Iuran kontrak dibayar harus antara mulai mengontrak dan selesai</li>
      </ul>

      <div className="flex items-center justify-between mt-3">
        <Button
          variant={"outline"}
          onClick={() => {
            setOpenModal(true);
            setDataModal({ operation: "create" });
          }}
        >
          Tambah Iuran
        </Button>

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
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal Bayar</TableHead>
            <TableHead>Jenis Iuran</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((iuran) => {
            return (
              <TableRow key={iuran.id}>
                <TableCell>
                  {dateFormat(iuran.tanggalBayar.toString())}
                </TableCell>
                <TableCell>{iuran.jenisIuran.nama}</TableCell>
                <TableCell>{rupiahFormat(iuran.nominal)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Action</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="flex items-center gap-x-3 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setDataModal({ data: iuran, operation: "update" });
                        }}
                      >
                        <Pencil size={16} color="orange" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-x-3 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setDataModal({ data: iuran, operation: "delete" });
                        }}
                      >
                        <Trash2 size={16} color="red" />
                        <span>Hapus</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow></TableRow>
        </TableBody>
      </Table>

      <AddIuran
        data={dataModal.data as IuranBulanan}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
      <EditIuran
        data={dataModal.data as IuranBulanan}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />

      <DeleteIuran
        data={dataModal.data as IuranBulanan}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
    </div>
  );
}

export default Iuran;
