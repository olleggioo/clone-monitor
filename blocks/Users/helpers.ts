import { RoleName, Roles } from '@/const'
import { TableCellI, TableHeadCellI, TableRowI } from '@/components/Table/Table'
import { UserI } from '@/interfaces'

function analyzeArray(array: any[]) {
  const enabledCount = array.filter(item => !item.isDisabled).length;
  const disabledCount = array.length - enabledCount;
  if (enabledCount === array.length) {
      return "Enabled";
  } else if (disabledCount === array.length) {
      return "Disabled";
  } else {
      return "Partially disabled";
  }
}

export const getUsersTableData = (
  head: TableHeadCellI[], 
  users: UserI[], 
  statuses: any[],
  rowClick: (id: string) => void  
) => {
  return users.map((user) => {
    
    const devicesCountByStatus: { [statusId: string]: number } = {};
    statuses.forEach(status => {
        devicesCountByStatus[status.id] = 0;
    });
    

    user.userDevices && user.userDevices.forEach((device: any) => {
      devicesCountByStatus[device.device.statusId] += 1;
    })


    const columns: TableCellI[] = []
    for (const cell of head) {
      let title
      if (cell.accessor) {
        if (cell.accessor === 'role') {
            title = Roles[user[cell.accessor].name as RoleName] || user.role.name;
        } else if (cell.accessor === 'statuses') {
            // Формируем строку с количеством устройств по каждому статусу
            title = statuses.map(status => {
              const count = devicesCountByStatus[status.id] || 0;
              
              return `${count}`;
          }).join(' / ');
        } else if (cell.accessor === 'miningState') {
          let miningStateTitle = '';
          if(user.userDevices && user.userDevices.length !== 0) {

            const devices = user.userDevices;
            const hasEnabledDevice = devices.some((device: any) => !device.isDisabled);
            const hasDisabledDevice = devices.some((device: any) => device.isDisabled);

            if (hasEnabledDevice && hasDisabledDevice) {
                miningStateTitle = 'Частично выключен';
            } else if (hasEnabledDevice) {
                miningStateTitle = 'Включен';
            } else {
                miningStateTitle = 'Выключен';
            }

            title = miningStateTitle;
          }
        } 
        else if (cell.accessor === "counts") {
          let counts = 0;
          if(user.userDevices) {
            title = user.userDevices.length
            statuses.map(status => {
              const count = devicesCountByStatus[status.id] || 0;
              counts += count
            })
          }
          // title = counts
        }
        else {
            title = user[cell.accessor as keyof UserI] || '';
        }
    }
      
      columns.push({
        ...cell,
        title: title as string
      })
    }

    const handleClick = () => {
      if (user.id) {
        rowClick(user.id)
      }
    }

    return {
      id: user.id,
      devicesId: user.userDevices,
      columns,
      onClick: handleClick
    } as TableRowI
  })
}
