import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import classNames from 'classnames'
import styles from './Chart.module.scss'
import { ChartDataType, ChartI } from './Chart'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { Line } from 'react-chartjs-2'
import moment from 'moment'
import 'moment/locale/ru'
import { getDataValues, getUnit } from '@/helpers/buildChart'
import annotationPlugin from 'chartjs-plugin-annotation';
import { useAtom } from 'jotai'
import { atomChartType } from '@/atoms/statsAtom'
import getHashRate from '@/helpers/getHashrate'
import { getHashRateUnit } from '@/helpers'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
)

const generateLabelsAndDataWithGaps = (chartData: any, period: any, stepInterval: number = 5 * 60 * 1000) => {
  const newChart: any = [];
  const gapDuration = stepInterval;
  const gapRanges: any = [];
  for (let i = 0; i < chartData.length; i++) {
    const currentTime = moment(chartData[i].createdAt).valueOf();
    if(period === "day") {
      if (i > 0) {
        const previousTime = moment(chartData[i - 1].createdAt).valueOf();
        const missingSteps = Math.floor((currentTime - previousTime) / gapDuration);
        if (missingSteps > 1) {
          gapRanges.push({
            start: previousTime,
            end: currentTime
          });

          for (let j = 1; j < missingSteps; j++) {
            const missingTime = previousTime + j * gapDuration;
            newChart.push({
              createdAt: moment(missingTime).add(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
              value: null
            });
          }
        }
      }
    }
    if(period !== "week" && period !== "month") {

      newChart.push({
        createdAt: moment(currentTime).add(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        value: Number(chartData[i].value)
      });
    } else {
      newChart.push({
        createdAt: moment(currentTime).format('YYYY-MM-DD HH:mm:ss'),
        value: Number(chartData[i].value)
      });
    }
  }


  return { newChart, gapRanges };
};

const Chart: FC<ChartI> = ({
  className,
  chartData,
  dataType = 'hashrate',
  period = 'day',
  algorithm,
  filterParams = "",
  loading,
  chartRef,
  date,
  setDate,
  filterAlgorithm
}) => {
  const isScrypt = algorithm === 'scrypt'
  const unitMap = useMemo(() => getUnit(algorithm, filterParams, dataType, period, chartData), [algorithm, filterAlgorithm, dataType, period, chartData]);
  console.log("filter", filterAlgorithm)
  const {newChart, gapRanges} = useMemo(() => generateLabelsAndDataWithGaps(chartData, period), [chartData, period]);
  const labels = useMemo(() => newChart.map((item: any) => moment(item.createdAt).format('D MMM HH:mm')), [newChart]);
  const {datasetData, unitValue} = useMemo(() => getDataValues(newChart, dataType, algorithm, filterParams, period), [newChart, dataType, algorithm, filterParams, period]);
  const datasetDataNumber = datasetData.map(Number)
  console.log("unitValue", unitMap)
  const unitsMap: any = {
    hashrate: `${unitMap === "KH" ? "kH" : unitMap}/s`,
    consumption: unitMap,
    temperature: 'C°',
    fans: 'RPM',
    uptime: '%'
  }
  const minVal = Math.min(...datasetDataNumber)
  const maxVal = Math.max(...datasetDataNumber)
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: false,
    animation: {
      duration: 0
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      y: {
        // beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: 'rgb(163,163,163)',
          font: { weight: 'normal', size: 10, family: 'Gilroy' },
        },
        min: 0,
        // max: Math.floor(maxVal + 5)
      },
      x: {
        
        ticks: {
          // color: '#dcff00',
          font: { weight: 'normal', size: 10, family: 'Gilroy' }
        }
      }
    },
    plugins: {
      legend: {
        display: false
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
            const unit =
              isScrypt && dataType === 'hashrate' ? 'GH/s' : unitsMap[dataType]
            return context.parsed.y + ` ${unit}`
          }
        }
      },
      annotation: {
        annotations: gapRanges.map((range: any) => ({
          type: 'box',
          xMin: moment(range.start).add(3, 'hour').format('D MMM HH:mm'),
          xMax: moment(range.end).add(3, 'hour').format('D MMM HH:mm'),
          backgroundColor: 'rgba(255, 99, 132, 0.25)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        })),
      }
    }
  }

  const dataset = [
    {
      data: datasetData,
      borderColor: 'rgb(88, 32, 246)',
      // borderColor: "#dcff00",
      // bodyColor: "#dcff00",
      backgroundColor: 'rgba(88, 32, 246, 1)',
      tension: 0.2,
      borderWidth: 2,
      color: 'rgb(88, 32, 246)',
      pointBackgroundColor: 'rgba(255, 255, 255)',
      // pointBackgroundColor: "#dcff00",
      pointBorderColor: 'rgb(88, 32, 246)',
      pointBorderWidth: 1,
      pointRadius: 2,
      pointHoverRadius: 10,
      pointHoverBackgroundColor: 'rgb(88, 32, 246)'
    }
  ]
  const data = {
    labels,
    datasets: dataset
  }
  return (
    <div
      className={classNames(styles.el, className, {
        [styles.is_loading]: loading
      })}
    >
      <div className={styles.inner}></div>
      {
        <>
          {chartData.length > 0 
              ? <Line ref={chartRef} options={options} data={data} />              
            : (
            // <p className={styles.noData}>Данные скоро появятся</p>
            <div className={styles.loader}> 
              {/* <Load /> */}
              {/* <p>Нет данных</p> */}
            </div>
            
          )}
        </>
      }
    </div>
  )
}

export default memo(Chart)
