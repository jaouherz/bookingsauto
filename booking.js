const axios = require("axios");

const LOGIN_URL = "https://backend.oddo-tunis.work-point.tech/api/User/loginUser";
const BOOK_URL = "https://backend.oddo-tunis.work-point.tech/api/Operation/addNewReservations";

const USER_ID = "699585126096565885dc9443";
const DESK_ID = "656f3256c0404082c15d7589";

async function run() {
    try {
        // LOGIN
        const login = await axios.post(LOGIN_URL, {
            username: process.env.USERNAME,
            password: process.env.PASSWORD
        });

        const token = login.data.user.token;

        // BOOK
        await axios.post(
            BOOK_URL,
            {
                timeslot: "PM",
                user: USER_ID,
                desk: DESK_ID,
                reservationdate: new Date().toISOString().split("T")[0]
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("✅ Reservation Success");
    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
    }
}

run();
