import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

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

import { penghuniSchema } from "~/schema";
import { ModalOperation, ModalProps, NewPenghuni } from "~/schema/type";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { axiosInstance } from "~/lib/utls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ScrollArea } from "~/components/ui/scroll-area";

function AddPenghuni({
  data,
  isOpen,
  setIsOpen,
  operation,
}: ModalProps<ModalOperation, NewPenghuni>) {
  const queryClient = useQueryClient();

  const form = useForm<NewPenghuni>({
    resolver: zodResolver(penghuniSchema),
    defaultValues: {
      gender: "LAKI_LAKI",
      menikah: false,
      nama: "",
      noTelepon: "",
    },
  });

  const [fotoKTP, setFotoKTP] = useState<File | null>();
  const handleFotoKTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setFotoKTP(files[0]);
    }
  };

  //   useEffect(() => {
  //     console.log(form.formState.errors);
  //   }, [form.formState.errors]);

  const penghuniMutation = useMutation({
    mutationKey: ["add-penghuni"],
    mutationFn: async (value: FormData) => {
      return (
        await axiosInstance.post("/penghuni", value, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;
    },
    onSuccess: (payload) => {
      toast.success(`Penghuni ${payload.nama} berhasil ditambahkan`);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["penghuni"] });
    },
    onError: () => {
      toast.error("Penghuni gagal ditambahkan");
    },
  });

  function onSubmit(values: NewPenghuni) {
    const formData = new FormData();

    formData.append("nama", values.nama);
    formData.append("noTelepon", values.noTelepon);
    formData.append("gender", values.gender);
    formData.append("menikah", values.menikah ? "1" : "0");
    if (fotoKTP instanceof File) {
      console.log(fotoKTP);
      formData.append("fotoKTP", fotoKTP);
    }

    penghuniMutation.mutate(formData);
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
          <DialogTitle>Tambah Penghuni</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <ScrollArea className="h-[500px] overflow-y-auto">
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
                name="noTelepon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="08123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LAKI_LAKI">Laki - laki</SelectItem>
                        <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="menikah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "1")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Menikah</SelectItem>
                        <SelectItem value="0">Belum Menikah</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div>
                <label htmlFor="">Foto KTP</label>
                {fotoKTP ? (
                  <img
                    src={fotoKTP ? URL.createObjectURL(fotoKTP) : ""}
                    width={224}
                    height={224}
                  />
                ) : (
                  <div className="bg-gray-400 w-56 h-56"></div>
                )}

                <Input
                  type="file"
                  name="gambar"
                  placeholder="pilih gambar"
                  onChange={handleFotoKTPChange}
                  disabled={penghuniMutation.isPending}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={penghuniMutation.isPending}>
                  {penghuniMutation.isPending ? "Menyimpan" : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddPenghuni;
