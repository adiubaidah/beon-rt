import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { CalendarIcon } from "lucide-react";

import { Input } from "~/components/ui/input";
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

import { Calendar } from "~/components/ui/calendar";
import { axiosInstance, dateFormat, rupiahFormat, cn } from "~/lib/utls";

function Pemasukan() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, setDate] = useState<DateRange>();

  const { data = [], isLoading } = useQuery<any[]>({
    queryKey: ["pemasukan", date, searchParams.get("q")],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/iuran-bulan", {
        params: {
          from: date?.from,
          to: date?.to,
          q: searchParams.get("q") || "",
          penghuni: "1",
          rumah: "1",
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
      <h1 className="text-2xl font-bold">Daftar Pemasukan</h1>
      <p>Pemasukan didapatkan dari semua iuran penghuni tiap bulannya</p>
      <div className="mt-4 flex items-center justify-between">
        <Input
          className="w-1/3"
          placeholder="Cari Pemasukan"
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
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>No Rumah</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Iuran</TableHead>
            <TableHead>Nominal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableCell>Loading...</TableCell>
          ) : (
            data?.map((pemasukan) => (
              <TableRow>
                <TableCell>
                  {dateFormat(pemasukan.tanggalBayar.toString())}
                </TableCell>
                <TableCell>{pemasukan.penghuni.rumah.nomorRumah}</TableCell>
                <TableCell>{pemasukan.penghuni.penghuni.nama}</TableCell>
                <TableCell>{pemasukan.jenisIuran.nama}</TableCell>
                <TableCell>{rupiahFormat(pemasukan.nominal)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default Pemasukan;
