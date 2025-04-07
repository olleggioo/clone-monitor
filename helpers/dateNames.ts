export const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
export const days = ['Пн', 'Вт', 'Ср', 'Чт','Пт','Сб','Вс']
export const locale = {
    localize: {
        day: (n: any) => days[n],
        month: (n: any) => months[n]
    },
    formatLong: {
        date: () => 'mm/dd/yyyy'
    }
};