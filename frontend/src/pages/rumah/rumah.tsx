import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, History, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { axiosInstance } from "~/lib/utls";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import { ModalOperation, NewRumah, Rumah as RumahType } from "~/schema/type";
import AddRumah from "./add";
import EditRumah from "./edit";
import DeleteRumah from "./delete";

type DataModal = {
  data?: RumahType;
  operation: ModalOperation;
};

function Rumah() {
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState<DataModal>({
    operation: "delete",
  });
  const { data, isLoading } = useQuery({
    queryKey: ["rumah"],
    queryFn: async () => {
      return (await axiosInstance.get("/rumah")).data;
    },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Daftar Rumah</h1>
      <div className="float-right">
        <Button
          variant={"outline"}
          onClick={() => {
            setOpenModal(true);
            setDataModal({ operation: "create" });
          }}
        >
          Tambah Rumah
        </Button>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Penghuni Terakhir</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dihuni</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? () => <TableCell>Loading...</TableCell>
            : data.map((rumah: any) => (
                <TableRow>
                  <TableCell>{rumah.nomorRumah}</TableCell>
                  <TableCell>{rumah.alamat}</TableCell>
                  <TableCell>{rumah.namaPenghuni}</TableCell>
                  <TableCell>{rumah.statusHunian}</TableCell>
                  <TableCell>
                    <Badge variant={rumah.menghuni ? "default" : "secondary"}>
                      {rumah.menghuni ? "Dihuni" : "Kosong"}
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
                            to={`/rumah/${rumah.id}/kepemilikan`}
                            className="cursor-pointer"
                          >
                            <History className="w-5 h-5 mr-2" />
                            <span>History Penghuni</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-x-3 cursor-pointer"
                          onClick={() => {
                            setOpenModal(true);
                            setDataModal({ data: rumah, operation: "update" });
                          }}
                        >
                          <Pencil size={16} color="orange" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-x-3 cursor-pointer"
                          onClick={() => {
                            setOpenModal(true);
                            setDataModal({ data: rumah, operation: "delete" });
                          }}
                        >
                          <Trash2 size={16} color="red" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {/* Modal */}
      <AddRumah
        data={dataModal.data as NewRumah}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
      <EditRumah
        data={dataModal.data as RumahType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
      <DeleteRumah
        data={dataModal.data as RumahType}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        operation={dataModal.operation}
      />
    </div>
  );
}

export default Rumah;
