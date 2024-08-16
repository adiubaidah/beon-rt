import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { MoreHorizontal, Calculator } from "lucide-react";

import { axiosInstance, dateFormat } from "~/lib/utls";
import { Button } from "~/components/ui/button";
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
import { Badge } from "~/components/ui/badge";

function Penghuni() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["penghuni", { rumah: id }],
    queryFn: async () => {
      return (
        await axiosInstance.get("/kepemilikan", { params: { rumah: id } })
      ).data;
    },
    enabled: !!id,
  });

  return (
    <div>
      <h1>Histori Pemilik Rumah</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Periode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Nama Pemilik</TableHead>
            <TableHead>No Telepon</TableHead>
            <TableHead>Iuran</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableCell>Loading...</TableCell>
          ) : (
            data?.map((item) => (
              <TableRow>
                <TableCell>
                  {item.mulai && item.selesai ? (
                    <div className="flex items-center gap-x-3">
                      <span>{dateFormat(item.mulai)}</span>
                      <span>-</span>
                      <span>{dateFormat(item.selesai)}</span>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{item.statusHunian}</TableCell>
                <TableCell>{item.namaPenghuni}</TableCell>
                <TableCell>{item.noTelepon}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.isLunas === "1" ? "default" : "destructive"}
                  >
                    {item.isLunas === "1" ? "Lunas" : "Belum Lunas"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link
                          to={`/rumah/${id}/penghuni/${item.penghuniId}/iuran`}
                          className="flex items-center gap-x-3 cursor-pointer"
                        >
                          <Calculator size={16} color="orange" />
                          <span>Iuran</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default Penghuni;
