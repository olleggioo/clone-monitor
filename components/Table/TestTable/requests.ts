import { deviceAPI } from "@/api";

const handleDeviceAction = ({
    apiMethod,
    successAction,
    successMessage,
    errorMessage,
    closeModal, 
    setModalInfo,  
    whereCondition,
    deviceId
  }: any) => {
    if (deviceId !== null && deviceId.length !== 0) {
      apiMethod
      .then(() => {
        closeModal(false);
        setModalInfo({
          open: true,
          action: successAction,
          status: "Успешно. Страница перезагрузится через 3 секунды",
          textInAction: successMessage
        });
        window.location.reload()
      })
      .catch((err: any) => {
        closeModal(false);
        setModalInfo({
          open: true,
          action: successAction,
          status: "Ошибка",
          textInAction: errorMessage
        });
        console.error(err);
      });
    }
};

const reserveDeviceSubmit = (setModal: any, setModalInfo: any, deviceId: string) => {
    if(deviceId !== null && deviceId.length !== 0) {
        handleDeviceAction({
            apiMethod: deviceAPI.reserveDeviceById({
                where: Array.isArray(deviceId) ? deviceId : {
                    id: deviceId
                }
            }),
            successAction: "Резервирование устройства",
            successMessage: "Запрос на резервирование устройства в очереди",
            errorMessage: "Произошла ошибка при резервировании устройства",
            closeModal: setModal,
            setModalInfo: setModalInfo,
            deviceId
        });
    }
};

const restoreDeviceSubmit = (setModal: any, setModalInfo: any, deviceId: string) => {
    if(deviceId !== null && deviceId.length !== 0) {
        handleDeviceAction({
            apiMethod: deviceAPI.restoreDeviceById({
                    where: Array.isArray(deviceId) 
                        ? deviceId 
                    : {
                        id: deviceId
                    }
                }),
            successAction: "Восстановление устройства",
            successMessage: "Запрос на восстановление устройства в очереди",
            errorMessage: "Произошла ошибка при восстановлении устройства",
            closeModal: setModal,
            setModalInfo: setModalInfo,
            deviceId
        });
    }
};

const enableDevice = (setModal: any, setModalInfo: any, deviceId: string) => {
    if(deviceId !== null && deviceId.length !== 0) {
        handleDeviceAction({
            apiMethod: deviceAPI.enableDevice({
                where: {
                    // id: deviceId.map((item: any) => ({ id: item.id }))
                    id: deviceId
                }
            }),
            successAction: "Включение устройства",
            successMessage: "Запрос на включение устройства в очереди",
            errorMessage: "Произошла ошибка при изменении состояния майнинга",
            closeModal: setModal,
            setModalInfo: setModalInfo,
            deviceId
        });
    }
};

const disableDevice = (setModal: any, setModalInfo: any, deviceId: string) => {
    if(deviceId !== null && deviceId.length !== 0) {
        handleDeviceAction({
            apiMethod: deviceAPI.disableDevice({
                where: {
                    // id: deviceId.map((item: any) => ({ id: item.id }))
                    id: deviceId
                }
            }),
            successAction: "Выключение устройства",
            successMessage: "Запрос на выключение устройства в очереди",
            errorMessage: "Произошла ошибка при изменении состояния майнинга",
            closeModal: setModal,
            setModalInfo: setModalInfo,
            deviceId
        });
    }
};

const archiveDeviceSubmit = (setModal: any, setModalInfo: any, deviceId: string) => {
    if(deviceId !== null && deviceId.length !== 0) {
        handleDeviceAction({
          apiMethod: deviceAPI.archiveDevice(deviceId),
          successAction: "Расторжение устройства",
          successMessage: "Запрос на расторжение устройства в очереди",
          errorMessage: "Произошла ошибка на расторжение устройства",
          closeModal: setModal,
          setModalInfo: setModalInfo,
          deviceId
        });
    }
};

const repairDeviceSubmit = (setModal: any, setModalInfo: any, deviceId: string) => {
    if(deviceId !== null && deviceId.length !== 0) {
        handleDeviceAction({
          apiMethod: deviceAPI.repairDevice(deviceId),
          successAction: "Ремонт устройства",
          successMessage: "Запрос на ремонт устройства в очереди",
          errorMessage: "Произошла ошибка на ремонт устройства",
          closeModal: setModal,
          setModalInfo: setModalInfo,
          deviceId
        });
    }
};

export {
    reserveDeviceSubmit,
    restoreDeviceSubmit,
    enableDevice,
    disableDevice,
    archiveDeviceSubmit,
    repairDeviceSubmit
}