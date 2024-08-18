import toast from "react-hot-toast";
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
import {
  ModalOperation,
  NewJenisIuran,
  ModalProps,
  JenisIuran,
} from "~/schema/type";
import { useEffect } from "react";

function EditJenisIuran({
  data,
  isOpen,
  setIsOpen,
  operation,
}: ModalProps<ModalOperation, JenisIuran>) {
  const queryClient = useQueryClient();
  const form = useForm<NewJenisIuran>({
    resolver: zodResolver(jenisIuranSchema),
    defaultValues: {
      deskripsi: "",
      nominal: 0,
      nama: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("nama", data.nama);
      form.setValue("nominal", data.nominal);
      form.setValue("deskripsi", data.deskripsi);
    }
  }, [data]);

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
          <DialogTitle>Edit Jenis Iuran</DialogTitle>
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
                    <Input placeholder="Listrik" {...field} />
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

export default EditJenisIuran;
