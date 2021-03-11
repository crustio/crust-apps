const headers = new Headers()
headers.append ("Authorization","Basic Y3J1c3Q6MTYyNTM0");
const requestOptions = {
  method: 'GET',
  headers,
  redirect: 'follow'
}
export const fetchInfoByAccount = (accountId= "5GYhrGQEz82p75LjvBYXF6HgPbwuFCATjC516emaFnGxW36V") => {
  return fetch(`https://splorer-api.crustcode.com/api/accountFiles?accountId=${accountId}`, requestOptions).then((res) => res.json())
}
export const fetchFileTobeClaimed = () => {
  return fetch(`http://47.100.33.107:13030/api/filesToBeClaimed`, requestOptions).then((res) => res.json())
}
