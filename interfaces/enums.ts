export enum PagesEnum {
  // home = 'Главная',
  statistics = 'Статистика',
  devices = 'Устройства',
  users = 'Пользователи',
  areas = 'Площадки',
  pools = 'Шаблоны пулов',
  models = 'Модели',
  archive = 'Расторжение',
  roleAccess = 'Доступы роли'
}

export enum PagesEnumClients {
  statistics = 'Статистика',
  devices = 'Устройства',
}

export enum PagesRolledEnum {
  // home = '',
  statistics = '',
  devices = '',
  archive = '',
  users = '',
  areas = '',
  pools = '',
  models = ''
}

export enum PagesRolledClientsEnum {
  statistics = '',
  devices = '',
}

export enum RolesEnum {
  admin = 'Админ',
  owner = 'Владелец',
  client = 'Клиент'
}

export enum StatusEnum {
  'normal' = 'В норме',
  'warning' = 'Предупреждение',
  'error' = 'Проблема',
  'not_online' = 'Не в сети',
  // 'not_configured' = 'Не настроено'
}

export enum MiningStatsEnum {
  minutes = '15m',
  hour = '1h',
  day = '1d',
  week = '1w'
}

export enum HashUnitEnum {
  ZH = '1000000000000000000000',
  EH = '1000000000000000000',
  PH = '1000000000000000',
  TH = '1000000000000',
  GH = '1000000000',
  MH = '1000000',
  KH = '1000'
}

export enum EnergyUnitEnum {
  ZW = '1000000000000000000000',
  EW = '1000000000000000000',
  PW = '1000000000000000',
  TW = '1000000000000',
  GW = '1000000000',
  MW = '1000000',
  KW = '1000',
  W = "1",
}
