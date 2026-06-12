// =====================
// Firebase INIT
// =====================

const firebaseConfig = {
    apiKey: "AIzaSyA2q5NHoC63zC-WcFcDrE2gNLNsfNF5PaE",
    authDomain: "calendar-21-fa28b.firebaseapp.com",
    projectId: "calendar-21-fa28b",
    storageBucket: "calendar-21-fa28b.firebasestorage.app",
    messagingSenderId: "624589506758",
    appId: "1:624589506758:web:e467a5b1a53a0a3ac7efc7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// =====================
// AUTH (пока простой)
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
        let name = prompt("Введите новое имя");

        if (name && name.trim()) {
            localStorage.setItem("username", name);
            location.reload();
        }
    }
};


// =====================
// STORAGE (Firebase)
// =====================

const Storage = {

    async getDays() {
        const user = Auth.getName();

        const doc = await db.collection("users").doc(user).get();

        if (!doc.exists) return [];

        const data = doc.data();

        return data.days || [];
    },

    async saveDays(days) {
        const user = Auth.getName();

        await db.collection("users").doc(user).set({
            days: days
        });
    }
};


// =====================
// CALENDAR
// =====================

const Calendar = {

    currentDate: new Date(),

    monthNames: [
        "Январь","Февраль","Март","Апрель","Май","Июнь",
        "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
    ],

    async render() {
        const calendar = document.getElementById("calendar");
        calendar.innerHTML = "";

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        document.getElementById("monthTitle")
            .textContent = `${this.monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1);

        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // загружаем данные пользователя
        const selected = await Storage.getDays();

        // пустые клетки
        for (let i = 0; i < startDay; i++) {
            const empty = document.createElement("div");
            empty.className = "day empty";
            calendar.appendChild(empty);
        }

        // дни месяца
        for (let day = 1; day <= daysInMonth; day++) {

            const dateKey =
                `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const cell = document.createElement("div");
            cell.className = "day";
            cell.textContent = day;

            if (selected.includes(dateKey)) {
                cell.classList.add("free");
            }

            cell.addEventListener("click", async () => {

                let days = await Storage.getDays();

                if (days.includes(dateKey)) {
                    days = days.filter(d => d !== dateKey);
                } else {
                    days.push(dateKey);
                }

                await Storage.saveDays(days);

                this.render();
            });

            calendar.appendChild(cell);
        }
    }
};


// =====================
// INIT
// =====================

document.addEventListener("DOMContentLoaded", async () => {

    document.getElementById("username").textContent =
        "👤 " + Auth.getName();

    document.getElementById("changeNameBtn").onclick =
        () => Auth.changeName();

    document.getElementById("prevMonth").onclick =
        async () => {
            Calendar.currentDate.setMonth(Calendar.currentDate.getMonth() - 1);
            await Calendar.render();
        };

    document.getElementById("nextMonth").onclick =
        async () => {
            Calendar.currentDate.setMonth(Calendar.currentDate.getMonth() + 1);
            await Calendar.render();
        };

    await Calendar.render();
});};

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

    render() {

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

        for (let i = 0; i < startDay; i++) {

            const empty =
                document.createElement("div");

            empty.className = "day empty";

            calendar.appendChild(empty);
        }

        const selected = await Storage.getDays();

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
                () => {

                    let days =
                        Storage.getDays();

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

                    Storage.saveDays(days);

                    this.render();
                }
            );

            calendar.appendChild(cell);
        }
    }
};

document.addEventListener(
    "DOMContentLoaded",
    () => {

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
            () => {

                Calendar.currentDate
                    .setMonth(
                        Calendar.currentDate.getMonth() - 1
                    );

                Calendar.render();
            };

        document.getElementById(
            "nextMonth"
        ).onclick =
            () => {

                Calendar.currentDate
                    .setMonth(
                        Calendar.currentDate.getMonth() + 1
                    );

                Calendar.render();
            };

        Calendar.render();
    }
);
