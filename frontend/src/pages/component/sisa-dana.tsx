"use client";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { Loader2, Milk } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/utls";

export default function SisaDana() {
  const { data, isLoading } = useQuery({
    queryKey: ["sisa-dana"],
    queryFn: async () => {
      return axiosInstance.get("/sisa-dana").then((data) => data.data);
    },
  });
  return (
    <Card className="shadow-md rounded-2xl p-5">
      <div className="flex justify-between">
        <CardTitle className="text-sm font-normal">Sisa Dana</CardTitle>
        <Milk />
      </div>
      <CardContent className="p-0">
        <h3 className="font-bold text-3xl text-red-400">
          {
            isLoading && !data ? (<Loader2 className="animate-spin" />) : data.sisa_dana
          }
        </h3>
      </CardContent>
    </Card>
  );
}