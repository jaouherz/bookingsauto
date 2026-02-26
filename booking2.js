const axios = require("axios");
require("dotenv").config();
const LOGIN_URL = process.env.LOGIN_URL || "https://backend.oddo-tunis.work-point.tech/api/User/loginUser";
const BOOK_URL  = process.env.BOOK_URL  || "https://backend.oddo-tunis.work-point.tech/api/Operation/addNewReservations";

// Account #2
const EMAIL = process.env.EMAIL2;
const PASSWORD = process.env.PASSWORD2;

// If user/desk are same, keep these; if different, set USER_ID2/DESK_ID2 too.
const USER_ID = process.env.USER_ID2 ;
const DESK_ID = process.env.DESK_ID2 ;

function ymdLocalDaysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("sv-SE");
}

// ✅ Skip Fri + Sat + Sun
function isBlockedDayInTunis(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));

  const dayName = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Tunis",
    weekday: "short",
  }).format(dt);

  return dayName === "Fri" || dayName === "Sat" || dayName === "Sun";
}

async function run() {
  try {
    if (!EMAIL || !PASSWORD || !USER_ID || !DESK_ID) {
      throw new Error("Missing env vars: EMAIL2, PASSWORD2, USER_ID/DESK_ID (or USER_ID2/DESK_ID2)");
    }

    const login = await axios.post(
      LOGIN_URL,
      { Email: EMAIL, password: PASSWORD },
      { headers: { "Content-Type": "application/json" } }
    );

    const token = login.data?.token;
    if (!token) throw new Error("Token not found (expected login.data.token)");

    const reservationdate = ymdLocalDaysFromNow(13);
    console.log("[ACC2] Booking for (Tunisia):", reservationdate);

    if (isBlockedDayInTunis(reservationdate)) {
      console.log("[ACC2] ⏭️ Blocked day (Fri/Sat/Sun). Skipping booking.");
      return;
    }

    const payload = [
      { timeslot: "AM", user: USER_ID, desk: DESK_ID, reservationdate },
      { timeslot: "PM", user: USER_ID, desk: DESK_ID, reservationdate },
    ];

    const resp = await axios.post(BOOK_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token,
        "Accept": "*/*",
      },
    });

    console.log("[ACC2] ✅ Reservation Success:", resp.data);
  } catch (err) {
    console.error("[ACC2] ❌ Error:", err.response?.data || err.message);
    process.exitCode = 1;
  }
}

run();
