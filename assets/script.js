$(document).ready(function () {
    var uvindex;
    var weatherData;
    var cities = [];

    $("#search-button").on("click", function (e) {
        // console.log(e)
        e.preventDefault();
        var cityName = $("#search-value").val().trim();

        searchForecast(cityName);
        searchWeather(cityName);

        cities.push(cityName);

        renderButton();

        $(document).on("click", ".city-btn", btnDataCall);

        $("#search-value").val("");
    });


    function btnDataCall() {
        // console.log($(".city-btn"));
        var cityName = $(this).attr("cityName");
        searchForecast(cityName);
        searchWeather(cityName);
    };

    function searchWeather(cityName) {
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=92f752c6db223987cf5c4bb3937d6b85&units=imperial",
            dataType: "json",
            success: function (data) {
                weatherData = data;
                // console.log(weatherData);

                lat = data.coord.lat;
                lon = data.coord.lon;
                searchUv(lat, lon);
                //Create a history link for the search (Look up .push()) (this is used to set items to local storage)
                localStorage.push(cityName);
            }
        });
    }

    //function to get UV index
    function searchUv(lat, lon) {
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=92f752c6db223987cf5c4bb3937d6b85",
            dataType: "json",
            success: function (data) {
                uvindex = data.value;

                // console.log(data);

                $("#today").empty()

                // console.log("weatherData: ", weatherData);
                var todaysDate = moment().format('l');
                // console.log(todaysDate);

                var title = $("<h3>").addClass("card-title").text(weatherData.name);
                var card = $("<div>").addClass("daily");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + (weatherData.wind.speed).toFixed(1) + " MPH");
                var humidity = $("<p>").addClass("card-text").text("Humidity: " + weatherData.main.humidity + "%");
                var temp = $("<p>").addClass("card-text").text("Temperature: " + (weatherData.main.temp).toFixed(1) + " \u00B0F");
                var icon = $("<img src=http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png>");
                // console.log(uvindex);
                var uv = $("<p>").addClass("card-text").text("UV Index: " + uvindex);
                var cardBody = $("<div>").addClass("card-body");

                cardBody.append(title, todaysDate, icon, wind, humidity, temp, uv);
                card.append(cardBody);
                $("#today").append(card);

                // create div to hold cities
                cityDiv = $("<div class='city'>");
                $("#city-view").prepend(cityDiv);


                // console.log("uv: ", data);
            }
        });
        // console.log("searchUv exit");
    }

    //function to get the 5 day forcast
    function searchForecast(cityName) {
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=92f752c6db223987cf5c4bb3937d6b85&units=imperial",
            dataType: "json",
            success: function (data) {
                // console.log(data)
                // use a forloop to loop over all forcast (by specs)
                $("#weekView").empty();
                $(".header").empty()

                var fiveDay = $("<h4>").addClass("5DayHeader").text("5-Day Forecast: ")
                $(".header").append(fiveDay);

                for (i = 2; i < 40; i = i + 8) {

                    var date = new Date(data.list[i].dt_txt);

                    // console.log("this is first date: ", date);

                    var day = date.getDate();
                    var month = (date.getMonth() + 1);
                    var year = date.getFullYear();

                    // console.log("this is  day: ", day);
                    // console.log("this is  month: ", month);
                    // console.log("this is year", year);

                    // creating a card for appending weather data
                    var title = $("<h3>").addClass("card-title").text(month + "/" + day + "/" + year);
                    var card = $("<div>").addClass("weekly");
                    var temp = $("<p>").addClass("card-text").text("Temperature: " + (data.list[i].main.temp).toFixed(1) + " \u00B0F");
                    var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var icon = $("<img src=http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png>");

                    var cardBody = $("<div>").addClass("card-body");

                    cardBody.append(title, icon, humidity, temp);
                    card.append(cardBody);
                    $("#weekView").append(card);
                }
            }
        });
    }

    function renderButton() {
        // deleting previous cities
        $("#city-view").empty();
        // creating for loop to make city buttons
        for (i = 0; i < cities.length; i++) {

            var a = $("<button>");
            a.addClass("city-btn");
            a.attr("cityName", cities[i]);
            a.text(cities[i]);
            $("#city-view").append(a);

        }
    };



    // get curretn search history, if there is any

    //print out search history


});