const SERVER_URL = 'http://localhost:3001';

const getUserInfo = async() => {
    //TODO: fetch real data
    const user = { 
        "id": 200001,
        "email": "mario.rossi@studenti.polito.it",	
        "role": "student"
    }
    return user;
}
const API= {getUserInfo};
export default API;