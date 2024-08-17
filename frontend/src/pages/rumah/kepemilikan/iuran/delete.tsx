import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { axiosInstance, dateFormat } from "~/lib/utls";
import { Button } from "~/components/ui/button";
import {
  ModalOperation,
  ModalProps,
  IuranBulanan,
} from "~/schema/type";
function DeleteIuran({
  data,
  isOpen,
  operation,
  setIsOpen,
}: ModalProps<ModalOperation, IuranBulanan>) {
  const queryClient = useQueryClient();

  const { kepemilikanId } = useParams();

  const iuranMutation = useMutation({
    mutationKey: ["delete-mutation"],
    mutationFn: async () => {
      return (await axiosInstance.delete("/iuran-bulan/" + data.id)).data;
    },
    onSuccess: () => {
      toast.success(`Iuran berhasil dihapus`);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["iuran-bulan", { kepemilikan: kepemilikanId }],
      });
    },
    onError: () => {
      toast.error("Iuran gagal dihapus");
    },
  });

  const handleDelete = () => {
    iuranMutation.mutate();
  };
  return (
    <AlertDialog
      open={isOpen && operation === "delete"}
      onOpenChange={setIsOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anda yakin ?</AlertDialogTitle>
          {data && data.id && (
            <AlertDialogDescription>
              Anda akan menghapus transaksi tanggal{" "}
              {dateFormat(data.tanggalBayar.toString())}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="default"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Batal
          </Button>

          <Button
            type="submit"
            disabled={iuranMutation.isPending}
            variant={"destructive"}
            onClick={handleDelete}
          >
            {iuranMutation.isPending ? (
              <React.Fragment>
                <Loader2 className="animate-spin" />
                Menghapus
              </React.Fragment>
            ) : (
              "Hapus"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteIuran;
