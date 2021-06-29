fetch('http://localhost:8080/api/v1/getLatestH2')
  .then(response => response.json())
  .then(data => {

    var voltaeChart = document.getElementById('voltageChart').getContext('2d');
    var usageChart = document.getElementById('usageChart').getContext('2d');
    var bespaart = document.getElementById('bespaart');


    var time = [];
    var voltage = [];
    var usage = [];
    var delivery = []


    for (reading of data) {
        var date = new Date(reading.CurrentTime);

        time[time.length] = `${date.getUTCHours()+2}:${("0" +date.getMinutes()).slice(-2)}`;
        voltage[time.length] = reading.CurrentVoltage1;
        usage[time.length] = reading.CurrentUsage;
        delivery[time.length] = reading.Currentdelivery;
        

    }

    var totalUsage = 0;

    delivery.forEach(del => {
        totalUsage -= del;
    });

    usage.forEach(us => {
        totalUsage += us
    });

    totalUsage = totalUsage/time.length; //gets average

    totalUsage = (totalUsage * 0.22);// naar 22 cent per kwh

    var amountSpentOnPower = (Math.round(100 *totalUsage)/100) * 2; //in cents over 2 hours


    bespaart.innerText = `Over de afgelopen 2 uur uigegeven aan stroom: €${amountSpentOnPower}`

    
    new Chart(voltaeChart, {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                label: 'voltage',
                backgroundColor: 'rgb(255,255,153)',
                borderColor: 'rgb(153,153,0)',
                data: voltage
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        min: 220,
                        max: 245,
                        callback: function(value, index, values) {
                            return 'V' + value;
                        }
                    }
                }]
            }
        }
    });
    new Chart(usageChart, {
        type: 'bar',
        data: {
            labels: time,
            datasets: [{
                barPercentage: 1,
                label: 'usage',
                backgroundColor: 'rgb(255,0,0)',
                borderColor: 'rgb(0,0,0)',
                data: usage
            },
            {
                label: 'delivery',
                backgroundColor: 'rgb(0,255,0)',
                borderColor: 'rgb(0,0,0)',
                data: delivery
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        callback: function(value, index, values) {
                            return 'KW ' + value;
                        }
                    }
                }],
                xAxes:[{
                    
                }]
            }
        }
    });
});


fetch('http://localhost:8080/api/v1/getTemp')
    .then(response => response.json())
    .then(data => {
        document.getElementById('temp').innerText = `Temperatuur: ${data[0].temperature}°C` ;
        document.getElementById('hum').innerText = `Lucht vochtigheid: ${data[0].humidity}%`;
});