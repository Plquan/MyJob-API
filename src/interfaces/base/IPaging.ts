export default interface IPaging {
  page: number
  limit:number
}

export const defaultPaging: IPaging = {
  page: 1, 
  limit: 10,
}