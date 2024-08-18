import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { MoreHorizontal, Calculator, Pencil } from "lucide-react";

import { axiosInstance, dateFormat } from "~/lib/utls";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
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
import AddKepemilikan from "./add";
import { ModalOperation, Kepemilikan as KepemilikanType } from "~/schema/type";
import DeleteKepemilikan from "./delete";
import EditKepemilikan from "./edit";

type DataModal = {
  data?: KepemilikanType;
  operation: ModalOperation;
};

function Kepemilikan() {
  const { id } = useParams<{ id: string }>();
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState<DataModal>({
    operation: "delete",
  });
  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["kepemilikan", { rumah: id }],
    queryFn: async () => {
      return (
        await axiosInstance.get("/kepemilikan", { params: { rumah: id } })
      ).data;
    },
    refetchOnMount: true,
    enabled: !!id,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Histori Pemilik Rumah</h1>
      <ul>
        <li>
          Jika penghuni adalah <strong>Kontrak</strong>, maka harus membayar di
          rentang periode tersebut
        </li>
        <li>
          Jika penghuni adalah <strong>Tetap</strong>, maka harus membayar mulai
          dari dia menetap hingga bulan saat ini
        </li>
        <li>
          Terkadang halaman ini tidak ter-refresh, maka harus refresh manual
        </li>
      </ul>
      <div className="float-right">
        <Button
          variant={"outline"}
          onClick={() => {
            setOpenModal(true);
            setDataModal({ operation: "create" });
          }}
        >
          Tambah Kepemilikan
        </Button>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Periode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Nama Pemilik</TableHead>
            <TableHead>No Telepon</TableHead>
            <TableHead>Dihuni</TableHead>
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
                  {item.mulai ? (
                    <div className="flex items-center gap-x-3">
                      <span>{dateFormat(item.mulai)}</span>
                      {item.selesai && (
                        <>
                          <span>-</span>
                          <span>{dateFormat(item.selesai)}</span>
                        </>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{item.statusHunian}</TableCell>
                <TableCell>{item.namaPenghuni}</TableCell>
                <TableCell>{item.noTelepon}</TableCell>
                <TableCell>{item.menghuni ? "AKTIF" : "TIDAK"}</TableCell>
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
                          to={`/rumah/${id}/kepemilikan/${item.id}/iuran`}
                          className="flex items-center gap-x-3 cursor-pointer"
                        >
                          <Calculator size={16} color="orange" />
                          <span>Iuran</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-x-3 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setDataModal({ data: item, operation: "update" });
                        }}
                      >
                        <Pencil size={16} color="orange" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-x-3 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setDataModal({ data: item, operation: "delete" });
                        }}
                      >
                        <Trash2 size={16} color="red" />
                        <span>Hapus</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AddKepemilikan
        data={dataModal.data as KepemilikanType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
      <EditKepemilikan
        data={dataModal.data as KepemilikanType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />

      <DeleteKepemilikan
        data={dataModal.data as KepemilikanType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
    </div>
  );
}

export default Kepemilikan;
