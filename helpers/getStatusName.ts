const getStatusName = (name: string) => {
  const formattedName = name.toLowerCase().replace(' ', '_')
  switch (formattedName) {
    case 'normal':
      return 'В норме'
    case 'warning':
      return 'Предупреждение'
    case 'error':
      return 'Проблема'
    case 'not_online':
      return 'Не в сети'
    case 'in_archive':
      return 'Расторжение'
    // case 'not_configured':
    //   return 'Не настроено'
    case 'worked_to_not_worked':
      return 'Рабочие/не рабочие(%)'
    case 'in_repair':
      return 'В ремонте'
    case 'all':
      return 'Всего устройств'
    default:
      return name
  }
}

export default getStatusName
