const months = document.getElementById('months')
const days = document.getElementById('days')
const meaning = document.getElementsByClassName('square')

// Получаем данные
async function getData() {
    try {
        const response = await fetch('https://dpg.gg/test/calendar.json')
        const data = await response.json()
        return Object.entries(data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

// Определяем цвет ячеек
function getColor(count) {
    if (count === 0) return '#EDEDED'
    else if (count <= 9) return '#ACD5F2' 
    else if (count <= 19) return '#7FA8C9'
    else if (count <= 29) return '#527BA0' 
    else return '#254E77'
}

//Создаем таблицу
async function createTable() {
    const data = await getData() 

    const immutableDate = new Date()
    const date = immutableDate

    const monthsObj = {
        0: 'Янв.',
        1: 'Фев.',
        2: 'Март',
        3: 'Апр.',
        4: 'Май',
        5: 'Июнь',
        6: 'Июль',
        7: 'Авг.',
        8: 'Сент.',
        9: 'Окт.',
        10: 'Нояб.',
        11: 'Дек.'
    }
    
    const weekdaysObj = {
        2: 'Понедельник',
        3: 'Вторник',
        4: 'Среда',
        5: 'Четверг',
        6: 'Пятница',
        7: 'Суббота',
        1: 'Воскресенье'
    }
    
    let datesArray = new Array(357).fill({}).map(item => {
        const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
        const foundDate = data.find(day => day[0] === dateString)
        const weekday = date.getDay() + 1
        const dateInRU = `${weekdaysObj[date.getDay() + 1]}, ${monthsObj[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
        
        date.setDate(date.getDate() - 1)
        return {
            weekday: weekday,
            dateString: dateString,
            dateInRU: dateInRU,
            contributions: foundDate ? foundDate[1] : 0
        }
    }).reverse()

    if (immutableDate.getDay() < 6) {
        const toBeAdded = new Array(6 - immutableDate.getDay()).fill({}).map((item, index) => {
            return {
                weekday: index + 3,
                dateString: '',
                dateInRU: '',
                contributions: 0
            }
        })

        datesArray = [...datesArray, ...toBeAdded]
            .slice(6 - immutableDate.getDay())
            .map(item => {
                if (item.weekday === 1) {
                    item.weekday = 7
                } else {
                    item.weekday = item.weekday - 1
                }
                return item
            })
            .sort((a, b) => a.weekday - b.weekday)
    }

    let datesArrayHTML = datesArray.map((day, index) => {
        return `<div 
            id=${index}
            class='square tooltip' 
            style='background: ${getColor(day.contributions)};'
            data-cont='${day.contributions} contributions'
            data-date='${day.dateInRU}'
        ><span class='tooltiptext'><h4>${day.contributions} contribution${day.contributions > 0 ? 's' : ''}</h4><p>${day.dateInRU}</p></span></div>`
    }).join('')

    const currentMonth = immutableDate.getMonth()
    const monthArray = new Array(12).fill(0).map((month, index) => {
        return monthsObj[currentMonth-index]
    }).reverse()

    const monthArrayHTML = monthArray.map(month => {
        return `<span>${month}</span>`
    }).join('')


    days.innerHTML = datesArrayHTML
    months.innerHTML = monthArrayHTML

}


createTable()