import moment from "moment";

const formatDate = (date: Date, addEnd = false) => 
    `${moment(date).format("YYYY-MM-DD HH:mm:ss")}${addEnd ? '' : ''}`;

export default formatDate;