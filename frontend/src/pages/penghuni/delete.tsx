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
import { ModalOperation, ModalProps, Penghuni } from "~/schema/type";
function DeletePenghuni({
  data,
  isOpen,
  operation,
  setIsOpen,
}: ModalProps<ModalOperation, Penghuni>) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["delete-mutation"],
    mutationFn: async () => {
      return (await axiosInstance.delete("/penghuni/" + data.id)).data;
    },
    onSuccess: () => {
      toast.success(`Penghuni berhasil dihapus`);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["penghuni"],
      });
    },
    onError: () => {
      toast.error("Penghuni gagal dihapus");
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
              Anda akan menghapus {data.nama} ?
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

export default DeletePenghuni;
