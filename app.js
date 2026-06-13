const API_URL = "https://little-sun-5fcd.legendarynyashus.workers.dev";

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

        localStorage.setItem(
            "username",
            name.trim()
        );
    }

    return name;
},

changeName() {

    const name =
        prompt("Введите новое имя");

    if (
        name &&
        name.trim()
    ) {

        localStorage.setItem(
            "username",
            name.trim()
        );

        location.reload();
    }
}

};

// =====================
// STORAGE
// =====================

const Storage = {

async getAll() {

    try {

        const response =
            await fetch(
                API_URL + "/get"
            );

        return await response.json();

    } catch (err) {

        console.error(
            "Ошибка загрузки:",
            err
        );

        return {};
    }
},

async saveAll(data) {

    try {

        await fetch(
            API_URL + "/set",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body:
                    JSON.stringify(data)
            }
        );

    } catch (err) {

        console.error(
            "Ошибка сохранения:",
            err
        );
    }
},

async getDays() {

    const data =
        await this.getAll();

    const user =
        Auth.getName();

    return (
        data[user]?.days || []
    );
},

async saveDays(days) {

    const data =
        await this.getAll();

    const user =
        Auth.getName();

    if (!data[user]) {

        data[user] = {
            days: []
        };
    }

    data[user].days = days;

    await this.saveAll(data);
}

};

// =====================
// CALENDAR
// =====================

const Calendar = {

currentDate:
    new Date(),

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
        document.getElementById(
            "calendar"
        );

    calendar.innerHTML = "";

    const year =
        this.currentDate
            .getFullYear();

    const month =
        this.currentDate
            .getMonth();

    document.getElementById(
        "monthTitle"
    ).textContent =
        `${this.monthNames[month]} ${year}`;

    const firstDay =
        new Date(
            year,
            month,
            1
        );

    let startDay =
        firstDay.getDay();

    startDay =
        startDay === 0
            ? 6
            : startDay - 1;

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    const selected =
        await Storage.getDays();

    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "day empty";

        calendar.appendChild(
            empty
        );
    }

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateKey =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const cell =
            document.createElement(
                "div"
            );

        cell.className =
            "day";

        if (
            selected.includes(
                dateKey
            )
        ) {
            cell.classList.add(
                "free"
            );
        }

        cell.textContent =
            day;

        cell.addEventListener(
            "click",
            async () => {

                let days =
                    await Storage.getDays();

                if (
                    days.includes(
                        dateKey
                    )
                ) {

                    days =
                        days.filter(
                            d =>
                                d !==
                                dateKey
                        );

                } else {

                    days.push(
                        dateKey
                    );
                }

                await Storage.saveDays(
                    days
                );

                await this.render();
            }
        );

        calendar.appendChild(
            cell
        );
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
        "👤 " +
        Auth.getName();

    document.getElementById(
        "changeNameBtn"
    ).onclick =
        () =>
            Auth.changeName();

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
