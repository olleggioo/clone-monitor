import { FC, useMemo, useState } from 'react'

import { TabsControlI } from '../TabsControls/TabsControls'
import TabsControls from '../TabsControls'
import Dashboard from '../Dashboard'
import { useRouter } from 'next/router'

const tabControls: TabsControlI[] = [
  { text: 'Все' },
  { text: 'В норме', mod: 'green', count: 4000 },
  { text: 'Предупреждение', mod: 'yellow', count: 12 },
  // { text: 'Не в сети' },
  { text: 'Не настроено' },
  { text: 'Проблема', mod: 'red', count: 1 }
]

const Devices: FC = () => {
  const [currentTab, setCurrentTab] = useState('Все')
  const router = useRouter()

  return (
    <Dashboard>
      <TabsControls
        items={tabControls}
        currentTab={currentTab}
        onChange={setCurrentTab}
      />
    </Dashboard>
  )
}
export default Devices
