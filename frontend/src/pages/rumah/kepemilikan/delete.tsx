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
import { ModalOperation, ModalProps, Kepemilikan } from "~/schema/type";
function DeleteKepemilikan({
  data,
  isOpen,
  operation,
  setIsOpen,
}: ModalProps<ModalOperation, Kepemilikan>) {
  const queryClient = useQueryClient();

  const { id: rumahId } = useParams();

  const kepemilikanMutation = useMutation({
    mutationKey: ["delete-mutation"],
    mutationFn: async () => {
      return (await axiosInstance.delete("/kepemilikan/" + data.id)).data;
    },
    onSuccess: () => {
      toast.success(`Kepemilikan berhasil dihapus`);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["kepemilikan", { rumah: rumahId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["rumah"],
      });
    },
    onError: () => {
      toast.error("Kepemilikan gagal dihapus");
    },
  });

  const handleDelete = () => {
    kepemilikanMutation.mutate();
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
              Anda akan menghapus kepemilikan ini ?
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
            disabled={kepemilikanMutation.isPending}
            variant={"destructive"}
            onClick={handleDelete}
          >
            {kepemilikanMutation.isPending ? (
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

export default DeleteKepemilikan;
