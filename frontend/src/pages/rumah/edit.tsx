import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { PlusSquare } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

import { rumahSchema } from "~/schema";
import { ModalOperation, ModalProps, NewRumah, Rumah } from "~/schema/type";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { axiosInstance } from "~/lib/utls";
import { useEffect } from "react";

function EditRumah({
  data,
  isOpen,
  setIsOpen,
  operation,
}: ModalProps<ModalOperation, Rumah>) {
  const queryClient = useQueryClient();

  const form = useForm<NewRumah>({
    resolver: zodResolver(rumahSchema),
    defaultValues: {
      alamat: "",
      nomorRumah: "",
    },
  });

  useEffect(() => {
    if (data) {
        form.setValue("nomorRumah", data.nomorRumah);
        form.setValue("alamat", data.alamat);
    }
  }, [data]);

  const rumahMutation = useMutation({
    mutationFn: async (value: NewRumah) => {
      return (await axiosInstance.put("/rumah/" + data.id, value)).data;
    },
    onSuccess: (payload) => {
      toast.success(`Rumah ${payload.nomorRumah} berhasil diedit`);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["rumah"] });
    },
    onError: () => {
      toast.error("Rumah gagal diedit");
    },
  });

  function onSubmit(values: NewRumah) {
    rumahMutation.mutate(values);
  }
  return (
    <Dialog
      open={isOpen && operation === "update"}
      onOpenChange={() => {
        form.reset();
        setIsOpen(!isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Rumah</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="nomorRumah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No Rumah</FormLabel>
                  <FormControl>
                    <Input placeholder="75737" {...field} inputMode="numeric" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Block C" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={rumahMutation.isPending}>
                {rumahMutation.isPending ? "Menyimpan" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditRumah;
