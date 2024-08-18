import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { axiosInstance, rupiahFormat } from "~/lib/utls";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import {
  ModalOperation,
  JenisIuran as JenisIuranType,
  NewJenisIuran,
} from "~/schema/type";
import AddJenisIuran from "./add";
import DeleteJenisIuran from "./delete";
import EditJenisIuran from "./edit";

type DataModal = {
  data?: JenisIuranType;
  operation: ModalOperation;
};

function JenisIuran() {
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState<DataModal>({
    operation: "delete",
  });
  const { data, isLoading } = useQuery<JenisIuranType[]>({
    queryKey: ["jenis-iuran"],
    queryFn: async () => {
      return (await axiosInstance.get("/jenis-iuran")).data;
    },
  });
  return (
    <div>
      <h1>Daftar Penghuni</h1>
      <div className="float-right">
        <Button
          variant={"outline"}
          onClick={() => {
            setOpenModal(true);
            setDataModal({ operation: "create" });
          }}
        >
          Tambah Jenis Iuran
        </Button>
      </div>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableCell>Loading...</TableCell>
          ) : (
            data?.map((jenisIuran) => (
              <TableRow>
                <TableCell>{jenisIuran.id}</TableCell>
                <TableCell>{jenisIuran.nama}</TableCell>
                <TableCell>{jenisIuran.deskripsi}</TableCell>
                <TableCell>{rupiahFormat(jenisIuran.nominal)}</TableCell>
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
                      <DropdownMenuItem
                        className="flex items-center gap-x-3 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setDataModal({
                            data: jenisIuran,
                            operation: "update",
                          });
                        }}
                      >
                        <Pencil size={16} color="orange" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-x-3 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setDataModal({
                            data: jenisIuran,
                            operation: "delete",
                          });
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

      <AddJenisIuran
        data={dataModal.data as NewJenisIuran}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />

      <EditJenisIuran
        data={dataModal.data as JenisIuranType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />

      <DeleteJenisIuran
        data={dataModal.data as JenisIuranType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
    </div>
  );
}

export default JenisIuran;
