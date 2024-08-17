import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CalendarIcon } from "lucide-react";
import { cn, dateFormat } from "~/lib/utls";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "~/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { axiosInstance } from "~/lib/utls";
import { kepemilikanSchema } from "~/schema";
import { ModalOperation, ModalProps, Kepemilikan } from "~/schema/type";
import { Penghuni } from "~/schema/type";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { NewKepemilikan } from "~/schema/type";
import { Button } from "~/components/ui/button";

function AddKepemilikan({
  data,
  isOpen,
  setIsOpen,
  operation,
}: ModalProps<ModalOperation, Kepemilikan>) {
  const queryClient = useQueryClient();
  const { id: rumahId } = useParams<{ id: string }>();
  const [searchPenghuni, setsearchPenghuni] = useState("");
  const [kontrak, setKontrak] = useState(false);

  const { data: penghuni = [], isLoading } = useQuery<Penghuni[]>({
    queryKey: ["penghuni", searchPenghuni],
    queryFn: async () => {
      return (await axiosInstance.get("/penghuni")).data;
    },
  });

  const handleSearchPenghuni = useDebounce((value: string) => {
    setsearchPenghuni(value);
  }, 500);

  const form = useForm<NewKepemilikan>({
    resolver: zodResolver(kepemilikanSchema),
    defaultValues: {
      mulai: new Date(),
      penghuniId: 0,
      rumahId: 0,
      selesai: undefined,
      statusHunian: "TETAP",
    },
  });

  useEffect(() => {
    if (rumahId) {
      form.setValue("rumahId", parseInt(rumahId));
    }
  }, [rumahId]);

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  const kepemilikanMutation = useMutation({
    mutationFn: async (value: NewKepemilikan) => {
      return (await axiosInstance.post("/kepemilikan", value)).data;
    },
    onSuccess: () => {
      toast.success(`Kepemilikan berhasil ditambahkan`);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["kepemilikan", { rumah: rumahId }],
      });
    },
    onError: () => {
      toast.error("Kepemilikan gagal ditambahkan");
    },
  });

  function onSubmit(value: NewKepemilikan) {
    kepemilikanMutation.mutate(value);
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
          <DialogTitle>Tambah Kepemilikan</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="statusHunian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Menghuni</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setKontrak(value === "KONTRAK");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="TETAP">Tetap</SelectItem>
                      <SelectItem value="KONTRAK">Kontrak</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="penghuniId"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && penghuni.length > 0
                            ? penghuni.find((phn) => phn.id === field.value)
                                ?.nama
                            : "Pilih Penghuni"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandInput
                          placeholder="Cari penghuni"
                          value={searchPenghuni}
                          onValueChange={(value) =>
                            handleSearchPenghuni[0](value)
                          }
                        />
                        <CommandList>
                          <CommandEmpty>Penghuni tidak ditemukan</CommandEmpty>
                          {isLoading ? (
                            <CommandItem>Loading...</CommandItem>
                          ) : (
                            penghuni.map((item) => (
                              <CommandItem
                                key={item.id}
                                keywords={[item.nama]}
                                onSelect={() => {
                                  field.onChange(item.id);
                                }}
                              >
                                {item.nama}
                              </CommandItem>
                            ))
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mulai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
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
                            <span>Pilih tanggal mulai</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
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

            {kontrak && (
              <FormField
                control={form.control}
                name="selesai"
                render={({ field }) => (
                  <FormItem>
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
                              <span>Tanggal selesai kontrak</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
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
            )}
            <DialogFooter>
              <Button type="submit" disabled={kepemilikanMutation.isPending}>
                {kepemilikanMutation.isPending ? "Menyimpan" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddKepemilikan;
