import toast from "react-hot-toast";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { axiosInstance, rupiahFormat } from "~/lib/utls";
import { jenisIuranSchema } from "~/schema";
import { ModalOperation, NewJenisIuran, ModalProps } from "~/schema/type";

function AddJenisIuran({
  data,
  isOpen,
  setIsOpen,
  operation,
}: ModalProps<ModalOperation, NewJenisIuran>) {
  const queryClient = useQueryClient();
  const form = useForm<NewJenisIuran>({
    resolver: zodResolver(jenisIuranSchema),
    defaultValues: {
      deskripsi: "",
      nominal: 0,
      nama: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (value: NewJenisIuran) => {
      return (await axiosInstance.post("/jenis-iuran", value)).data;
    },
    onSuccess: () => {
      toast.success(`Jenis iuran berhasil ditambahkan`);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["jenis-iuran"] });
    },
    onError: () => {
      toast.error("Jenis iuran gagal ditambahkan");
    },
  });

  const onSubmit = async (value: NewJenisIuran) => {
    await mutation.mutateAsync(value);
  };

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
          <DialogTitle>Tambah Penghuni</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 px-4"
          >
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Wakimin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nominal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nominal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rp 10.000"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/Rp|\s|\./g, "");
                        if (!value || !isNaN(Number(value))) {
                          field.onChange(Number(value));
                        }
                      }}
                      value={field.value ? rupiahFormat(field.value) : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="deskripsi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Menyimpan" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddJenisIuran;
