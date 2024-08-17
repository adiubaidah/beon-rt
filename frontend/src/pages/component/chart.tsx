import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Chart from "chart.js/auto";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { axiosInstance, rupiahFormat } from "~/lib/utls";
import { Loader2 } from "lucide-react";

import { Rekap } from "~/schema/type";

function ChartComponent() {
  const [year, setYear] = useState(2024);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef<Chart<"bar"> | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const { data: pemasukanData, isLoading: isLoadingPemasukan } = useQuery<
    Rekap[]
  >({
    queryKey: ["pemasukan", year],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/iuran-bulan/rekap?tahun=${year}`
      );
      return data;
    },
  });
  const { data: pengeluaranData, isLoading: isLoadingPengeluaran } = useQuery<
    Rekap[]
  >({
    queryKey: ["pengeluaran", year],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/pengeluaran/rekap?tahun=${year}`
      );
      return data;
    },
  });

  useEffect(() => {
    if (pemasukanData && pengeluaranData && chartRef.current) {
      const months = pemasukanData.map((item) => item.month);
      const totalPemasukan = pemasukanData.map((item) => item.total_nominal);
      const totalPengeluaran = pengeluaranData.map(
        (item) => item.total_nominal
      );
      const selish = totalPemasukan.map((item, index) => {
        if (totalPengeluaran[index]) {
          return item - totalPengeluaran[index];
        }
        return 0;
      });

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            {
              label: "Total Pemasukan",
              data: totalPemasukan,
              backgroundColor: "rgba(69, 245, 66, 0.2)",
              borderColor: "rgba(69, 245, 66, 1)",
              borderWidth: 1,
            },
            {
              label: "Selisih",
              data: selish,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Total Pengeluaran",
              data: totalPengeluaran,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return rupiahFormat(Number(value));
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += rupiahFormat(context.parsed.y);
                  }
                  return label;
                },
              },
            },
          },
        },
      });
    }
  }, [pemasukanData, pengeluaranData]);

  return (
    <>
      <div className="flex items-center justify-between">
        <table>
          <tbody>
            <tr>
              <td className="pr-2">Pemasukan</td>
              <td>:</td>
              <td className="px-2">
                {pemasukanData &&
                  rupiahFormat(
                    pemasukanData.reduce(
                      (acc, item) => acc + item.total_nominal,
                      0
                    )
                  )}
              </td>
            </tr>
            <tr>
              <td className="pr-2">Pengeluaran</td>
              <td>:</td>
              <td className="px-2">
                {pengeluaranData &&
                  rupiahFormat(
                    pengeluaranData.reduce(
                      (acc, item) => acc + item.total_nominal,
                      0
                    )
                  )}
              </td>
            </tr>
            <tr>
              <td className="pr-2">Selisih</td>
              <td>:</td>
              <td className="px-2">
                {pemasukanData && pengeluaranData && (
                  <span>
                    {rupiahFormat(
                      pemasukanData.reduce(
                        (acc, item) => acc + item.total_nominal,
                        0
                      ) -
                        pengeluaranData.reduce(
                          (acc, item) => acc + item.total_nominal,
                          0
                        )
                    )}
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="w-[200px]">
          <Select onValueChange={(value) => setYear(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder={year} defaultValue={year} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
              <SelectItem value="2028">2028</SelectItem>
              <SelectItem value="2029">2029</SelectItem>
              <SelectItem value="2030">2030</SelectItem>
              <SelectItem value="2031">2031</SelectItem>
              <SelectItem value="2032">2032</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-3/4">
        {isLoadingPemasukan || isLoadingPengeluaran ? (
          <Loader2 />
        ) : (
          <canvas ref={chartRef} />
        )}
      </div>
    </>
  );
}

export default ChartComponent;
