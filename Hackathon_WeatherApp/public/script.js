function getWeather() {
    let city = document.getElementById('city').value;
    let keyAPI = '&APPID=767a7cce68ed2b3098d41e24364ec56c';
    let urlAPI = `http://api.openweathermap.org/data/2.5/weather?id=${city}${keyAPI}`;
    fetch(urlAPI)
        .then(response => response.json())
        .then(data => {
            let tempC = Math.floor(data.main.temp -273.15);
            console.log(data)
            let d = new Date();
            let day = d.getDate();
            let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let currentMonth = months[d.getMonth()];
            let year = d.getUTCFullYear();
            let cardWrapper = document.getElementById('cardWrapper');
            let name = document.createElement('h2');
            let currentDate = document.createElement('h4');
            let img = document.createElement('img');
            let description = document.createElement('h3');
            let temp = document.createElement('p');
            cardWrapper.innerHTML = '';
            name.innerText = data.name;
            img.classList.add('weatherIcon', 'src');
            img.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            currentDate.innerText = `${day}/${currentMonth}/${year}`;
            description.innerText = data.weather[0].description;
            temp.innerText = `${tempC}°C`;
            cardWrapper.appendChild(name);
            cardWrapper.appendChild(currentDate);
            cardWrapper.appendChild(img);
            cardWrapper.appendChild(description);
            cardWrapper.appendChild(temp);
        })
        .catch(err => {
            console.log('There has been a problem: ' + console.log(err));
        });
}