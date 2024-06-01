$(document).ready(function() {
    // Captura el evento de envío del formulario
    $('#Form').submit(function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional
        let heroId = $('#heroId').val(); // Obtiene el valor del input
        
        // Valida que el ID ingresado sea un número
        if (!$.isNumeric(heroId)) {
            alert('Por favor ingresa un número válido');
            return;
        }

        // Consulta la API de SuperHero con el ID proporcionado
        configRequest(heroId);
    });
    
    //aca tuve que recurrir a nuestro amigo ChatGpt para complemento en la explicación y desarrollo del ejercicio
    function configRequest(id) {
        $.ajax({
            url: `https://www.superheroapi.com/api.php/4905856019427443/${id}`,
            type: 'GET',
            success: function(data) {
                if (data.response === 'error') {
                    handleError();
                } else {
                    handleSuccess(data);
                }
            },
            error: function() {
                handleError();
            }
        });
    }

    function handleError() {
        alert('SuperHéroe no encontrado');
    }
// si la respuesta es éxitosa crea la cadena de HTML mosttandola información del hero consultado tambien nos data datos para pintar el grafico 
    function handleSuccess(hero) {
        let heroInfo = `
            <div class="card mb-4">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${hero.image.url}" class="img-fluid rounded-start" alt="Imagen SuperHeroe">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">Nombre: ${hero.name}</h5>
                            <p class="card-text"><strong>Conexiones:</strong> ${hero.connections['group-affiliation']}</p>
                            <p class="card-text"><strong>Publicado por:</strong> ${hero.biography.publisher}</p>
                            <p class="card-text"><strong>Ocupación:</strong> ${hero.work.occupation}</p>
                            <p class="card-text"><strong>Primera aparición:</strong> ${hero.biography['first-appearance']}</p>
                            <p class="card-text"><strong>Altura:</strong> ${hero.appearance.height.join(" / ")}</p>
                            <p class="card-text"><strong>Peso:</strong> ${hero.appearance.weight.join(" / ")}</p>
                            <p class="card-text"><strong>Alianzas:</strong> ${hero.biography.aliases.join(", ")}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#heroInfo').html(heroInfo);

        // Datos para el gráfico de pastel, configuración de los datos. 
        let stats = chartConfig(hero);

        let chart = new CanvasJS.Chart("chartContainer", stats);
        chart.render();
    }

    // Configuración del gráfico de pastel
    function chartConfig(hero) {
        return {
            animationEnabled: true,
            title: {
                text: `Estadísticas de poder de ${hero.name}`
            },
            data: [{
                type: "pie",
                startAngle: 240,
                yValueFormatString: "##0\"%\"",
                indexLabel: "{label} {y}",
                dataPoints: [
                    { y: parseInt(hero.powerstats.intelligence), label: "Inteligencia" },
                    { y: parseInt(hero.powerstats.strength), label: "Fuerza" },
                    { y: parseInt(hero.powerstats.speed), label: "Velocidad" },
                    { y: parseInt(hero.powerstats.durability), label: "Durabilidad" },
                    { y: parseInt(hero.powerstats.power), label: "Poder" },
                    { y: parseInt(hero.powerstats.combat), label: "Combate" }
                ]
            }]
        };
    }
});
