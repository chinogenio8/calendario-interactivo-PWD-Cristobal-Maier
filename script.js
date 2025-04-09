document.addEventListener('DOMContentLoaded', function () {
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // Variables globales
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();
    let selectedDate = null;
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

    // Referencias a elementos DOM
    const datesContainer = document.getElementById('dates');
    const monthDisplay = document.getElementById('month');
    const yearDisplay = document.getElementById('year');
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const eventDateInput = document.getElementById('event-date');
    const eventTitleInput = document.getElementById('event-title');
    const saveEventBtn = document.getElementById('save-event');
    const deleteEventBtn = document.getElementById('delete-event');

    // Inicializar el calendario
    function initCalendar() {
        renderCalendar();
        setupEventListeners();
    }

    // Renderizar el calendario
    function renderCalendar() {
        datesContainer.innerHTML = '';
        monthDisplay.textContent = monthNames[currentMonth];
        yearDisplay.textContent = currentYear;

        // Obtener el primer día del mes y el total de días
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Ajustar el primer día (0 es domingo, 1 es lunes)
        const startingDay = firstDay === 0 ? 6 : firstDay - 1;
        
        // Crear los espacios vacíos iniciales
        for (let i = 0; i < startingDay; i++) {
            const dateElement = document.createElement('div');
            dateElement.classList.add('calendar__date', 'empty');
            datesContainer.appendChild(dateElement);
        }
        
        // Crear los días del mes
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dateElement = document.createElement('div');
            dateElement.classList.add('calendar__date');
            
            const dateNumber = document.createElement('span');
            dateNumber.textContent = i;
            dateElement.appendChild(dateNumber);
            
            // Verificar si es el día actual
            if (
                currentYear === today.getFullYear() &&
                currentMonth === today.getMonth() &&
                i === today.getDate()
            ) {
                dateElement.classList.add('today');
            }
            
            // Verificar si es fin de semana
            const date = new Date(currentYear, currentMonth, i);
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 6 || dayOfWeek === 0) {
                dateElement.classList.add('weekend');
            }
            
            // Verificar si es feriado
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const monthDay = `${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            // Lista de feriados nacionales en Argentina
            const feriados = {
                '01-01': 'Año Nuevo',
                '05-01': 'Día del Trabajador',
                '05-25': 'Día de la Revolución de Mayo',
                '07-09': 'Día de la Independencia',
                '12-25': 'Navidad'
            };
            
            if (feriados[monthDay]) {
                dateElement.classList.add('holiday');
                const holidayText = document.createElement('div');
                holidayText.classList.add('holiday-text');
                holidayText.textContent = feriados[monthDay];
                dateElement.appendChild(holidayText);
            }
            
            // Verificar si hay eventos en esta fecha
            if (events[dateStr]) {
                dateElement.classList.add('has-event');
            }
            
            // Verificar si es la fecha seleccionada
            if (
                selectedDate &&
                currentYear === selectedDate.getFullYear() &&
                currentMonth === selectedDate.getMonth() &&
                i === selectedDate.getDate()
            ) {
                dateElement.classList.add('active');
            }
            
            // Añadir atributo de datos para el día
            dateElement.dataset.date = dateStr;
            
            // Añadir evento click a cada día
            dateElement.addEventListener('click', function() {
                selectDate(dateStr);
            });
            
            datesContainer.appendChild(dateElement);
        }
        
        // Añadir efectos visuales aleatorios a los días
        addVisualEffects();
    }

    // Añadir efectos visuales aleatorios a los días
    function addVisualEffects() {
        const dateElements = document.querySelectorAll('.calendar__date:not(.empty)');
        dateElements.forEach((el, index) => {
            // Crear variedad visual con colores sutiles

            
            
        });
    }

    // Configurar los event listeners
    function setupEventListeners() {
        prevBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
        
        nextBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
        
        saveEventBtn.addEventListener('click', saveEvent);
        deleteEventBtn.addEventListener('click', deleteEvent);
    }

    // Seleccionar una fecha
    function selectDate(dateStr) {
        // Remover clase active de todos los días
        const allDates = document.querySelectorAll('.calendar__date');
        allDates.forEach(date => date.classList.remove('active'));
        
        // Añadir clase active a la fecha seleccionada
        const selectedElement = document.querySelector(`.calendar__date[data-date="${dateStr}"]`);
        if (selectedElement) {
            selectedElement.classList.add('active');
        }
        
        // Actualizar fecha seleccionada
        const [year, month, day] = dateStr.split('-').map(Number);
        selectedDate = new Date(year, month - 1, day);
        
        // Actualizar el input de fecha
        eventDateInput.value = dateStr;
        
        // Verificar si hay eventos y mostrar/ocultar botón eliminar
        if (events[dateStr]) {
            eventTitleInput.value = events[dateStr];
            deleteEventBtn.style.display = 'block';
        } else {
            eventTitleInput.value = '';
            deleteEventBtn.style.display = 'none';
        }
        
        // Animación divertida al seleccionar una fecha
        if (selectedElement) {
            selectedElement.style.animation = 'bounce 0.5s';
            setTimeout(() => {
                selectedElement.style.animation = '';
            }, 500);
        }
    }

    // Guardar un evento
    function saveEvent() {
        const dateStr = eventDateInput.value;
        const title = eventTitleInput.value.trim();
        
        if (!dateStr || !title) {
            // Animación de sacudida si falta información
            eventDateInput.style.animation = title ? '' : 'shake 0.5s';
            eventTitleInput.style.animation = dateStr ? '' : 'shake 0.5s';
            
            setTimeout(() => {
                eventDateInput.style.animation = '';
                eventTitleInput.style.animation = '';
            }, 500);
            return;
        }
        
        // Guardar evento
        events[dateStr] = title;
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        
        // Actualizar calendario
        renderCalendar();
        
        // Reiniciar formulario
        eventTitleInput.value = '';
        deleteEventBtn.style.display = 'block';
        
        // Mensaje de confirmación con animación
        const eventForm = document.querySelector('.event-form');
        const confirmMessage = document.createElement('div');
        confirmMessage.textContent = '¡Evento guardado!';
        confirmMessage.style.backgroundColor = '#98CE00';
        confirmMessage.style.color = 'white';
        confirmMessage.style.padding = '10px';
        confirmMessage.style.borderRadius = '10px';
        confirmMessage.style.textAlign = 'center';
        confirmMessage.style.marginTop = '10px';
        confirmMessage.style.fontWeight = 'bold';
        confirmMessage.style.opacity = '0';
        confirmMessage.style.transition = 'opacity 0.5s';
        
        eventForm.appendChild(confirmMessage);
        setTimeout(() => {
            confirmMessage.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            confirmMessage.style.opacity = '0';
            setTimeout(() => {
                confirmMessage.remove();
            }, 500);
        }, 2000);
    }

    // Eliminar un evento
    function deleteEvent() {
        const dateStr = eventDateInput.value;
        
        if (dateStr && events[dateStr]) {
            delete events[dateStr];
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            
            // Actualizar calendario
            renderCalendar();
            
            // Reiniciar formulario
            eventTitleInput.value = '';
            deleteEventBtn.style.display = 'none';
            
            // Mensaje de confirmación
            const eventForm = document.querySelector('.event-form');
            const confirmMessage = document.createElement('div');
            confirmMessage.textContent = '¡Evento eliminado!';
            confirmMessage.style.backgroundColor = '#FF5252';
            confirmMessage.style.color = 'white';
            confirmMessage.style.padding = '10px';
            confirmMessage.style.borderRadius = '10px';
            confirmMessage.style.textAlign = 'center';
            confirmMessage.style.marginTop = '10px';
            confirmMessage.style.fontWeight = 'bold';
            confirmMessage.style.opacity = '0';
            confirmMessage.style.transition = 'opacity 0.5s';
            
            eventForm.appendChild(confirmMessage);
            setTimeout(() => {
                confirmMessage.style.opacity = '1';
            }, 10);
            
            setTimeout(() => {
                confirmMessage.style.opacity = '0';
                setTimeout(() => {
                    confirmMessage.remove();
                }, 500);
            }, 2000);
        }
    }
    // Inicializar
    initCalendar();
});