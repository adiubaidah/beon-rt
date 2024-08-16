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
  DialogTrigger,
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
import { ModalOperation, ModalProps, NewRumah } from "~/schema/type";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { axiosInstance } from "~/lib/utls";

function AddRumah({
  data,
  isOpen,
  setIsOpen,
  operation,
}: ModalProps<ModalOperation, NewRumah>) {
  const queryClient = useQueryClient();

  const form = useForm<NewRumah>({
    resolver: zodResolver(rumahSchema),
    defaultValues: {
      alamat: "",
      nomorRumah: "",
    },
  });

  const rumahMutation = useMutation({
    mutationKey: ["add-rumah"],
    mutationFn: async (value: NewRumah) => {
      return (await axiosInstance.post("/rumah", value)).data;
    },
    onSuccess: (payload) => {
      toast.success(`Rumah ${payload.nomorRumah} berhasil ditambahkan`);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["rumah"] });
    },
    onError: () => {
      toast.error("Rumah gagal ditambahkan");
    },
  });

  function onSubmit(values: NewRumah) {
    rumahMutation.mutate(values);
  }
  return (
    <Dialog
      open={isOpen && operation === "create"}
      onOpenChange={() => {
        form.reset();
        setIsOpen(!isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Rumah</DialogTitle>
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

export default AddRumah;
