import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utls";

import { dateFormat } from "~/lib/utls";
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
import { iuranBulananSchema } from "~/schema";
import {
  ModalOperation,
  ModalProps,
  NewIuranBulanan,
  JenisIuran,
  IuranBulanan,
} from "~/schema/type";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "~/components/ui/select";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { axiosInstance } from "~/lib/utls";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { useParams } from "react-router-dom";

function EditIuran({
  data,
  isOpen,
  setIsOpen,
  operation,
}: ModalProps<ModalOperation, IuranBulanan>) {
  const queryClient = useQueryClient();
  const { kepemilikanId, id: rumahId } = useParams();

  const form = useForm<NewIuranBulanan>({
    resolver: zodResolver(iuranBulananSchema),
    defaultValues: {
      jenisIuranId: 0,
      penghuniOnRumahId: 0,
      tanggalBayar: new Date(),
      setahun: false,
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("jenisIuranId", data.jenisIuranId);
      form.setValue("tanggalBayar", new Date(data.tanggalBayar));
    }
  }, [data]);

  useEffect(() => {
    if (kepemilikanId) {
      form.setValue("penghuniOnRumahId", parseInt(kepemilikanId));
    }
  }, [kepemilikanId]);

  const { data: jenisIuran = [] } = useQuery<JenisIuran[]>({
    queryKey: ["jenis-iuran"],
    queryFn: async () => {
      return (await axiosInstance.get("/jenis-iuran")).data;
    },
  });

  const iuranMutation = useMutation({
    mutationFn: async (value: NewIuranBulanan) => {
      return (await axiosInstance.put("/iuran-bulan/" + data.id, value)).data;
    },
    onSuccess: () => {
      toast.success(`Iuran berhasil diedit`);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["iuran-bulan", { kepemilikan: kepemilikanId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["kepemilikan", { rumahId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["rumah"],
      });
    },
    onError: () => {
      toast.error("Iuran gagal diedit");
    },
  });

  function onSubmit(values: NewIuranBulanan) {
    iuranMutation.mutate(values);
  }
  return (
    <Dialog
      open={isOpen && operation === "update"}
      onOpenChange={() => {
        form.reset({
          jenisIuranId: 0,
          tanggalBayar: new Date(),
        });
        setIsOpen(!isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Iuran</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="jenisIuranId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Iuran</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                    }}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {!field.value
                            ? "Pilih Jenis Iuran"
                            : jenisIuran.find(
                                (jenis) => jenis.id === field.value
                              )?.nama}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jenisIuran.map((jenis) => (
                        <SelectItem value={jenis.id.toString()}>
                          {jenis.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalBayar"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Pembayaran</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            dateFormat(field.value.toString())
                          ) : (
                            <span>Tanggal Bayar</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={iuranMutation.isPending}>
                {iuranMutation.isPending ? "Menyimpan" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditIuran;
