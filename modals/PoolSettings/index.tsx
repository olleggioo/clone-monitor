import { FC, useState, useEffect } from 'react'
import {
  PoolSettingsModalI,
  PoolSettingsModalState
} from '@/modals/PoolSettings/PoolSettings'
import styles from './PoolSettings.module.scss'
import { Dialog, ErrorPopup } from '@/components'
import { Button, Field, Heading } from '@/ui'
import { IconSave } from '@/icons'
import { deviceAPI } from '@/api'
import { useSnackbar } from 'notistack'
import MultiSelect, { useStyles } from '@/components/MultiSelect'
import MultiSelectUser from '@/components/MultiSelect/User'
import { modalInfoAtom } from '@/atoms/appDataAtom'
import { useAtom } from 'jotai'
import IconBTC from '@/icons/BTC'
import IconBCH from '@/icons/BCH'
import IconETC from '@/icons/ETC'
import IconCKB from '@/icons/CKB'
import IconZEC from '@/icons/ZEC'
import IconZEN from '@/icons/ZEN'
import IconKDA from '@/icons/KDA'
import IconHNS from '@/icons/HNS'
import IconDASH from '@/icons/DASH'
import IconKAS from '@/icons/KAS'
import IconLTC from '@/icons/LTC'
import IconXEC from '@/icons/XEC'
import IconAntpool from '@/icons/Antpool'
import IconHeadframe from '@/icons/Headframe'
import IconEMCD from '@/icons/EMCD'
import IconF2Pool from '@/icons/F2Pool'
import IconViaBTC from '@/icons/ViaBTC'
import IconBinance from '@/icons/Binance'
import IconLuxor from '@/icons/Luxor'
import IconNicehash from '@/icons/Nicehash'
import IconPromminer2 from '@/icons/Promminer2'
import IconTrustPool from '@/icons/TrustPool'
import IconTwoMiners from '@/icons/TwoMiners'
import IconKaspaPool from '@/icons/KaspaPool'
import IconNoPool from '@/icons/NoPool'
import IconNoData from '@/icons/NoData'
import { Autocomplete, Box, Popper, TextField } from '@mui/material'
import { StyledListbox } from './PoolDefault'
import Pooltem from './Pooltem'

const initialFieldsetState: PoolSettingsModalState = {
  first: {
    name: '',
    url: '',
    user: '',
    password: '',
    flag: true
  },
  second: {
    url: '',
    user: '',
    password: '',
    flag: true
  },
  third: {
    url: '',
    user: '',
    password: '',
    flag: true
  }
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
  XEC: <IconXEC height={30} width={30} />
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
};

const defaultState = {
  title: '',
  default: { name: '' },
  first: { name: '', url: '', user: '', password: '', flag: true },
  second: { url: '', user: '', password: '', flag: true },
  third: { url: '', user: '', password: '', flag: true },
};

const PoolSettingsModal: FC<PoolSettingsModalI> = ({ id, onClose }) => {
  const [state, setState] = useState<any>(defaultState)
  const [sucess, setSucess] = useState(false)
  const {enqueueSnackbar} = useSnackbar()
  const [modalInfo, setModalInfo] = useAtom(modalInfoAtom)
  const [optionsPooling, setOptionsPooling] = useState<{name: any, url: any}>({
    name: null,
    url: null,
  })
  const [pool, setPool] = useState([]);

  const [options, setOptions] = useState<any>({
    coins: [],
    poolsByCoin: {},
    selectedCoin: null,
    selectedPool: null,
    poolData: null,
  });

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
        if (!item.name.includes(' ')) {
          return;
        }
  
        // Разделение на монету и пул
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
  
      // Получение уникальных имен и URL для пула
      const optionsName = res.rows
        .filter((item: any, index: any, self: any) =>
          index === self.findIndex((obj: any) => obj.name === item.name)
        )
        .map((item: any) => ({
          label: item?.name,
          value: item.name
        }));
  
      const optionsUrl = res.rows.map((item: any) => ({
        url: item.url,
        url1: item.url1,
        url2: item.url2
      }));
  
      setOptionsPooling((prevState) => ({
        ...prevState,
        name: optionsName,
        url: optionsUrl
      }));
    });
  }, []);


  useEffect(() => {
    if(options.poolData) {
      handleChange("first", "coin", options.selectedCoin.label)
      handleChange("first", "name", options.selectedPool.label)
      handleChange("first", "url", options.poolData?.urls?.url)
      handleChange("first", "password", options.poolData?.urls?.password)
      handleChange("second", "url", options.poolData?.urls?.url1)
      handleChange("second", "password", options.poolData?.urls?.password1)
      handleChange("third", "url", options.poolData?.urls?.url2)
      handleChange("third", "password", options.poolData?.urls?.password2)
    }
  }, [options])

  useEffect(() => {
    if (pool && pool.length !== 0) {
      setState((prevState: any) => {
        const newState = { ...prevState };
  
        pool.forEach((poolData: any) => {
          let matchedCoin: any = null;
          let matchedPool: any = null;
  
          Object.entries(options.poolsByCoin).forEach(([coin, pools]: any) => {
            const pool = pools.find((p: any) => p.urls.url === poolData.pool.url);
            if (pool) {
              matchedCoin = coin;
              matchedPool = pool;
            }
          });
  
          if (matchedCoin && matchedPool) {
            const selectedCoinObject = options.coins.find((coin: any) => coin.value === matchedCoin) || null;
            const selectedPoolObject = options.poolsByCoin[matchedCoin].find(
              (pool: any) => pool.urls.url === matchedPool.urls.url
            ) || null;
            setOptions((prevOptions: any) => ({
              ...prevOptions,
              selectedCoin: selectedCoinObject,
              selectedPool: selectedPoolObject,
              poolData: null,
            }));
            const poolDetails = {
              name: matchedPool.label || '',
              coin: matchedCoin || '',
              url: matchedPool.urls.url || '',
              user: poolData.pool.user || '',
              password: matchedPool.urls.password || '',
              urls: {
                url1: matchedPool.urls.url1,
                password1: matchedPool.urls.password1,
                url2: matchedPool.urls.url2,
                password2: matchedPool.urls.password2,
              },
              flag: true,
            };
  
            // Используем `poolData.pool.index` для записи в соответствующий ключ состояния
            if (poolData.pool.index === 0) {
              newState.first = poolDetails;
            } else if (poolData.pool.index === 1) {
              newState.second = poolDetails;
            } else if (poolData.pool.index === 2) {
              newState.third = poolDetails;
            }
          }
        });
  
        return newState;
      });
    }
  }, [pool, options.poolsByCoin, setState])

  useEffect(() => {
    Promise.all([
      deviceAPI.getDeviceData(id, {relations: {
        devicePools: {pool: true},
        model: true
      }})
    ]).then((res: any) => {
      const [device] = res; 
      setState((prevState: any) => {
        return {
          ...prevState,
          title: device.model.name
        }
      })
      setPool(device.devicePools)
      if(device && device.devicePools && device?.devicePools.length !== 0) {
        setState((prevState: any) => {
          const newState = { ...prevState };
          device.devicePools.forEach((poolData: any) => {
            switch (poolData.pool.index) {
              case 0:
                newState.first = {
                  name: poolData.pool.name || '',
                  url: poolData.pool.url || '',
                  user: poolData.pool.user || '',
                  password: poolData.pool.password || '',
                  flag: true
                };
                break;
              case 1:
                newState.second = {
                  url: poolData.pool.url || '',
                  user: poolData.pool.user || '',
                  password: poolData.pool.password || '',
                  flag: true
                };
                break;
              case 2:
                newState.third = {
                  url: poolData.pool.url || '',
                  user: poolData.pool.user || '',
                  password: poolData.pool.password || '',
                  flag: true
                };
                break;
              default:
                break;
            }
          });
          return newState;
        });
      }
    })
  }, [id, setState]);

  const handleChange = (pool: string, field: string, value: string | boolean) => {
    setState((prevState: any) => {
      const fieldsetState = prevState[pool]

      if (!!fieldsetState) {
        return {
          ...prevState,
          [pool]: {
            ...fieldsetState,
            [field]: value
          }
        }
      }
      return prevState
    })
  }

  const handleFirstSelectName = (e: any, newValue: any) => {
    handleChange('default', 'name', newValue?.value)
  }

  const updateOnePool = async () => {
    const nameArea = state.first.coin + " " + state.first.name;
    const newData: any = {
      name: nameArea,
      pool: state.first.flag ? 1 : 0,
      pool2: state.second.flag ? 1 : 0,
      pool3: state.third.flag ? 1 : 0,
    }
    if(nameArea && nameArea.length !== 0 && state.second.flag) {
      newData.name2 = nameArea
    }
    if(nameArea && nameArea.length !== 0 && state.third.flag) {
      newData.name3 = nameArea
    }
    if(state.first.url !== "" && state.first.url !== undefined && state.first.flag) {
      newData.url = state.first.url
    }
    if(state.first.user !== "" && state.first.user !== undefined && state.first.flag) {
      newData.user = state.first.user
    }
    if(state.first.password !== "" && state.first.password !== undefined && state.first.flag) {
      newData.password = state.first.password
    }
    if(state.second.url !== "" && state.second.url !== undefined && state.second.flag) {
      newData.url2 = state.second.url
    }
    if(state.second.user !== "" && state.second.user !== undefined && state.second.flag) {
      newData.user2 = state.second.user
    }
    if(state.second.password !== "" && state.second.password !== undefined && state.second.flag) {
      newData.password2 = state.second.password
    }
    if(state.third.url !== "" && state.third.url !== undefined && state.third.flag) {
      newData.url3 = state.third.url
    }
    if(state.third.user !== "" && state.third.user !== undefined && state.third.flag) {
      newData.user3 = state.third.user
    }
    if(state.third.password !== "" && state.third.password !== undefined && state.third.flag) {
      newData.password3 = state.third.password
    }
    deviceAPI.updateManyDevicesPools({where: {id}}, newData)
      .then(res => {
        setSucess(true)
        if(onClose) {
          onClose()
        }
        setModalInfo({
          open: true,
          action: "Обновление пулов",
          status: "Успешно",
          textInAction: "Пулы сохранены. Через 3 секунды страница обновится."
        })
        setTimeout(() => {
          window.location.reload()
      }, 3000)
      }).catch(err => {
        enqueueSnackbar('Произошла ошибка при обновлении', {
          variant: "error",
          autoHideDuration: 3000
        })
      })
    }

  const classes = useStyles()

  const resetState = () => {
    setState(defaultState);
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      selectedCoin: null,
      selectedPool: null,
      poolData: null,
    }));
  };

  const handleCoinChange = (event: any, newValue: any) => {
    if (newValue === null) {
      setState(defaultState);
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
        poolData: null, // Очистить данные пула при смене монеты
      }));
    }
    // setPooling(initialState)
  };

  const handlePoolChange = (e: any, newValue: any) => {
    if(newValue === null) {
      setState(defaultState);
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

  const handleSelectChange = (
    poolingName: keyof typeof state,
    propertyName: keyof typeof state.first,
    value: string | null | undefined | boolean
  ) => {
    setState((prevState: any) => {
      return {
        ...prevState,
        [poolingName]: {
          ...prevState[poolingName],
          [propertyName]: value
        }
      };
    })
  }

  const [flagPool, setFlagPool] = useState(false)
  console.log("flagPool", flagPool)
  
  return (
    <Dialog
      title={`Настройки пулов ${state.title}`}
      closeBtn
      onClose={onClose}
      className={styles.el}
      wide
    >
      <div className={styles.testBox}>
        <Heading text={`Пользовательский пул`} className={styles.headingItem} />
        <input 
          checked={flagPool}
          onChange={() => setFlagPool((prevState) => !prevState)}
          type="checkbox"
        />
      </div>
      {!flagPool && <div className={styles.chooseCoin}>

      
      {!flagPool && <Autocomplete
        id="combo-box-demo"
        disablePortal
        sx={{
          borderRadius: "40px !important"
        }}
        onChange={handleCoinChange} 
        // onChange={(_, newValue) => setValue(value)}
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
      />}
      {!flagPool && options.selectedCoin && (
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
            const selectedPoolIcon = options.poolsByCoin[options.selectedCoin.label]?.find(
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
        )}
        </div>}
      {/* <MultiSelect
          items={optionsPooling.name !== null ? optionsPooling.name : []}
          onChange={handleFirstSelectName}
          label={`Имя пула`}
          type="pool"
      /> */}
      <div className={styles.fieldset}>
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: "25px"
        }}>
          {Array.from({length: Number(3)}).map((item, key) => (
            <div key={key} className={styles.wrapperBack}>
              <Pooltem 
                value={state}
                keys={key}
                items={optionsPooling}
                onChanges={handleSelectChange}
                workerBool={true}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.buttons}>
        {!flagPool ? <Button 
          title="Сохранить" 
          className={styles.submit} 
          onClick={updateOnePool} 
          disabled={!(options.selectedCoin && options.selectedPool)}
          icon={<IconSave width={22} height={22} />} 
        /> : <Button 
          title="Сохранить" 
          className={styles.submit} 
          onClick={updateOnePool} 
          // disabled={!(options.selectedCoin && options.selectedPool)}
          icon={<IconSave width={22} height={22} />} 
        />}

      </div>
      {sucess && <ErrorPopup isSuccess={sucess} text='Пул успешно обновлён' />}
    </Dialog>
  )
}

export default PoolSettingsModal
