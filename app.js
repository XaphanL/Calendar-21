const SUPABASE_URL = "https://dakulezwuyfcgltclgwq.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRha3VsZXp3dXlmY2dsdGNsZ3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzEzNDksImV4cCI6MjA5Njg0NzM0OX0.4ZS7KxClTzOgFlxIBuJyknCqNtDJm74o22_qF42gVjM";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);
console.log("Supabase:", supabase);
console.log("URL:", SUPABASE_URL);
console.log("KEY length:", SUPABASE_KEY.length);
// =====================
// AUTH
// =====================

const Auth = {
getName() {
let name = localStorage.getItem("username");

    if (!name) {
        name = prompt("Введите ваше имя");

        if (!name || !name.trim()) {
            name = "Гость";
        }

        localStorage.setItem("username", name);
    }

    return name;
},

changeName() {
    const name = prompt("Введите новое имя");

    if (name && name.trim()) {
        localStorage.setItem("username", name.trim());
        location.reload();
    }
}

};

// =====================
// STORAGE
// =====================

const Storage = {

async getDays() {

    const user = Auth.getName();

    const { data, error } = await db
        .from("users")
        .select("days")
        .eq("id", user)
        .maybeSingle();

    if (error) {
        console.error(error);
        return [];
    }

    if (!data) {
        return [];
    }

    return data.days || [];
},

async saveDays(days) {

    const user = Auth.getName();

    const { error } = await db
        .from("users")
        .upsert({
            id: user,
            name: user,
            days: days
        });

    if (error) {
        console.error(error);
    }
}

};

// =====================
// CALENDAR
// =====================

const Calendar = {

currentDate: new Date(),

monthNames: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
],

async render() {

    const calendar =
        document.getElementById("calendar");

    calendar.innerHTML = "";

    const year =
        this.currentDate.getFullYear();

    const month =
        this.currentDate.getMonth();

    document.getElementById("monthTitle")
        .textContent =
        `${this.monthNames[month]} ${year}`;

    const firstDay =
        new Date(year, month, 1);

    let startDay =
        firstDay.getDay();

    startDay =
        startDay === 0 ? 6 : startDay - 1;

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    const selected =
        await Storage.getDays();

    for (let i = 0; i < startDay; i++) {

        const empty =
            document.createElement("div");

        empty.className = "day empty";

        calendar.appendChild(empty);
    }

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateKey =
            `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const cell =
            document.createElement("div");

        cell.className = "day";

        if (
            selected.includes(dateKey)
        ) {
            cell.classList.add("free");
        }

        cell.textContent = day;

        cell.addEventListener(
            "click",
            async () => {

                let days =
                    await Storage.getDays();

                if (
                    days.includes(dateKey)
                ) {

                    days =
                        days.filter(
                            d => d !== dateKey
                        );

                } else {

                    days.push(dateKey);
                }

                await Storage.saveDays(days);

                await this.render();
            }
        );

        calendar.appendChild(cell);
    }
}

};

// =====================
// INIT
// =====================

document.addEventListener(
"DOMContentLoaded",
async () => {

    document.getElementById(
        "username"
    ).textContent =
        "👤 " + Auth.getName();

    document.getElementById(
        "changeNameBtn"
    ).onclick =
        () => Auth.changeName();

    document.getElementById(
        "prevMonth"
    ).onclick =
        async () => {

            Calendar.currentDate
                .setMonth(
                    Calendar.currentDate.getMonth() - 1
                );

            await Calendar.render();
        };

    document.getElementById(
        "nextMonth"
    ).onclick =
        async () => {

            Calendar.currentDate
                .setMonth(
                    Calendar.currentDate.getMonth() + 1
                );

            await Calendar.render();
        };

    await Calendar.render();
}

);


(async () => {
    const { data, error } = await db
        .from("users")
        .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);
})();
