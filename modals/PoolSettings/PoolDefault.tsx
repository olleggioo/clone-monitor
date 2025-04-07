import { FC, useEffect, useState } from "react"
import { useSnackbar } from "notistack"
import { useAtom } from "jotai"
import { Dialog, Loader } from "@/components"
import { deviceAPI } from "@/api"
import { IconPromminer, IconSave } from "@/icons"
import { Button, CustomSelect, Field } from "@/ui"
import {styled} from "@mui/system"
import { 
  FieldsType, 
  devicesFormPoolFieldsets, 
  poolNamePlaceholder, 
  poolUrlPlaceholder 
} from "@/data/devicesForms"
import useDevicesPoolUpdate from "@/hooks/useDevicesPoolUpdate"
import { devicesUserIdFilterAtom, modalInfoAtom } from "@/atoms/appDataAtom"
import FormFieldsets from "@/blocks/Devices/FormFieldsets"
import styles from './PoolSettings.module.scss'
import { Autocomplete, Avatar, Box, FormControl, FormHelperText, Icon, InputAdornment, MenuItem, Popper, Select, SelectChangeEvent, TextField } from "@mui/material"
import Pooltem from "./Pooltem"
import MultiSelect, { useStyles } from "@/components/MultiSelect"
import { OptionItemI } from "@/ui/CustomSelect/CustomSelect"
import { useMediaQuery } from "react-responsive"
import byField from "@/helpers/byField"
import IconALPH from "@/icons/ALPH"
import IconBCH from "@/icons/BCH"
import IconBTC from "@/icons/BTC"
import IconETC from "@/icons/ETC"
import IconCKB from "@/icons/CKB"
import IconZEC from "@/icons/ZEC"
import IconZEN from "@/icons/ZEN"
import IconHNS from "@/icons/HNS"
import IconDASH from "@/icons/DASH"
import IconKAS from "@/icons/KAS"
import IconKDA from "@/icons/KDA"
import IconNoData from "@/icons/NoData"
import IconAntpool from "@/icons/Antpool"
import IconHeadframe from "@/icons/Headframe"
import IconEMCD from "@/icons/EMCD"
import IconF2Pool from "@/icons/F2Pool"
import IconViaBTC from "@/icons/ViaBTC"
import IconBinance from "@/icons/Binance"
import IconLuxor from "@/icons/Luxor"
import IconNicehash from "@/icons/Nicehash"
import IconTrustPool from "@/icons/TrustPool"
import IconTwoMiners from "@/icons/TwoMiners"
import IconK1Pool from "@/icons/K1Pool"
import IconKaspaPool from "@/icons/KaspaPool"
import IconNoPool from "@/icons/NoPool"
import IconLTC from "@/icons/LTC"
import IconPromminer2 from "@/icons/Promminer2"
import IconXEC from "@/icons/XEC"

export const StyledListbox = styled('ul')({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '10px',
  padding: 0,
  margin: 0,
  listStyle: 'none',
});

const initialState = {
  first: {
    from: undefined,
    name: undefined,
    url: null,
    user: undefined,
    password: undefined,
    flag: true
  },
  second: {
    name: undefined,
    url: null,
    user: undefined,
    password: undefined,
    flag: true
  },
  third: {
    name: undefined,
    url: null,
    user: undefined,
    password: undefined,
    flag: true
  },
}

const coinIcons: any = {
  BTC: <IconBTC height={30} width={30} />,
  BCH: <IconBCH height={30} width={30} />,
  ETC: <IconETC height={30} width={30} />,
  CKB: <IconCKB height={30} width={30} />,
  ZEC: <IconZEC height={30} width={30} />,
  ZEN: <IconZEN height={30} width={30} />,
  KDA: <IconKDA height={30} width={30} />,
  HNS: <IconHNS height={30} width={30} />,
  DASH: <IconDASH height={30} width={30} />,
  KAS: <IconKAS height={30} width={30} />,
  LTC: <IconLTC height={30} width={30} />,
  XEC: <IconXEC height={30} width={30} />,
  ALPH: <IconALPH height={30} width={30} />
};

const poolIcons: any = {
  Antpool: <IconAntpool height={30} width={30} />,
  Headframe: <IconHeadframe height={30} width={30} />,
  EMCD: <IconEMCD height={30} width={30} />,
  F2pool: <IconF2Pool height={30} width={30} />,
  F2poll: <IconF2Pool height={30} width={30} />,
  ViaBTC: <IconViaBTC height={30} width={30} />,
  Binance: <IconBinance height={30} width={30} />,
  F2Pool: <IconF2Pool height={30} width={30} />,
  Luxor: <IconLuxor height={30} width={30} />,
  Nicehash: <IconNicehash height={30} width={30} />,
  Promminer: <IconPromminer2 height={30} width={30} />,
  TrustPool: <IconTrustPool height={30} width={30} />,
  "2miners": <IconTwoMiners height={30} width={30} />,
  // K1Pool: <IconK1Pool height={30} width={30} />,
  "Kaspa-pool": <IconKaspaPool height={30} width={30} />,
  // добавьте другие иконки для пулов
};

const PoolDefault: FC<{
  deviceId: any
  onClose?: () => void}> = ({
    deviceId,
    onClose
}) => {
  useEffect(() => {
    console.warn = () => {};
  }, []);
    // const { fields, handleUpdateState, handleChangeInput, handleDeviceSubmit, handleDeviceUserSubmit,onBlurChange } = useDevicesPoolUpdate(initialState)
    // const [deviceId] = useAtom(devicesUserIdFilterAtom)
    const [fieldSets, setFieldSets] = useState(devicesFormPoolFieldsets)
    const [test, setTest] = useState(fieldSets)
    const [loader, setLoader] = useState<boolean>(false)
    const {enqueueSnackbar} = useSnackbar()
    const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)

    const optionss = [
      {
        label: "Да",
        value: "1"
      },
      {
        label: "Нет",
        value: "0"
      },
    ]
    const [indexation, setIndexation] = useState({
      label: "Да",
      value: "1"
    })

    const onChangeIndexation = (option: OptionItemI) => {
      setIndexation((prevState: any) => {
        return {
          ...prevState,
          label: option.label,
          value: option.value
        }
      })
    }

    const [pooling, setPooling] = useState(initialState)

    const [optionsPooling, setOptionsPooling] = useState<{name: any, url: any}>({
      name: null,
      url: null,
    })
    const handleSelectChange = (
      poolingName: keyof typeof pooling,
      propertyName: keyof typeof pooling.first,
      value: string | null | undefined | boolean
    ) => {
      setPooling((prevState) => {
        return {
          ...prevState,
          [poolingName]: {
            ...prevState[poolingName],
            [propertyName]: value
          }
        };
      })
    }
    const [options, setOptions] = useState<any>({
      coins: [],
      poolsByCoin: {},
      selectedCoin: null,
      selectedPool: null,
      poolData: null,
    });

    console.log("options", options)

    // const handleCoinChange = (e: any) => {
    //   const selectedCoin = e.target.value;
    //   setOptions((prevOptions: any) => ({
    //     ...prevOptions,
    //     selectedCoin,
    //     selectedPool: '',
    //     poolData: null, // Очистить данные пула при смене монеты
    //   }));
    // };
  
    // // Обработка выбора имени пула
    // const handlePoolChange = (e: any) => {
    //   const selectedPool = e.target.value;
    //   const poolData: any = options.poolsByCoin[options.selectedCoin].find((pool: any) => pool.name === selectedPool);
  
    //   setOptions((prevOptions: any) => ({
    //     ...prevOptions,
    //     selectedPool,
    //     poolData,
    //   }));
    // };

    const handleCoinChange = (event: any, newValue: any) => {
      if(newValue === null) {
        setPooling(initialState)
        setOptions((prevOptions: any) => ({
          ...prevOptions,
          selectedCoin: null,
          selectedPool: null,
          poolData: null,
        }));
      } else {
        const selectedCoin = newValue?.value || '';
        setOptions((prevOptions: any) => ({
          ...prevOptions,
          selectedCoin: {
            label: selectedCoin
          },
          selectedPool: null,
          poolData: null,
        }));
        setPooling(initialState)
      }
    };
  
    const handlePoolChange = (e: any, newValue: any) => {
      if(newValue === null) {
        setPooling(initialState)
        setOptions((prevOptions: any) => ({
          ...prevOptions,
          selectedPool: null,
          poolData: null,
        }));
      } else {
        const selectedPool = newValue?.value || '';
        const poolData = options.poolsByCoin[options.selectedCoin.label].find((pool: any) => pool.value === selectedPool);
        setOptions((prevOptions: any) => ({
          ...prevOptions,
          selectedPool: {
            label: selectedPool
          },
          poolData,
        }));
      }
    };

    useEffect(() => {
      if(options.poolData) {
        handleSelectChange("first", "url", options.poolData?.urls?.url)
        handleSelectChange("first", "password", options.poolData?.urls?.password)
        handleSelectChange("second", "url", options.poolData?.urls?.url1)
        handleSelectChange("second", "password", options.poolData?.urls?.password1)
        handleSelectChange("third", "url", options.poolData?.urls?.url2)
        handleSelectChange("third", "password", options.poolData?.urls?.password2)
        handleSelectChange("first", "name", options.selectedCoin.label + " " + options.selectedPool.label)
      }
    }, [options])

    console.log("pooling", pooling)
    useEffect(() => {
      deviceAPI.getDevicesPoolMocks({
        limit: 1000,
        order: {
          name: "ASC"
        }
      }).then(res => {
        const coins = new Set();
        const poolsByCoin: any = {};

        res.rows.forEach((item: any) => {
          if(!item.name.includes(' ')) {
            return;
          }

          const [coin, poolName] = item.name.split(' ');
          coins.add(coin);
  
          if (!poolsByCoin[coin]) {
            poolsByCoin[coin] = [];
          }
          
          poolsByCoin[coin].push({
            id: item.id,
            label: poolName,
            value: poolName,
            icon: poolIcons[poolName] || <IconNoPool height={30} width={30} />,
            urls: {
              url: item.url,
              password: item.password,
              url1: item.url1,
              password1: item.password1,
              url2: item.url2,
              password2: item.password2,
            }
          });
        });

        const coinOptions = Array.from(coins).map((coin: any) => ({
          label: coin,
          value: coin,
          icon: coinIcons[coin] || <IconNoData height={20} width={20} />
        }));

        setOptions((prevOptions: any) => ({
          ...prevOptions,
          coins: coinOptions,
          poolsByCoin,
        }));

        const optionsName = res.rows.filter((item: any, index: any, self: any) =>
        index === self.findIndex((obj: any) => obj.name === item.name)
      ).map((item: any) => {
          return {
            label: item?.name,
            value: item.name
          }
        })
        const optionsUrl = res.rows.map((item: any) => {
          return {
            url: item.url,
            url1: item.url1,
            url2: item.url2
          }
        });
        setOptionsPooling((prevState) => {
          return {
            ...prevState,
            name: optionsName,
            url: optionsUrl
          }
        })
      })
    }, [])
    // useEffect(() => {
    //   if(pooling.first.name !== undefined) {
    //     handleSelectChange('first', 'url', null)
    //     handleSelectChange('second', 'url', null)
    //     handleSelectChange('third', 'url', null)
    //     deviceAPI.getDevicesPoolMocks({
    //       limit: 1000,
    //       order: {
    //         name: "ASC"
    //     }
    //     }).then(res => {
          
    //       const optionsUrl = res.rows.filter((item: any) => item.name === pooling.first.name).map((item: any) => {
    //         return {
    //           url: item.url,
    //           url1: item.url1,
    //           url2: item.url2,
    //           password: item.password,
    //           password1: item.password1,
    //           password2: item.password2
    //         }
    //         // const options: { label: string; value: string }[] = [];
    //         // for (let i = 0; i < 3; i++) {
    //         //   const urlKey = `url${i === 0 ? '' : i}`;
    //         //   const passwordKey = `password${i}`;
              
    //         //   if (item[urlKey]) {
    //         //     options.push({
    //         //       label: item[urlKey],
    //         //       value: item[urlKey]
    //         //     });
    //         //   }
    //         // }
    //         // return options;
    //       })
    //       setOptionsPooling((prevState) => {
    //         return {
    //           ...prevState,
    //           url: optionsUrl
    //         }
    //       })
    //     })
    //   }
    // }, [pooling.first.name])

    // useEffect(() => {
    //   if(pooling.first.name !== undefined && optionsPooling.url !== null && optionsPooling.url.length !== 0) {
    //     // if(poolCount === "1" && optionsPooling.url !== null) {
    //       handleSelectChange('first', 'url', optionsPooling?.url[0].url || null);
    //       handleSelectChange('first', 'password', optionsPooling?.url[0].password || '');
    //       handleSelectChange('second', 'url', optionsPooling.url[0].url1);
    //       handleSelectChange('second', 'password', optionsPooling?.url[0].password1 || '');
    //       handleSelectChange('third', 'url', optionsPooling.url[0].url2);
    //       handleSelectChange('third', 'password', optionsPooling?.url[0].password2 || '');
    //     // }
    //     // else if (poolCount === "2" && optionsPooling.url !== null) {
    //     //   if (optionsPooling.url.length >= 1) {
    //     //     handleSelectChange('first', 'url', optionsPooling.url[0].url);
    //     //   } else {
    //     //       handleSelectChange('first', 'url', null);
    //     //   }
      
    //     //   if (optionsPooling.url.length >= 2) {
    //     //       handleSelectChange('second', 'url', optionsPooling.url[0].url1);
    //     //   } else {
    //     //       handleSelectChange('second', 'url', null);
    //     //   }
    //     // } else if (poolCount === "3" && optionsPooling.url !== null) {
    //     //   if (optionsPooling.url.length >= 1) {
    //     //     handleSelectChange('first', 'url', optionsPooling.url[0].url);
    //     //   } else {
    //     //       handleSelectChange('first', 'url', null);
    //     //   }
      
    //     //   if (optionsPooling.url.length >= 2) {
    //     //       handleSelectChange('second', 'url', optionsPooling.url[1].url2);
    //     //   } else {
    //     //       handleSelectChange('second', 'url', null);
    //     //   }
    //     //   if (optionsPooling.url.length >= 3) {
    //     //       handleSelectChange('third', 'url', optionsPooling.url[2].value);
    //     //   } else {
    //     //       handleSelectChange('third', 'url', null);
    //     //   }
    //     // }
    //   }
    // }, [pooling.first.name, optionsPooling])

  const handleSubmit = () => {
    // setLoader(true)
    const data: {
      pool: number
      pool2: number
      pool3: number
      from?: string
      name?: string
      user?: string
      url?: string
      password?: string
      name2?: string
      user2?: string
      url2?: string
      password2?: string
      name3?: string
      user3?: string
      url3?: string
      password3?: string
      indexation?: string
    } = {
      pool: pooling.first.flag ? 1 : 0,
      pool2: pooling.second.flag ? 1 : 0,
      pool3: pooling.third.flag ? 1 : 0,
    };
      if(pooling.first.from !== undefined && pooling.first.from !== '') {
        data.from = pooling.first.from;

      }
      if(pooling.first.name !== undefined && pooling.first.name !== '' && pooling.first.flag) {
        data.name = pooling.first.name;
        // data.name2 = pooling.first.name
        // data.name3 = pooling.first.name
      }
      if(pooling.first.name !== undefined && pooling.first.name !== '' && pooling.second.flag) {
        // data.name = pooling.first.name;
        data.name2 = pooling.first.name
        // data.name3 = pooling.first.name
      }
      if(pooling.first.name !== undefined && pooling.first.name !== '' && pooling.third.flag) {
        // data.name = pooling.first.name;
        // data.name2 = pooling.first.name
        data.name3 = pooling.first.name
      }
      if(pooling.first.url !== null && pooling.first.url !== '' && pooling.first.flag) {
        data.url = pooling.first.url;
      }
      if(pooling.first.user !== undefined && pooling.first.user !== '' && pooling.first.flag) {
        data.user = pooling.first.user;
      }
      if(pooling.first.password !== undefined && pooling.first.password !== '' && pooling.first.flag) {
        data.password = pooling.first.password;
      }
      if(pooling.second.url !== null && pooling.second.url !== '' && pooling.second.flag) {
        data.url2 = pooling.second.url
      }
      if(pooling.second.user !== undefined && pooling.second.user !== '' && pooling.second.flag) {
        data.user2 = pooling.second.user;
      }
      if(pooling.second.password !== undefined && pooling.second.password !== '' && pooling.second.flag) {
        data.password2 = pooling.second.password;
      }
      if(pooling.third.url !== null && pooling.third.url !== '' && pooling.third.flag) {
        data.url3 = pooling.third.url
      }
      if(pooling.third.user !== undefined && pooling.third.user !== '' && pooling.third.flag) {
        data.user3 = pooling.third.user;
      }
      if(pooling.third.password !== undefined && pooling.third.password !== '' && pooling.third.flag) {
        data.password3 = pooling.third.password;
      }
      if(indexation.value === "1") {
        data.indexation = "1";
      }
      if(pooling.first.name === undefined && pooling.first.url !== null) {
        let dat = new URL(pooling.first.url);
        let domain = dat.pathname.split('//')[1].split(':')[0];
        data.name = domain
      }
      if(pooling.second.name === undefined && pooling.first.name === undefined && pooling.second.url !== null) {
        let dat = new URL(pooling.second.url);
        let domain = dat.pathname.split('//')[1].split(':')[0];
        data.name2 = domain
      }
      if(pooling.third.name === undefined && pooling.first.name === undefined && pooling.third.url !== null) {
        let dat = new URL(pooling.third.url);
        let domain = dat.pathname.split('//')[1].split(':')[0];
        data.name3 = domain
      }
    deviceAPI.updateManyDevicesPools({where: deviceId.map((item: any) => ({ id: item.id }))}, data).then(res => {
      setLoader(false)
      if(onClose) {
        onClose()
      }
      setModalInfo({
        open: true,
        action: "Обновление пулов",
        status: "Успешно",
        textInAction: "Пулы для устройств успешно сохранены. Через 3 секунды страница перезагрузится"
      })
      enqueueSnackbar("Пулы успешно изменены", {
        variant: 'success',
        autoHideDuration: 3000
    });
    setTimeout(() => {
      window.location.reload()
    }, 3000)
    }).catch(error => {
      console.log(error)
      if (error && error.response && error.response.data) {
        const errors = error.response.data.message;
        for(let i = 0; i < errors.length; i++) {
          enqueueSnackbar(errors[i], {
            variant: 'error',
            autoHideDuration: 3000
        });
        }
      }
    }).finally(() => {
      setLoader(false)
    })
  }

  const StyledListboxPool = styled('ul')({
    display: 'flex',
    flexDirection: 'column',
    // gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    padding: 0,
    margin: 0,
    listStyle: 'none',
    width: "300px"
  });

  const classes = useStyles()
  let currentIcon: any = null;

  return <>
    {loader
      ? <Loader />
      : <Dialog
          title="Настройки пулов"
          closeBtn
          onClose={onClose}
          className={styles.el}
          wide
        >
          <div>
            <div className={styles.chooseCoin}>
              {/* <MultiSelect 
                items={options.coins} 
                onChange={handleCoinChange} 
                label="Выберите монету" 
                type="base" 
              /> */}
              <Autocomplete
                id="combo-box-demo"
                disablePortal
                sx={{
                  borderRadius: "40px !important"
                }}
                onChange={handleCoinChange} 
                value={options.selectedCoin}
                options={options.coins}
                getOptionLabel={(option: any) => option?.label || ''}
                // disableCloseOnSelect
                ListboxComponent={StyledListbox}
                ListboxProps={{
                  className: styles.customScrollbar
                }}
                PopperComponent={(props) => <Popper {...props} placement="bottom-start" style={{  }} />}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                // ListboxComponent={StyledListbox} // Используем кастомный Listbox
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: 1,
                      gap: 1,
                    }}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </Box>
                )}
                renderInput={(params) => <TextField 
                  sx={{
                    '& .MuiFormLabel-root': {
                        fontSize: '0.875rem',
                        color: "#6C747B"
                    },
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "9px",
                    },
                    "& .MuiAutocomplete-inputRoot": {
                        borderRadius: "9px"
                    },
                  }} 
                  className={classes.autocomplete} 
                  {...params} 
                  label={"Монета"} 
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: params.inputProps.value && (
                      <Box sx={{display: "flex", alignItems: "center", marginRight: "4px"}}>
                        {options.coins.find((coin: any) => coin.label === params.inputProps.value)?.icon}
                      </Box>
                      
                    )
                  }} 
                />}
              />
              {options.selectedCoin && (
                <Autocomplete
                id="combo-box-demo"
                disablePortal
                sx={{
                  borderRadius: "40px !important",
                  width: "100% !important"
                }}
                onChange={handlePoolChange} 
                value={options.selectedPool}
                options={options.poolsByCoin[options.selectedCoin.label]}
                getOptionLabel={(option: any) => option?.label || ''}
                // disableCloseOnSelect
                // ListboxComponent={StyledListboxPool}
                ListboxProps={{
                  className: styles.customScrollbar
                }}
                PopperComponent={(props) => <Popper {...props} placement="bottom-start" style={{  }} />}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                // ListboxComponent={StyledListbox} // Используем кастомный Listbox
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      display: 'flex',
                      // flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: 1,
                      gap: 2,
                      width: '400px !important',
                    }}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </Box>
                )}
                renderInput={(params) => {
                  const selectedPoolIcon = options.poolsByCoin[options.selectedCoin?.label]?.find(
                    (pool: any) => pool.label === options.selectedPool?.label
                  )?.icon;

                  return <TextField 
                  sx={{
                    '& .MuiFormLabel-root': {
                        fontSize: '0.875rem',
                        color: "#6C747B",
                    },
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "9px",
                    },
                    "& .MuiAutocomplete-inputRoot": {
                        borderRadius: "9px"
                    },
                  }} 
                  className={classes.autocomplete} 
                  {...params} 
                  label={"Пул"} 
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: selectedPoolIcon && (
                      <Box sx={{display: "flex", alignItems: "center", marginRight: "4px"}}>
                        {selectedPoolIcon}
                      </Box>
                    ),
                  }} 
                />
                }}
              />
                // <MultiSelect 
                //   items={options.poolsByCoin[options.selectedCoin]} 
                //   onChange={handlePoolChange} 
                //   value={options.selectedPool}
                //   label="Выберите имя пула" 
                //   type="base" 
                // />
              )}
            </div>
          </div>
          
                  <div className={styles.fieldset}>
                      {/* <FormFieldsets
                          required={true}
                          style={{display: "block"}}
                          fields={fieldSets}
                          values={fields}
                          handleChangeInput={handleChangeInput}
                          handleUpdateState={handleUpdateState}
                          handleSearchValue={searchPoolname}
                          onBlur={onBlurChange}
                      /> */}
                        {/* <Select
                          native
                          value={poolCount}
                          onChange={(event: SelectChangeEvent) => {
                            setPoolCount(event.target.value);
                          }}
                          displayEmpty 
                        >
                          <option value={"1"}>Один</option>
                          <option value={"2"}>Два</option>
                          <option value={"3"}>Три</option>
                        </Select>
                        <FormHelperText>Выберите количество пулов</FormHelperText> */}
                        <div className={styles.fieldSetMini}>
                          <CustomSelect
                            label="Индексация воркеров"
                            options={optionss}
                            selectedOption={indexation}
                            onChange={onChangeIndexation}
                            className={styles.field_large}
                          />
                          <Field
                            // value={value[keyName].user}
                            
                            label={"Отсчёт воркера"}
                            type="number"
                            onChange={(e: any) => {
                              handleSelectChange('first', 'from', e.target.value)
                          }}
                          />
                        </div>
                          {/* {optionsPooling.name !== null && optionsPooling.url !== null && 
                           <MultiSelect 
                              items={optionsPooling?.name}
                              onChange={handleFirstSelectName}
                              label={`Имя пула`}
                              type="pool"
                            />
                          } */}
                          {/* <input 
                            // checked={state.second.flag}
                            // onChange={(evt) => handleChange('second', 'flag', evt.target.checked)}
                            type="checkbox"
                          /> */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: "25px"
                          }}>
                            {Array.from({length: Number(3)}).map((item, key) => (
                              <div key={key} className={styles.wrapperBack}>
                                <Pooltem 
                                  value={pooling}
                                  keys={key}
                                  items={optionsPooling}
                                  onChanges={handleSelectChange}
                                />
                              </div>
                            ))}
                          </div>
                  </div>
                  <div className={styles.buttons}>
                    <Button 
                      title="Сохранить" 
                      className={styles.submit} 
                      icon={<IconSave width={22} height={22} />}
                      disabled={!(pooling.first.name !== undefined)} 
                      onClick={handleSubmit} 
                    />
                  </div>
          </Dialog>
      }
    </>
}

export default PoolDefault