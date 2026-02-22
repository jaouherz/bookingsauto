const axios = require("axios");

const LOGIN_URL = "https://backend.oddo-tunis.work-point.tech/api/User/loginUser";
const BOOK_URL  = "https://backend.oddo-tunis.work-point.tech/api/Operation/addNewReservations";

const USER_ID = "699585126096565885dc9443";
const DESK_ID = "656f3463c0404082c15d7607";
//const DESK_ID = "656f3256c0404082c15d7589";

function tomorrowYmdLocal() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString("sv-SE"); // YYYY-MM-DD local
}

async function run() {
    try {
        // 1) LOGIN (use the correct field names)
        const login = await axios.post(
            LOGIN_URL,
            {
                Email: "mohamed-jaouher.zouari@oddo-bhf.com",
                password: "JiLr6X*0"
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const token = login.data?.token;
        if (!token) throw new Error("Token not found (expected login.data.token)");

        // 2) payload (array AM + PM)
        const reservationdate = ymdLocalDaysFromNow(16);
        const payload = [
            { timeslot: "AM", user: USER_ID, desk: DESK_ID, reservationdate },
            { timeslot: "PM", user: USER_ID, desk: DESK_ID, reservationdate }
        ];

        // 3) book (token header exactly)
        const resp = await axios.post(BOOK_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                "X-Access-Token": token,
                "Accept": "*/*"
            }
        });

        console.log("✅ Reservation Success:", resp.data);
    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
        process.exitCode = 1;
    }
}
function ymdLocalDaysFromNow(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("sv-SE"); // YYYY-MM-DD
}
run();