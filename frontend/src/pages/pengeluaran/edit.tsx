import toast from "react-hot-toast";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";

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

import { Calendar } from "~/components/ui/calendar";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { axiosInstance, cn, rupiahFormat } from "~/lib/utls";
import { pengeluaranSchema } from "~/schema";
import {
  ModalOperation,
  NewPengeluaran,
  ModalProps,
  Pengeluaran,
} from "~/schema/type";
import { useEffect } from "react";

function EditPengeluaran({
  data,
  isOpen,
  setIsOpen,
  operation,
}: ModalProps<ModalOperation, Pengeluaran>) {
  const queryClient = useQueryClient();
  const form = useForm<NewPengeluaran>({
    resolver: zodResolver(pengeluaranSchema),
    defaultValues: {
      keterangan: undefined,
      nama: "",
      nominal: 0,
      tanggal: new Date(),
    },
  });

  useEffect(() => {
    if (data) {
      if (data.keterangan) {
        form.setValue("keterangan", data.keterangan);
      }
      form.setValue("nama", data.nama);
      form.setValue("nominal", data.nominal);
      form.setValue("tanggal", new Date(data.tanggal));
    }
  }, [data]);

  const pengeluaranMutation = useMutation({
    mutationFn: async (value: NewPengeluaran) => {
      return (await axiosInstance.put("/pengeluaran/" + data.id, value)).data;
    },
    onSuccess: () => {
      toast.success(`Pengeluaran berhasil diedit`);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["pengeluaran"] });
    },
    onError: () => {
      toast.error("Pengeluaran gagal diedit");
    },
  });

  const onSubmit = async (value: NewPengeluaran) => {
    await pengeluaranMutation.mutateAsync(value);
  };

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
          <DialogTitle>Edit Pengeluaran</DialogTitle>
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
              name="tanggal"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Pengeluaran</FormLabel>
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
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Keterangan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={pengeluaranMutation.isPending}>
                {pengeluaranMutation.isPending ? "Menyimpan" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditPengeluaran;
