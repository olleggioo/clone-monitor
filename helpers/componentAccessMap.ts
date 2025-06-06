// import { getUsersRole } from "@/api/user";

import { deleteManyDevices, updateDeviceMany } from "@/api/device";
import { getUserId } from "@/api/user";

export const componentAccessMap = {
    DisableManyDeviceByQuery: "72eccb1c-ee2b-4b8b-b461-e9de0a092daf",
    DropPoolManyByQuery: "01a7e51d-9fac-413f-b2e1-061020efa634",
    // Добавляйте новые компоненты по мере необходимости
};

export const requestsAccessMap: any = {
    getUsersRole: "0c2b96a3-75f6-49c4-bca3-23782572915b",
    updateManyOverclock: "03d8e686-8d35-4408-92ed-602a7681d82f",
    getUserDevicesId: "0cbf83ee-f95f-4ae7-b255-3a407c572ac5",
    updateManyDevicesPools: "0d3473a9-6908-4492-87d7-ef3265001857",
    getDevicesArea: "0d6bfada-0ea5-435d-9345-d537a34d8522",
    deleteDevice: "0da1127e-54b1-4bd9-89e8-fcad02f81062",
    createArea: "0faacd6f-fca0-4e33-ad9a-c41daf6c6f10",
    deletePoolMockById: "120a8116-c8ab-4aa3-a2db-2f2f8d182ef8",
    archiveDevice: "16101fcc-00bc-4080-a0ee-34937042c23b",
    getDevicesHashRateLog: "198695fa-3067-4a77-ba2b-21e9bed97eb3",
    createOnePoolMock: "218e9d6c-ef78-4a35-b6e9-3146e4ac7b13",
    getUserId: "224db81a-5d10-4f3b-97bc-288500a297db",
    getDeviceCommentId: "2322db4c-4c86-46d5-bae2-81bd452bd69c",
    archiveMassDevice: "2629f7a4-127a-4db4-8534-9e329df4207a",
    getRoleAccess: "277ffc4c-c70d-40f8-8c66-dff6ad692fda",
    getDevicesPoolMocksId: "35db83dc-3634-4241-8dbe-ed495829b291",
    updateOnePoolMock: "3788813f-3ac2-4934-9653-66ebbc95ca03",
    getDevicesLogFanLog: "3b471b53-9d67-4c8c-9938-b718416f5920",
    getDeviceArea: "3c3bcebe-d923-4488-b13d-22021d854361",
    createComment: "3cd71c1b-fe0e-4b2c-b320-81c1b5d86664",
    updateDeviceUser: "425b4662-65e0-4e0d-b443-7ba79ac2ca5a",
    getDevicesPoolMocks: "42d6f303-ef3b-4b6f-9b83-dee5bb6d9b30",
    deleteModelById: "45f343fd-6d92-4494-b713-1a19dd95dab1",
    reserveDeviceById: "4791242c-d319-4615-8cfd-3bb379969ae2",
    deleteUser: "581f2220-1243-41c6-a434-64a9e3b344a9",
    getComments: "5e2a2ecd-2181-4a29-9da2-8796a1e1dadf",
    deleteManyPoolMocks: "64a281b4-1a07-4e9a-bfda-1025eb578eab",
    createRole: "6579d040-3b5c-4ef6-b65d-eb052a63c95d",
    updateRoleAccessById: "683a5e02-3965-40d5-a8da-04e492da1277",
    getDeviceData: "71c11f9b-5aac-4241-b6c8-406d88cddb02",
    disableDevice: "72eccb1c-ee2b-4b8b-b461-e9de0a092daf",
    updateRoleById: "7810f197-56f5-4a00-b4a7-640b9c154707",
    getDeviceModel: "7d56382e-26e9-45f0-b5f4-41bda7bcfd93",
    getDevices: "7db7634b-5a11-404b-8179-4fd8dd1818b4",
    getDeviceModelId: "823bad9d-d868-45d6-9160-2d037b437bb0",
    getRangeIpById: "844997a5-feb3-49ea-9e60-06905ad09671",
    getDevicesLogTemperatureLog: "86215ecd-7388-4dff-9639-8ff36645428d",
    updateDeviceMany: "87ebe3e5-d88c-42b3-b205-d064077b9cd4",
    getDevicesAlgorithm: "8c843b97-e0cf-4907-b012-36513b4c7304",
    deleteComment: "8d98a907-e052-42b0-a996-c8a9a60582f2",
    updateOneRangesIp: "8ed56668-57b2-4698-be7a-1bf2e9d9309e",
    updateDevicePool: "922d6c98-e46c-42a6-8eae-26af87172c4b",
    deleteAreaById: "95762cd2-0334-4024-a8b4-2c46d4856561",
    createRangeIp: "969ed27e-c7cf-45e8-8b28-43caaf6e5d0e",
    updateModelId: "9717c3c3-2f6c-4f8e-be9d-30525fa6ceb6",
    getDevicesLogEnergyLog: "a0e70e99-1832-4a61-acfd-8908337da6ed",
    enableDevice: "a5a73d0b-58f4-4692-91b9-795232207f7e",
    deleteUserDevicesMany: "ae37b465-b609-47ed-b7e1-eec5ec53b9e2",
    deleteUserDeviceById: "afdc800f-9b29-4704-a131-bf69462997ce",
    getRangesIp: "b13485a5-388e-4dbb-ae82-2c7ac2326075",
    deleteManyUsers: "b2d214c6-201c-45cb-80f7-22b42fa5eb78",
    updateDevice: "bdb45bd9-8190-498d-9e80-592b1d980bfc",
    getUsers: "c8f157c1-0cf4-4451-a9b5-8ddc5c410da9",
    getDevicesStatus: "d45a83f4-b522-4829-be29-630f9356a238",
    createRoleAccess: "dacf6919-cafd-4f6f-a579-cede37ad6e1e",
    reloadManyDevices: "e0951600-aff0-450d-bab2-1d1a27447e5e",
    deleteManyDevices: "e0acbe7e-29f7-4692-ae3b-69e53d7facd6",
    updateAreaName: "e172be1a-812a-4feb-9072-2def9de32651",
    getDeviceDataHistory: "e337fc6d-fe8d-48be-ae02-cd649844aa54",
    updateUser: "e7e918ef-c92e-4b2e-a714-49d1c827417f",
    createUserDevice: "f3ac3c51-2774-453b-8ff2-8306c352ce8d",
    deleteRangeIpById: "f3ed1e5c-4d4e-4fc6-932b-8b8c1563cbe5",
    getDevicesPool: "f53bd274-6c4c-4728-a611-e2743ec5c9e6",
    getUserDevice: "fa12ca74-5ea4-40e1-a60b-d7f85d3e2723",
    createUser: "fb9e0075-0b8e-4944-a028-abd0f6fcb819",
    getAccess: "feeb0321-1f14-4f82-989f-60b4dda56703", 
    getDevicesPoolReserve: "f4e17672-4ec4-4bfd-a532-e3948412dff7",
    /// Служебный
    getRangeIpByIdAuthedAreaId: "3aabec7d-c424-4c06-8db0-e9ff48dae109",
    getRangesIpAuthedAreaId: "91548662-81ba-4f80-a8ab-ded10ba86896",
    getDevicesAuthedAreaId: "9f44b1a5-9fc2-4631-9f58-e4c31dc2945a",
    deleteDeviceAuthedUserId: "062c8abe-b209-48f1-a9ac-a8db9b3dd5de",
    deleteManyDevicesAuthedUserId: "0c74dc32-5239-4b31-b005-d88bbb4cdaa6",
    updateDevicePoolAuthedUserId: "0f4077ed-4bb9-4b17-974f-ff9f0ace9c6b",
    getUsersAuthedUserId: "13ae2b08-d03e-4983-8801-65e0da15cfb9",
    getDevicesLogFanLogAuthedUserId: "1415eac1-7303-4ab4-ad5d-eedfe11b0058",
    // getUserIdAuthedUserId: "1ee29415-520e-48fe-976b-7461fd77af5d", // GET /user-device/id
    updateDeviceManyAuthedUserId: "2a40a544-6253-4ec2-88d6-2e1663bd5bce",
    updateManyOverclockAuthedAreaId: "2a461711-c4d9-4152-9c62-73f47b8d6134",
    getDevicesPoolAuthedUserId: "326df788-374e-4884-8fcb-448b58a8034f",
    updateManyDevicesPoolsAuthedAreaId: "35ff5e48-59f2-49cd-9936-3f45d9a96414",
    getUserDeviceAuthedUserId: "3ee88ecb-c304-411a-a33e-30941b8a461a",
    deleteRangeIpByIdAuthedAreaId: "47a3141c-e9a8-45dd-8bed-93aafda038e9",
    deleteCommentAuthedUserId: "4b8d66d1-d619-4bd3-9ebe-b951f9a00b20",
    reloadManyDevicesAuthedUserId: "54fb1b08-96be-4ce7-be9e-ad17b1107428",
    reserveDeviceByIdAuthedAreaId: "57e4d01f-d5be-4948-a224-43ceba2311b5",
    getCommentsAuthedUserId: "628d0191-14b0-44a9-ada8-13bcdd4d3e04",
    archiveDeviceAuthedAreaId: "64945a09-020c-41e4-a884-64a2b7a3e500", //
    archiveMassDeviceAuthedAreaId: "6e866c1f-d8ef-45c5-89ad-d75a0e9c17df", //
    deleteManyUsersAuthedUserId: "74d2ae0f-2274-4725-a39a-50332de6ae28",
    getDevicesPoolReserveAuthedUserId: "75b3b6f8-9692-4582-8a80-b17bdbe1dc8d",
    getUserIdAuthedUserId: "7c99b540-9318-41bd-bb85-2ce4abff8bd9",
    updateDeviceAuthedUserId: "7ccc45c2-a605-48c9-8669-4db56e33f004",
    updateManyDevicesPoolsAuthedUserId: "8bb72777-3bbd-4721-bd2e-4a2595998521",
    // getRangesIpAuthedAreaId: "91548662-81ba-4f80-a8ab-ded10ba86896",
    getDevicesHashRateLogAuthedUserId: "96b2ffb9-8a54-47cf-9dde-1826e1b3e820",
    // getDevicesAuthedAreaId: "9f44b1a5-9fc2-4631-9f58-e4c31dc2945a",
    getDevicesLogTemperatureLogAuthedUserId: "a5fff110-8fe0-45c1-b0fc-c75fd3e7c63e",
    disableDeviceAuthedAreaId: "a83512c5-09bc-4b9a-85aa-f5bebb3f0365",
    updateOneRangesIpAuthedAreaId: "ac2e3040-65ae-4697-bd70-250e90be6f3c",
    getDevicesAuthedUserId: "b78d0670-d2c9-4dee-84a6-47f175e7ac5c",
    getDevicesLogEnergyLogAuthedUserId: "cd9ff8bf-c231-497e-8c0a-76c74c764c05",
    deleteUserDeviceByIdAuthedUserId: "d3931b61-e9fd-4133-95fe-5fd2ada7dabe",
    updateUserAuthedUserId: "e61cf93d-ac7f-43c9-bd2c-64c63a7816e2",
    enableDeviceAuthedAreaId: "e65b8bd3-2b3b-414b-97a7-802db1dc89a8",
    deleteUserDevicesManyAuthedUserId: "eabaebdb-0ade-4141-9e3c-ab999fbe4669",
    getDeviceDataAuthedUserId: "ee615386-2296-477f-a5ea-c1386418e840",
    deleteUserAuthedUserId: "f0684165-b6a7-48fc-99ac-b8b70f167974",

    

}

export const requestsAccessTranslation: any = {
    getUsersRole: "Пользователи: Получние ролей пользователей",
    updateManyOverclock: "Устройства: Разгон для нескольких устройств",
    getUserDevicesId: "Устройства: Получить устройства пользователя по user-id",
    updateManyDevicesPools: "Устройства: Обновить пулы для нескольких устройств",
    getDevicesArea: "Площадки: Получение площадок",
    deleteDevice: "Устройства: Удаление устройства",
    createArea: "Площадки: Создание площадки",
    deletePoolMockById: "Пулы: Удалить pool-mock по ID",
    archiveDevice: "Устройства: Архивирование устройства",
    getDevicesHashRateLog: "Графики: Получение логов хешрейта устройств",
    createOnePoolMock: "Пулы: Создать один pool-mock",
    getUserId: "Пользователи: Получить пользователя по ID",
    getDeviceCommentId: "Устройства: Получить комментарий устройства по ID",
    archiveMassDevice: "Устройства: Массовое архивирование устройств",
    getRoleAccess: "Пользователи: Получить доступы роли",
    getDevicesPoolMocksId: "Пулы: Получить pool-mock устройств по ID",
    updateOnePoolMock: "Пулы: Обновить один pool-mock",
    getDevicesLogFanLog: "Логи: Получить логи вентиляторов устройств",
    getDeviceArea: "Площадки: Получить площадку",
    createComment: "Устройства: Создать комментарий",
    updateDeviceUser: "Устройства: Обновить user-device",
    getDevicesPoolMocks: "Пулы: Получить pool-mock устройств",
    deleteModelById: "Удалить модель по ID",
    reserveDeviceById: "Устройства: Зарезервировать устройство по ID",
    deleteUser: "Пользователи: Удаление пользователя",
    getComments: "Устройства: Получение комментариев",
    deleteManyPoolMocks: "Пулы: Удалить несколько pool-mock",
    createRole: "Роли: Создание роли",
    updateRoleAccessById: "Роли: Обновить доступы роли по ID",
    getDeviceData: "Устройства: Получение данных устройств по ID",
    disableDevice: "Устройства: Отключение устройств",
    updateRoleById: "Роль: Обновление роль по ID",
    getDeviceModel: "Модель: Получение модели",
    getDevices: "Устройства: Получение устройств",
    getDeviceModelId: "Модель: Получение модели по ID",
    getRangeIpById: "Устройства: Получение диапазонов по ID",
    getDevicesLogTemperatureLog: "Логи: Получение логов температуры устройства",
    updateDeviceMany: "Устройства: Массовое обновление устройств",
    getDevicesAlgorithm: "Устройства: Получение алгоритмов",
    deleteComment: "Устройства: Удаление комментариев",
    updateOneRangesIp: "Устройства: Обновление диапазонов IP",
    updateDevicePool: "Пулы: Обновление пулов устройства",
    deleteAreaById: "Площадки: Удаление области по ID",
    createRangeIp: "Устройства: Создание диапазонов IP",
    updateModelId: "Модель: Обновление модели по ID",
    getDevicesLogEnergyLog: "Логи: Получение логов энергопотребления устройства",
    enableDevice: "Устройства: Включение устройства",
    deleteUserDevicesMany: "Пользователи: Массовое удаление user-device",
    deleteUserDeviceById: "Пользователи: Удаление user-device по ID",
    getRangesIp: "Устройства: Получение диапазонов IP",
    deleteManyUsers: "Пользователи: Массовое удаление пользователей",
    updateDevice: "Устройства: Обновление устройства",
    getUsers: "Пользователи: Получение пользователей",
    getDevicesStatus: "Устройства: Получение статусов",
    createRoleAccess: "Роли: Создание role-access",
    reloadManyDevices: "Устройства: Массовая перезагрузка устройств",
    deleteManyDevices: "Устройства: Массовое удаление устройств",
    updateAreaName: "Площадки: Обновление названия площадки",
    getDeviceDataHistory: "Устройства: Получение истории данных устройства",
    updateUser: "Пользователи: Обновление устройства",
    createUserDevice: "Устройства: Создание user-device",
    deleteRangeIpById: "Устройства: Удаление диапазона IP по ID",
    getDevicesPool: "Пулы: Получение пулов устройств",
    getUserDevice: "Устройства: Получение user-device",
    createUser: "Пользователи: Создание пользователя",
    getAccess: "Роли: Получение role-access",
};