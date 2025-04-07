import { atomPeriodFromToCharts } from "@/atoms/statsAtom";
import { Dashboard, Dialog, ErrorPopup, TabsControls } from "@/components"
import { useAtom } from "jotai";
import DatePicker from "react-datepicker";
import styles from "./UploadData.module.scss"
import "react-datepicker/dist/react-datepicker.css";
import { Button, Checkbox, CustomSelect, Field } from "@/ui";
import { devicesDataAtom, devicesExportInitialState, DevicesExportStateI, devicesFilterAtom, devicesFilterInitialState, DevicesFilterStateI } from "@/atoms/appDataAtom";
import { deviceAPI, userAPI } from "@/api";
import { saveAs } from 'file-saver';
import moment from "moment";
import { memo, useEffect, useMemo, useState } from "react";
import { OptionItemI } from "@/ui/CustomSelect/CustomSelect";
import { IconDownload } from "@/icons";
import ru from 'date-fns/locale/ru';
import axios from "axios";
import { access } from "fs";
import MultiSelectUser from "@/components/MultiSelect/User";
import { selectPlaceholdersExport } from "../data";
import { table } from "console";
import formatDate from "@/helpers/formatDate";
import { generateWhereClause } from "@/helpers/generateWhereClause";
import * as XLSX from "xlsx";
import TableComponent from "./TestComp";
import ReactDOM from "react-dom/client";

const UploadData = () => {
    const [dateRange, setDateRange] = useState<[any, any]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [filter, setFilter] = useAtom(devicesFilterAtom)
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [selectAction, setSelectAction] = useState({
      label: "1. Выгрузка пользователей",
      value: "1"
    })
    const roleId = localStorage.getItem(`${process.env.API_URL}_role`)

  const [open, setOpen] = useState(false)
  const [{ users }] = useAtom(devicesDataAtom)
  const [state, setState] = useState<DevicesExportStateI>(devicesExportInitialState);
  const [blockCheckbox, setBlockCheckbox] = useState(false)

  useEffect(() => {
    setState(devicesExportInitialState);
  }, [open]);

  useEffect(() => {
    const shouldBlockCheckbox = state.table?.value === "hashrate";
    setBlockCheckbox(shouldBlockCheckbox);
    if (shouldBlockCheckbox) {
      setState((prevState) => ({
        ...prevState,
        generatePrice: false
      }));
    };
  }, [state.table]);

  const getSelectData = (
    name: keyof DevicesExportStateI,
    options: OptionItemI[]
  ) => {
    const selected =
      state[name] !== null
        ? options.find((option) => option.value === state[name]) ||
          selectPlaceholdersExport[name]
        : selectPlaceholdersExport[name]
    return {
      placeholder: selectPlaceholdersExport[name]
        ? selectPlaceholdersExport[name]
        : undefined,
      options,
      selectedOption: selected
    };
  };

  const handleSelectChange = (
    name: keyof DevicesExportStateI,
    value: string | null | boolean | any
  ) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        [name]: value,
      }
      return newState;
    });
  };

  const handleClientChange = (e: any, newValue: any) => {
    handleSelectChange('client', newValue || null)
  };

  const handleTableChange = (e: any, newValue: any) => {
    handleSelectChange('table', newValue || null)
  };

  const clientProps = useMemo(() => {
    const options: OptionItemI[] =
      users?.map((user) => {
        return {
          label: `${user.fullname}` || `${user.login}`,
          value: user.id
        } as OptionItemI
      }) || [];
    return getSelectData('client', options);
  }, [users, state.client]);

  const tableOptions: OptionItemI[] = [
    {label: "Хешрейт", value: "hashrate"},
    {label: "Потребление", value: "energy"},
  ];
  const tableProps = useMemo(() => getSelectData('table', tableOptions), [state.table]);

  const toggleState = (field: keyof DevicesExportStateI) => {
    setState((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  const [data, setData] = useState<any>(null);

  const openNewWindowWithData = (tableData: any, blob: any) => {
    const newWindow = window.open("", "_blank");
  
    // Проверяем, что новое окно было открыто
    if (newWindow) {
  
      const waitForNewWindowToLoad = () => {
        if (newWindow.document.readyState === "complete") {
          const rootElement = newWindow.document.createElement("div");
          newWindow.document.body.appendChild(rootElement);

          const styleLink = document.createElement("link");
          styleLink.rel = "stylesheet";
          styleLink.href = "./UploadData.module.scss";
          newWindow.document.head.appendChild(styleLink);
  
          const style = newWindow.document.createElement("style");
          style.textContent = `
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            .test {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            td, th {
              padding: 5px;
              border: 1px solid black;
            }
            
            .el {
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              padding: 0.75rem 1.0625rem;
              font-family: 'Gilroy', sans-serif;
              font-size: 1rem;
              line-height: 1.375rem;
              font-weight: 500;
              letter-spacing: 0.05em;
              white-space: nowrap;
              color: #24292F;
              background-color: white;
              gap: 12px;
              border: 2px solid #582DEC;
              border-radius: 9px;
              cursor: pointer;
              transition: color 0.3s, background-color 0.3s, border-color 0.3s;
            }

            @media (max-width: 768px) {
              .el {
                outline: none;
              }
            }

            @media (max-width: 576px) {
              .el {
                font-size: 1rem;
              }
            }

            @media (min-width: 1200px) {
              .el:hover,
              .el:focus-visible {
                background-color: #794DF8;
                color: white;
                border-color: #794DF8;
              }
            }

          `;
          newWindow.document.head.appendChild(style);
  
          const root = ReactDOM.createRoot(rootElement);
          root.render(<TableComponent initialData={tableData} blob={blob} />);
        } else {
          // Если окно ещё не готово, ждем и повторяем попытку
          setTimeout(waitForNewWindowToLoad, 50); // Задержка в 50 мс
        }
      };
  
      waitForNewWindowToLoad();
    } else {
      console.error("Не удалось открыть новое окно. Возможно, оно было заблокировано.");
    }
  };

  const getDevicesUsersReport = () => {
    if (state?.table?.value) {
      setLoading(true)
      const where = generateWhereClause(filter, null);
      const payload = {
        where,
        createdAt: [formatDate(startDate), formatDate(endDate, true)],
      };
  
      const reportOptions = {
        generatePrice: state.generatePrice,
        datesHidden: state.datesHidden,
        table: state.table.value,
        notNecessaryHidden: state.notNecessaryHidden,
        // billMode: false,
      };
  
      deviceAPI.userReport(payload, reportOptions)
        .then(res => {
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });

          // Преобразование XLSX файла в массив данных
          // const fileReader = new FileReader();
          // fileReader.onload = (e: any) => {
          //   const data = new Uint8Array(e.target.result);
          //   const workbook = XLSX.read(data, { type: "array" });
          //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          //   const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          //   setData(jsonData);
          //   console.log("jsonData", jsonData)
          //   openNewWindowWithData(jsonData, blob);
          // };

          // fileReader.readAsArrayBuffer(blob);
          saveAs(blob, `report_${formatDate(startDate)}_${formatDate(endDate, true)}.xlsx`);
        })
        .catch((error) => setError(error.message || 'Ошибка'))
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const getDevicesReport = () => {
    if (state?.table?.value) {
      setLoading(true)
      const where = generateWhereClause(filter, null);
      const payload = {
        where,
        createdAt: [formatDate(startDate), formatDate(endDate, true)],
      };
  
      const reportOptions = {
        generatePrice: state.generatePrice,
        datesHidden: state.datesHidden,
        table: state.table.value,
        notNecessaryHidden: state.notNecessaryHidden,
        userId: state.client?.value || "",
        billMode: false,
        byUser: state.byUser
      };
  
      deviceAPI.testReport(payload, reportOptions)
        .then(res => {
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });

          // Преобразование XLSX файла в массив данных
          // const fileReader = new FileReader();
          // fileReader.onload = (e: any) => {
          //   const data = new Uint8Array(e.target.result);
          //   const workbook = XLSX.read(data, { type: "array" });
          //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          //   const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          //   setData(jsonData);
          //   console.log("jsonData", jsonData)
          //   openNewWindowWithData(jsonData, blob);
          // };

          // fileReader.readAsArrayBuffer(blob);
          saveAs(blob, `report_${formatDate(startDate)}_${formatDate(endDate, true)}.xlsx`);
        })
        .catch((error) => setError(error.message || 'Ошибка'))
        .finally(() => {
          setLoading(false)
        })
    }
  };

  const items = [
    {text: "Устройства"},
    {text: "Пользователи"}
  ]

  const [currentTab, setCurrentTab] = useState(items[0].text)

  return <Dashboard title="Экспорт данных" description="Для выгрузки можете использовать фильтры" style={{width: "100%"}}>
    {open && <Dialog
        title="Экспорт"
        onClose={() => setOpen(false)}
        closeBtn
        className={styles.el}
      >
        <div className={styles.tabs}>
          <TabsControls 
            items={items}
            currentTab={currentTab}
            onChange={setCurrentTab}
          />
        </div>
        {currentTab === items[0].text && <div className={styles.fields}>
          <MultiSelectUser 
            {...clientProps}
            label='Клиенты'  
            onChange={handleClientChange}
            className={styles.field}
          />
          <MultiSelectUser 
            {...tableProps}
            label='Таблица'
            onChange={handleTableChange}
            className={styles.field}
          />
          <div className={styles.dateSelector} onClick={(e) => e.stopPropagation()}>
            {startDate !== null && <h4 className={styles.datepicker__title} > Диапазон дат </h4>}
            <DatePicker
                locale={ru}
                wrapperClassName={styles.dataPicker}
                selectsRange={true}
                startDate={startDate}
                portalId="dataPicker"
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={true}
                placeholderText={'Диапазон дат'} 
            />
          </div>
          <Checkbox 
            label="Скрыть даты"
            name="datesHidden"
            isChecked={state.datesHidden}
            onChange={() => toggleState('datesHidden')}
            value=""
          />
          <Checkbox 
            label="Скрыть опц. информацию"
            name="notNecessaryHidden"
            isChecked={state.notNecessaryHidden}
            onChange={() => toggleState('notNecessaryHidden')}
            value=""
          />
          <Checkbox 
            label="Сгенерировать цену"
            name="generatePrice"
            isChecked={state.generatePrice}
            onChange={() => toggleState('generatePrice')}
            value=""
            isDisabled={blockCheckbox}
          />
          <Checkbox 
            label="По пользователям"
            name="byUser"
            isChecked={state.byUser}
            onChange={() => toggleState('byUser')}
            value=""
            isDisabled={blockCheckbox}
          />
          <Button 
            title="Экспорт"
            onClick={getDevicesReport}
            disabled={!(state && state.table !== null && startDate !== null && endDate !== null)}
            loading={loading}
            // icon={<IconDownload width={22} height={22} />} 
          />
        </div>}
        {currentTab === items[1].text && <div className={styles.fields}>
        <MultiSelectUser 
            {...tableProps}
            label='Таблица'
            onChange={handleTableChange}
            className={styles.field}
          />
          <div className={styles.dateSelector} onClick={(e) => e.stopPropagation()}>
            {startDate !== null && <h4 className={styles.datepicker__title} > Диапазон дат </h4>}
            <DatePicker
                locale={ru}
                wrapperClassName={styles.dataPicker}
                selectsRange={true}
                startDate={startDate}
                portalId="dataPicker"
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={true}
                placeholderText={'Диапазон дат'} 
            />
          </div>
          <Checkbox 
            label="Скрыть даты"
            name="datesHidden"
            isChecked={state.datesHidden}
            onChange={() => toggleState('datesHidden')}
            value=""
          />
          <Checkbox 
            label="Скрыть опц. информацию"
            name="notNecessaryHidden"
            isChecked={state.notNecessaryHidden}
            onChange={() => toggleState('notNecessaryHidden')}
            value=""
          />
          <Checkbox 
            label="Сгенерировать цену"
            name="generatePrice"
            isChecked={state.generatePrice}
            onChange={() => toggleState('generatePrice')}
            value=""
            isDisabled={blockCheckbox}
          />
          <Button 
            title="Экспорт"
            onClick={getDevicesUsersReport}
            disabled={!(state && state.table !== null && startDate !== null && endDate !== null)}
            loading={loading}
            // icon={<IconDownload width={22} height={22} />} 
          />
        </div>}
    </Dialog>}
        <div className={styles.fields} style={roleId === "b9507b39-884d-11ee-932b-300505de684f" ? {gridTemplateColumns: '5fr 1fr'} : {}}>
            <Button 
              title="Открыть"
              onClick={() => setOpen(true)}
              loading={loading}
            />
            {/* <CustomSelect 
              options={[
                {label: "1. Экспорт пользователей", value: "1"},
                {label: "2. Экспорт данных", value: "2"},
                {label: "3. Экспорт эффективности", value: "3"}
              ]}
              selectedOption={selectAction}
              onChange={handleSelectAction}
              className={styles.select}
            /> */}
            {/* <div className={styles.field}>
                <DatePicker
                    locale={ru}
                    wrapperClassName={styles.dataPicker}
                    selectsRange={true}
                    startDate={startDate}
                    portalId="dataPicker"
                    endDate={endDate}
                    onChange={(update) => {
                      setDateRange(update);
                    }}
                    isClearable={true}
                    placeholderText={'Диапазон дат'} 
                />
            </div> */}
            {/* <div className={styles.boxBtn}>
              {selectAction.value === "1"
                ? <Button title="Экспорт" 
                  // icon={<IconDownload width={22} height={22} />} 
                  onClick={uploadUsers} className={styles.btn} loading={loading} />
                : selectAction.value === "2" 
                  ? <Button title="Экспорт" 
                    // icon={<IconDownload width={22} height={22} />} 
                    onClick={uploadData} className={styles.btn} loading={loading} />
                  : <Button title="Экспорт" 
                      // icon={<IconDownload width={22} height={22} />} 
                      onClick={uploadEffective} className={styles.btn} loading={loading} />
              }
            </div> */}
        </div>
        {!!error && <ErrorPopup text={error} />}
    </Dashboard>
}

export default memo(UploadData)