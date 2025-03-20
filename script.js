// Nombres de los meses para mostrar en el calendario
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
    "Octubre", "Noviembre", "Diciembre"];

// Contenedor donde se mostrarán los días del mes
const datesContainer = document.getElementById("dates");
const monthElement = document.getElementById("month");
const yearElement = document.getElementById("year");
const eventDateInput = document.getElementById("event-date");
const eventTitleInput = document.getElementById("event-title");
const saveEventButton = document.getElementById("save-event");
const deleteEventButton = document.createElement("button");

// Botón para eliminar un evento
deleteEventButton.id = "delete-event";
deleteEventButton.textContent = "Eliminar Evento";
deleteEventButton.style.display = "none";
deleteEventButton.style.marginLeft = "10px";
document.querySelector(".event-form").appendChild(deleteEventButton);

// Obtener el mes y año actuales
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let today = new Date(); // Obtener la fecha actual
let events = JSON.parse(localStorage.getItem("events")) || {};

// Lista de feriados nacionales en Argentina (Formato: "MM-DD")
const feriadosArgentina = {
    "01-01": "Año Nuevo",
    "02-12": "Carnaval",
    "02-13": "Carnaval",
    "03-24": "Día de la Memoria",
    "04-02": "Día del Veterano y Caídos en Malvinas",
    "05-01": "Día del Trabajador",
    "05-25": "Día de la Revolución de Mayo",
    "06-20": "Día de la Bandera",
    "07-09": "Día de la Independencia",
    "08-17": "Paso a la Inmortalidad de San Martín",
    "10-12": "Día del Respeto a la Diversidad Cultural",
    "11-20": "Día de la Soberanía Nacional",
    "12-08": "Inmaculada Concepción",
    "12-25": "Navidad"
};

// Función para determinar si el año es bisiesto
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Función para cargar el calendario
function loadCalendar(month = currentMonth, year = currentYear) {
    datesContainer.innerHTML = "";
    monthElement.textContent = monthNames[month];
    yearElement.textContent = year;

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1; // Ajuste para que la semana empiece en lunes

    // Obtener el número de días del mes
    let totalDays = new Date(year, month + 1, 0).getDate();
    if (month === 1 && isLeapYear(year)) {
        totalDays = 29;
    }

    // Agregar días en blanco antes del primer día del mes
    for (let i = 0; i < firstDay; i++) {
        let emptyDay = document.createElement("div");
        emptyDay.classList.add("day", "empty");
        datesContainer.appendChild(emptyDay);
    }

    for (let i = 1; i <= totalDays; i++) {
        let day = document.createElement("div");
        day.classList.add("day");
        day.textContent = i;

        let dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        let holidayKey = `${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

        // Resaltar el día actual
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            day.classList.add("today");
        }

        // Verificar si el día es un feriado
        if (feriadosArgentina[holidayKey]) {
            day.classList.add("holiday");
            let holidayText = document.createElement("div");
            holidayText.classList.add("holiday-text");
            holidayText.textContent = feriadosArgentina[holidayKey];
            day.appendChild(holidayText);
        }

        // Si el día es fin de semana y también un feriado, debe mostrar el color del feriado, no del fin de semana
        let dayOfWeek = new Date(year, month, i).getDay(); // 0 = domingo, 6 = sábado
        if ((dayOfWeek === 6 || dayOfWeek === 0) && !feriadosArgentina[holidayKey]) {
            day.classList.add("weekend"); // Si es fin de semana y no feriado, aplica el color de fin de semana
        }

        if (events[dateKey]) {
            let eventDiv = document.createElement("div");
            eventDiv.classList.add("event");
            eventDiv.textContent = events[dateKey];
            day.appendChild(eventDiv);
        }

        day.addEventListener("click", () => {
            eventDateInput.value = dateKey;
            eventTitleInput.value = events[dateKey] || "";
            deleteEventButton.style.display = events[dateKey] ? "inline-block" : "none";
        });

        datesContainer.appendChild(day);
    }
}

// Evento para guardar un evento
saveEventButton.addEventListener("click", () => {
    let date = eventDateInput.value;
    let title = eventTitleInput.value.trim();
    if (!date || !title) return;

    events[date] = title;
    localStorage.setItem("events", JSON.stringify(events));
    loadCalendar();
    deleteEventButton.style.display = "inline-block";
});

// Evento para eliminar un evento
deleteEventButton.addEventListener("click", () => {
    let date = eventDateInput.value;
    if (events[date]) {
        delete events[date];
        localStorage.setItem("events", JSON.stringify(events));
        loadCalendar();
        eventTitleInput.value = "";
        deleteEventButton.style.display = "none";
    }
});

// Para cambiar al mes anterior
document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar(currentMonth, currentYear);
});

// Para cambiar al mes siguiente
document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar(currentMonth, currentYear);
});

// Inicializar el calendario al cargar la página
loadCalendar();
