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
import { namesCpu, pidNames } from "../WrapperCharts/WrapperCpuProc";
import Load from "@/components/Load";

// Регистрация компонентов Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface CpuProcDataI {
    createdAt: string
    appId: string
    env: string
    argv: string
    pid: string
    value: number

}

interface ChartCpuProcI {
    cpuCoreData: CpuProcDataI[][]
}

interface ChartCpuCoreI {
    cpuCoreData: {
        rows: CpuProcDataI[]
        total: number
    }[]
}

const ChartCpuProc: FC<ChartCpuCoreI> = ({ cpuCoreData }) => {
    const [chartData, setChartData] = useState<ChartData<"line">>({
        labels: [],
        datasets: []
    });

    const predefinedColors = [
        "#6A5ACD", // Серо-фиолетовый (Slate Blue)
        "#5F9EA0", // Серо-зеленый (Cadet Blue)
        "#4682B4", // Стальной синий (Steel Blue)
        "#556B2F", // Темно-оливковый (Dark Olive Green)
        "#708090", // Серый шиферный (Slate Gray)
        "#8FBC8F", // Темно-морская зелень (Dark Sea Green)
        "#B0C4DE", // Светло-стальной синий (Light Steel Blue)
        // "#C0C0C0", // Серебряный (Silver)
    ];

    useEffect(() => {
        if (cpuCoreData.length > 0) {
            console.log("cpuCoreData", cpuCoreData)
            const datasets = cpuCoreData.map((coreData, index) => {
                const values = coreData.rows.map(item => item.value);
                return {
                    label: `${pidNames[index]}`,
                    data: values,
                    borderColor: predefinedColors[index % predefinedColors.length], 
                    backgroundColor: predefinedColors[index % predefinedColors.length],
                    borderWidth: 2,
                    // tension: 0.3, // Добавляет сглаживание линии,
                    pointBorderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 10,
                    tension: 0.2,
                    // borderWidth: 2,
                    color: predefinedColors[index % predefinedColors.length],
                    pointBackgroundColor: 'rgba(255, 255, 255)',
                    // pointBackgroundColor: "#dcff00",
                    pointBorderColor: predefinedColors[index % predefinedColors.length],
                    pointHoverBackgroundColor: predefinedColors[index % predefinedColors.length]
                };
            });

            const firstNonEmpty = cpuCoreData.find(item => item.rows.length > 0);

            setChartData({
                labels: firstNonEmpty?.rows.map((item, i) => moment(item.createdAt).format('D MMM HH:mm')),
                datasets,
            });
        }
    }, [cpuCoreData]);


    console.log("chartData", chartData)
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

export default ChartCpuProc;
