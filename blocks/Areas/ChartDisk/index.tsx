import React, { FC, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    ChartData,
} from "chart.js";
import moment from "moment";
import { CpuCoreDataI } from "@/containers/Area";
import { namesCpu } from "../WrapperCharts/WrapperCpuProc";
import Load from "@/components/Load";

// Регистрация компонентов Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface RamDataI {
    createdAt: string
    areaId: string
    index: number
    name: string
    value: number
}

export const namesRam = ["Disk", "Mem"]

interface ChartCpuProcI {
    // cpuCoreData: CpuProcDataI[][]
}

const ChartDisk: FC<any> = ({ cpuCoreData, filter }) => {
    const [chartData, setChartData] = useState<ChartData<"line">>({
        labels: [],
        datasets: []
    });

    console.log("chartData", chartData, cpuCoreData)

    const predefinedColors = [
        "#6A5ACD", // Серо-фиолетовый (Slate Blue)
        // "#000000", // Серо-зеленый (Cadet Blue)
        // "#4682B4", // Стальной синий (Steel Blue)
        // "#556B2F", // Темно-оливковый (Dark Olive Green)
        // "#708090", // Серый шиферный (Slate Gray)
        // "#8FBC8F", // Темно-морская зелень (Dark Sea Green)
        // "#B0C4DE", // Светло-стальной синий (Light Steel Blue)
        // "#C0C0C0", // Серебряный (Silver)
    ];

    useEffect(() => {
        if (cpuCoreData && cpuCoreData[0].rows && cpuCoreData[0].rows.length > 0) {
            const swapData = cpuCoreData[0].rows;
            console.log("TESTSTST")
            const swapValues = swapData.map(
                (item: any) => item.value
            );

            const labels = swapData.map((item: any) =>
                moment(item.createdAt).format("D MMM HH:mm")
            );

            const datasets = [
            ];

                datasets.push({
                    label: namesRam[0], // "Swap"
                    data: swapValues,
                    borderColor: predefinedColors[0], // Цвет из массива
                    backgroundColor: predefinedColors[0],
                    borderWidth: 2,
                    // tension: 0.3, // Добавляет сглаживание линии,
                    pointBorderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 10,
                    tension: 0.2,
                    // borderWidth: 2,
                    color: predefinedColors[0],
                    pointBackgroundColor: 'rgba(255, 255, 255)',
                    // pointBackgroundColor: "#dcff00",
                    pointBorderColor: predefinedColors[0],
                    pointHoverBackgroundColor: predefinedColors[0],
                })

            setChartData({
                labels,
                datasets,
            });
        }
    }, [cpuCoreData]);

    return (
        <div>
            {chartData.datasets.length > 0 ? (
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        // maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: "top",
                            },
                            tooltip: {
                                position: 'nearest',
                                backgroundColor: 'rgba(88, 32, 246, 1)',
                                // backgroundColor: "#dcff00",
                                titleColor: 'rgba(255, 255, 255, 0.8)',
                                titleFont: { weight: 'normal', size: 14, family: 'Gilroy' },
                                bodyFont: { weight: 'normal', size: 16, family: 'Gilroy' },
                                bodyColor: 'rgb(255, 255, 255)',
                                bodySpacing: 2,
                                padding: 12,
                                caretPadding: 7,
                                caretSize: 10,
                                displayColors: false,
                                callbacks: {
                                    label: function (context: any) {
                                      const unit = "GB";
                                      return context.parsed.y + ` ${unit}`
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                            // beginAtZero: true,
                                ticks: {
                                    stepSize: 1,
                                    color: 'rgb(163,163,163)',
                                    font: { weight: 'normal', size: 10, family: 'Gilroy' },
                                },
                            // min: 0,
                            // max: Math.floor(maxVal + 5)
                            },
                            x: {
                                ticks: {
                                    // color: '#dcff00',
                                    font: { weight: 'normal', size: 10, family: 'Gilroy' }
                                }
                            }
                        },
                    }}
                />
            ) : (
                <Load />
            )}
        </div>
    );
};

export default ChartDisk;
