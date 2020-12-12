export let accessToken = ""

export const setAccesstoken = (token) =>{
    accessToken = token
}

export const getAccessToken = ()=>{
    return accessToken;
}
