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
import { axiosInstance, imageFromBackend } from "~/lib/utls";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import {
  ModalOperation,
  NewPenghuni,
  Penghuni as PenghuniType,
} from "~/schema/type";
import AddPenghuni from "./add";
import EditPenghuni from "./edit";
import DeletePenghuni from "./delete";

type DataModal = {
  data?: PenghuniType;
  operation: ModalOperation;
};

function Penghuni() {
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState<DataModal>({
    operation: "delete",
  });
  const { data, isLoading } = useQuery<PenghuniType[]>({
    queryKey: ["penghuni"],
    queryFn: async () => {
      return (await axiosInstance.get("/penghuni")).data;
    },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Daftar Penghuni</h1>
      <div className="float-right">
        <Button
          variant={'outline'}
          onClick={() => {
            setOpenModal(true);
            setDataModal({ operation: "create" });
          }}
        >
          Tambah Penghuni
        </Button>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Foto KTP</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>No Telepon</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableCell>Loading...</TableCell>
          ) : (
            data?.map((penghuni) => (
              <TableRow>
                <TableCell>{penghuni.id}</TableCell>
                <TableCell>{penghuni.nama}</TableCell>
                <TableCell>
                  {<img src={imageFromBackend(penghuni.fotoKTP)} width={150} />}
                </TableCell>
                <TableCell>{penghuni.gender}</TableCell>
                <TableCell>{penghuni.noTelepon}</TableCell>
                <TableCell>
                  {penghuni.menikah ? "Menikah" : "Belum Menikah"}
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
                      <DropdownMenuItem
                        className="flex items-center gap-x-3 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setDataModal({ data: penghuni, operation: "update" });
                        }}
                      >
                        <Pencil size={16} color="orange" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-x-3 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setDataModal({ data: penghuni, operation: "delete" });
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

      {/* Modal */}
      <AddPenghuni
        data={dataModal.data as NewPenghuni}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />

      <DeletePenghuni
        data={dataModal.data as PenghuniType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />

      <EditPenghuni
        data={dataModal.data as PenghuniType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
    </div>
  );
}

export default Penghuni;
