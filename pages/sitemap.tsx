import { Heading } from '@/ui'
import { NextPage } from 'next'
import Link from 'next/link'

const Sitemap: NextPage = () => {
  return (
    <div className="sitemap">
      <Heading size="lg" tagName="h1" text="Promminer" />

      <ol>
        <li>
          <Link href="/login">Логин</Link>
        </li>
        <li>
          <Link href="/login/verification">Подтверждение</Link>
        </li>
        <li>-------------</li>
        <li>
          <Link href="/">Статистика</Link>
        </li>
        <li>
          <Link href="/devices">Устройства</Link>
        </li>
        <li>
          <Link href="/devices/1">Устройство</Link>
        </li>
        <li>
          <Link href="/add-device">Добавить устройство</Link>
        </li>
        <li>
          <Link href="/edit-device">Редактировать устройство</Link>
        </li>
        <li>
          <Link href="/users">Пользователи</Link>
        </li>
      </ol>
    </div>
  )
}

export default Sitemap
