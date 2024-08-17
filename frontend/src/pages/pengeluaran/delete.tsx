import React from "react";
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
import { axiosInstance } from "~/lib/utls";
import { Button } from "~/components/ui/button";
import { ModalOperation, ModalProps, Pengeluaran } from "~/schema/type";
function DeletePengeluaran({
  data,
  isOpen,
  operation,
  setIsOpen,
}: ModalProps<ModalOperation, Pengeluaran>) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["delete-mutation"],
    mutationFn: async () => {
      return (await axiosInstance.delete("/pengeluaran/" + data.id)).data;
    },
    onSuccess: () => {
      toast.success(`Pengeluaran berhasil dihapus`);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["pengeluaran"],
      });
    },
    onError: () => {
      toast.error("Pengeluaran gagal dihapus");
    },
  });

  const handleDelete = () => {
    mutation.mutate();
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
              Anda akan menghapus pengeluaran ini ?
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
            disabled={mutation.isPending}
            variant={"destructive"}
            onClick={handleDelete}
          >
            {mutation.isPending ? (
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

export default DeletePengeluaran;
