import Cookies from 'universal-cookie';
const cookies = new Cookies();
const token = cookies.get('response');
export const authToken = 'Bearer ' + token;
export const headers = {
  headers: {
    'content-type': 'application/json',
    Authorization: authToken,
  },
};
const userId = cookies.get('userId');
export const userIDObj = {
  userId: userId,
};
export const userID = userId;

export const listOnSaleUrl = 'api/users/changeForSaleStatus';
export const getNftsbyUsername = 'api/users/getForSaleCertificatesByUsername';
