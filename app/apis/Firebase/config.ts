export const APIKEY = 'AIzaSyCaS4JWMbbrhSXlYb6W0B81qQo1GSRU28c';
export const SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`;
export const SIGNIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKEY}`;
export const REFRESH = `https://securetoken.googleapis.com/v1/token?key=${APIKEY}}`;
//참고
// sign up 의 data:
// email , password, returnSecureToken: true
