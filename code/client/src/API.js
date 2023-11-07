const SERVER_URL = 'http://localhost:3001';

const getUserInfo = async() => {
    const student = {
        "id": 200001,
        "email": "mario.rossi@studenti.polito.it",	
        "role": "student"
    }
    return student;
}
const API= {getUserInfo};
export default API;