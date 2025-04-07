import ProfileUser from "@/components/ProfileUser";
import { Layout } from "..";

const EmptyWrapper = () => {
    return <Layout header={<ProfileUser title='Пустой шаблон' />}>
        У вас нет доступа к данной странице
    </Layout>
}

export default EmptyWrapper;