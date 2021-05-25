import Chart from 'chart.js';

const codeCountries = [];
const btnConfirmed = document.querySelector('.btnConfirmed');
const btnDeath = document.querySelector('.btnDeath');
const btnRecovered = document.querySelector('.btnRecovered');
const allData = [];
let global1;
const ctx1 = document.querySelector('#chart1').getContext('2d');
const ctx2 = document.querySelector('#chart2').getContext('2d');
const ctx3 = document.querySelector('#chart3').getContext('2d');

const dataCountry = {
    confirmed: 0,
    death: 0,
    recovered: 0,
    date: ''
};

covid_world_timeline.forEach((el) => {
    dataCountry.date = el.date;
    el.list.forEach((item) => {
        dataCountry.confirmed += item.confirmed;
        dataCountry.death += item.deaths;
        dataCountry.recovered += item.recovered;
    });
    allData.push(JSON.parse(JSON.stringify(dataCountry)));
    dataCountry.confirmed = 0;
    dataCountry.death = 0;
    dataCountry.recovered = 0;
});

const confirmed = allData.map((el) => el.confirmed);
const death = allData.map((el) => el.death);
const recovered = allData.map((el) => el.recovered);
const date = allData.map((el) => el.date);

function createGraph(type, res, ctx) {
    const densityData = {
        labels: date,
        datasets: [
            {
                label: `Global ${type}`,
                data: res,
                backgroundColor: 'red'
            }
        ]        
      };    
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: densityData
    });
}

createGraph('confirmed', confirmed, ctx1);
createGraph('recovered', recovered, ctx3);
createGraph('death', death, ctx2);
document.querySelector('#chart2').style.display = 'none';
document.querySelector('#chart3').style.display = 'none';

btnDeath.addEventListener('click', () => {
    document.querySelector('#chart2').style.display = 'block';
    document.querySelector('#chart3').style.display = 'none';
    document.querySelector('#chart1').style.display = 'none';
    btnDeath.classList.toggle('active');
    if (btnConfirmed.classList.contains('active')) {
        btnConfirmed.classList.toggle('active');
    }
    if (btnRecovered.classList.contains('active')) {
        btnRecovered.classList.toggle('active');
    }
})
btnRecovered.addEventListener('click', () => {
    document.querySelector('#chart3').style.display = 'block';
    document.querySelector('#chart2').style.display = 'none';
    document.querySelector('#chart1').style.display = 'none';
    btnRecovered.classList.toggle('active');
    if (btnConfirmed.classList.contains('active')) {
        btnConfirmed.classList.toggle('active');
    }
    if (btnDeath.classList.contains('active')) {
        btnDeath.classList.toggle('active');
    }
})

btnConfirmed.addEventListener('click', () => {
    document.querySelector('#chart1').style.display = 'block';
    document.querySelector('#chart3').style.display = 'none';
    document.querySelector('#chart2').style.display = 'none';
    btnConfirmed.classList.toggle('active');
    if (btnRecovered.classList.contains('active')) {
        btnRecovered.classList.toggle('active');
    }
    if (btnDeath.classList.contains('active')) {
        btnDeath.classList.toggle('active');
    }
})

const countries = async () => {
    global1 = await fetch ("https://api.covid19api.com/summary")
        .then((res) => res.json())
        .then((res) => {
            res.Countries.forEach((el) => {
                const a = {
                    country: el.Country,
                    code: el.CountryCode
                }
                codeCountries.push(JSON.parse(JSON.stringify(a)))
            })
        })
}
countries();

const findCodeCountry = async (name) => {
    let code; 
    const allDataCountry = [];
    codeCountries.forEach((el) => {
        if (el.country === name) code = el.code;
    })
    covid_world_timeline.forEach((el) => {
        dataCountry.date = el.date;
        el.list.forEach((item) => {
            if (code === item.id) {
                dataCountry.confirmed = item.confirmed;
                dataCountry.death = item.deaths;
                dataCountry.recovered = item.recovered;
            }            
        });
        allDataCountry.push(JSON.parse(JSON.stringify(dataCountry)));
        dataCountry.confirmed = 0;
        dataCountry.death = 0;
        dataCountry.recovered = 0;
    });
    const confirmed1 = allDataCountry.map((el) => el.confirmed);
    const death1 = allDataCountry.map((el) => el.death);
    const recovered1 = allDataCountry.map((el) => el.recovered);
    document.querySelector('#chart1').remove();
    document.querySelector('#chart2').remove();
    document.querySelector('#chart3').remove();
    const ctx1 = document.createElement('canvas');
    ctx1.id = 'chart1';
    ctx1.width = '200';
    ctx1.height  ='60'
    document.querySelector('.graphics').append(ctx1);
    const ctx2 = document.createElement('canvas');
    ctx2.id = 'chart2';
    ctx2.width = '200';
    ctx2.height  ='60'
    document.querySelector('.graphics').append(ctx2);
    const ctx3 = document.createElement('canvas');
    ctx3.id = 'chart3';
    ctx3.width = '200';
    ctx3.height  ='60'
    document.querySelector('.graphics').append(ctx3);
    

    createGraph('confirmed', confirmed1, ctx1.getContext('2d'));
    createGraph('recovered', recovered1, ctx3.getContext('2d'));
    createGraph('death', death1, ctx2.getContext('2d'));
    document.querySelector('#chart2').style.display = 'none';
    document.querySelector('#chart3').style.display = 'none';

}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('list__li') || e.target.parentElement.classList.contains('list__li')) {
        const name = e.target.children[1] ? e.target.children[1].innerText : e.target.parentElement.children[1].innerText;
        findCodeCountry(name);
    }
})