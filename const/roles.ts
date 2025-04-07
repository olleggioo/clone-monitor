export enum RoleName {
  Owner = 'Root',
  Manager = 'Manager',
  Client = 'Member'
}

export enum RoleGroup {
  Team = 'Команда',
  Clients = 'Клиенты'
}

export const RoleToGroup = {
  [RoleName.Owner]: RoleGroup.Team,
  [RoleName.Manager]: RoleGroup.Team,
  [RoleName.Client]: RoleGroup.Clients
}

export const Roles = {
  [RoleName.Owner]: 'Владелец',
  [RoleName.Manager]: 'Администратор',
  [RoleName.Client]: 'Клиент'
}
