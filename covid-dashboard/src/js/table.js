let checkCountry = false;
let checkTotal = document.querySelector('.total');
let checkPer100 = document.querySelector('.per100K');
let global1;
let population;
let listItem;
let country = {}
const codeCountries = [];

function showNumbers(numbers, checkTotal, checkPer, popul, bool) {
    if (!checkTotal && !checkPer) {
        setNumbers(numbers.TotalConfirmed, numbers.TotalDeaths, numbers.TotalRecovered, bool);
    } else if(checkTotal && !checkPer){
        setNumbers(numbers.NewConfirmed, numbers.NewDeaths, numbers.NewRecovered, bool);
    } else if(!checkTotal && checkPer){
        setNumbers(+(numbers.TotalConfirmed*100000/popul).toFixed(2), +(numbers.TotalDeaths*100000/popul).toFixed(2), +(numbers.TotalRecovered*100000/popul).toFixed(2), bool);
    } else {
        setNumbers(+(numbers.NewConfirmed*100000/popul).toFixed(2), +(numbers.NewDeaths*100000/popul).toFixed(2), +(numbers.NewRecovered*100000/popul).toFixed(2), bool);        
    }  
}

function setNumbers(num1, num2, num3, bool) {    
    if (bool) {
        document.getElementById("country__cases").innerHTML = num1;
        document.getElementById("country__deaths").innerHTML = num2;
        document.getElementById("country__recovered").innerHTML = num3; 
    } else {
        document.getElementById("cases").innerHTML = num1;
        document.getElementById("deaths").innerHTML = num2;
        document.getElementById("recovered").innerHTML = num3;
    }   
}

const fetchPopulation = async () => {
    population = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;alpha2Code').then(res => res.json());                 
}  

const globalCases = async () => {
    global1 = await fetch ("https://api.covid19api.com/summary")
        .then((res) => res.json())
        .then((res) => {
            showNumbers(res.Global, checkTotal.checked, checkPer100.checked, 7827000000, false);
            console.log(res);
            res.Countries.forEach((el) => {
                const a = {
                    country: el.Country,
                    code: el.CountryCode
                }
                codeCountries.push(JSON.parse(JSON.stringify(a)))
            })
        })
}

const countryCases = async () => {
    global1 = await fetch ("https://api.covid19api.com/summary")
        .then((res) => res.json())        
}

checkTotal.addEventListener('change', () => {      
    if (checkCountry) showNumbers(country, checkTotal.checked, checkPer100.checked, country.population, true);
    globalCases();
    
})

checkPer100.addEventListener('change', () => {    
    if (checkCountry) showNumbers(country, checkTotal.checked, checkPer100.checked, country.population, true);
    globalCases();
})

const findCountry = async (name) => {
    checkCountry = true;
    let code; 
    codeCountries.forEach((el) => {
        if (el.country === name) code = el.code;
    })
    await fetchPopulation();
    population.forEach(element  => {
        if (element.alpha2Code === code) {
            country.name = name;
            country.population = element.population;
        }
    });
   await countryCases();
   global1.Countries.forEach(element => {
    if (element.Country === name) {
        country.TotalConfirmed = element.TotalConfirmed;
        country.TotalDeaths = element.TotalDeaths;
        country.TotalRecovered = element.TotalRecovered;
        country.NewConfirmed = element.NewConfirmed;
        country.NewDeaths = element.NewDeaths;
        country.NewRecovered = element.NewRecovered;
    }
    showNumbers(country, checkTotal.checked, checkPer100.checked, country.population, true);
   });
}
 
document.addEventListener('click', (e) => {
    if (e.target.className === 'list__li' || e.target.parentElement.className === 'list__li') {
        const name = e.target.children[1] ? e.target.children[1].innerText : e.target.parentElement.children[1].innerText;
        document.querySelector('.country__td').innerHTML = `${name}`;
        findCountry(name);
        const active = e.target.children[1] ? e.target : e.target.parentElement;
        active.parentElement.childNodes.forEach((el) => {
            if (el.classList.contains('active')) el.classList.remove('active')
        })
        active.classList.add('active');
    }
})

globalCases();
