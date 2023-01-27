const apiKey = "ab097d0f7acfc9757a154074bb621751";
const urlCountryApi = "https://countryflagsapi.com/png/";
const acessKeyUnsplash = "Sw7fR01eMBnOyVuSHshyV0NymRPZne4vvZdpycVOIPo";
const secretKeyUnsplash = "sD2juB4iSE_ZY7Njc36heHnKSbCzCP3_q_3fW8iePqw";

const cityInput = document.querySelector("#city-input");

const searchButton = document.querySelector(".magn");

//  Selecionando os elementos dinamicos
const cidade = document.querySelector("#cidade");
const temperatura = document.querySelector("#temp");
const bandeira = document.querySelector("#bandeira");
const descricao = document.querySelector("#descricao");
const iconeClima = document.querySelector("#icone-clima");
const humidade = document.querySelector("#humidade");
const velocidade = document.querySelector("#velocidade");
const form = document.querySelector(".form");

//  Apanhando a latitude e a longitude
async function apanharDados(city) {
    //  Url de api de chamada para pegar lon e lat e name
    let urlApi = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&lang=pt&appid=${apiKey}`;

    //  Fazendo o loading aparecer
    document.querySelector(".load").classList.remove("hide");

    let response = await fetch(urlApi);

    let p = response
        .json()
        .then((obj) => obj)
        .then((obj) => {
            obj.map((o) => {
                console.log(o);
                cidade.innerText = o.name;

                //  Fazendo a chamanda dos dados
                let call = async () => {
                    let urlApi1 = `https://api.openweathermap.org/data/2.5/weather?lat=${o.lat}&lon=${o.lon}&lang=pt&appid=${apiKey}`;

                    let rsp = await fetch(urlApi1)
                        .then((ob) => ob.json())
                        .then((ob) => {
                            //  Atualizando os dados
                            bandeira.setAttribute("src", `https://countryflagsapi.com/png/${ob.sys.country}`);
                            ob.weather.map((v) => {
                                iconeClima.setAttribute("src", `http://openweathermap.org/img/wn/${v.icon}.png`);
                                descricao.innerText = v.description;
                            });
                            humidade.innerText = `${ob.main.humidity}%`;
                            velocidade.innerText = `${ob.wind.speed}Km/h`;

                            //  Convertendo a temperatura de Kelvin para Celsius
                            temperatura.innerText = Math.round((273 - Number(ob.main.temp)) * -1);
                            document.querySelector(".principal").classList.remove("hide");
                            document.querySelector("#icone-ui").classList.add("hide");
                            document.querySelector(".load").classList.add("hide");
                        });
                };
                call();

                let trocaFundo = async () => {
                    let urlApi2 = `https://api.unsplash.com/search/collections?page=1&query=${cidade.innerText}&client_id=${acessKeyUnsplash}`;

                    let respo = await fetch(urlApi2)
                        .then((val) => val.json())
                        .then((val) => {
                            console.log(val.total);
                            if (val.total == 0) {
                                console.log("nao encontrei uma imagem para esse fundo");
                            } else {
                                console.log(val);
                                document.querySelector("body").setAttribute(
                                    "style",
                                    `background-image: url("${val.results[0].cover_photo.urls.full}");
                                    background-size: cover;`
                                );
                            }
                            /* */
                        })
                        .catch("Ops, não achei nenuma imagem");
                };
                trocaFundo();
            });
        });
}

//  Adicionando o evento de click
searchButton.addEventListener("click", () => {
    document.querySelector(".principal").classList.add("hide");
    document.querySelector("#icone-ui").classList.add("hide");
    let city = cityInput.value;
    cityInput.value = "";
    document.querySelector(".load").classList.add("hide");
    apanharDados(city);
});

//  Adicionando o evento de enter
form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".principal").classList.add("hide");
    document.querySelector("#icone-ui").classList.add("hide");
    let city = cityInput.value;
    cityInput.value = "";
    document.querySelector(".load").classList.add("hide");
    apanharDados(city);
});
