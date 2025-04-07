function byField(fieldName: string){
    return (a: any, b: any) => a[fieldName] > b[fieldName] ? 1 : -1;
}

export default byField