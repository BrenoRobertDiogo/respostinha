// Axios para scraping
const axios = require('axios').default;
// Cheerio para interpretar o html
var cheerio = require('cheerio');
// Express para criar a API
const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')
app.use(cors())

async function main(frase) {
    console.log('=================================================\n=================================================');
    URL_SITE = "https://brainly.com.br/"
    URL_TAREFA = URL_SITE + "tarefa/"
    URL_FIND = "https://brainly.com.br/app/ask?entry=hero&q=" + frase
    URL_API = "https://brainly.com.br/graphql/pt"

    dataFilter = [{
        "operationName": "SearchQuery",
        "variables": {
            "query": "Neymar",
            "after": null,
            "first": 10
        },
        "query": "query SearchQuery($query: String!, $first: Int!, $after: ID) {\n  questionSearch(query: $query, first: $first, after: $after) {\n    count\n    edges {\n      node {\n        id\n        databaseId\n        author {\n          id\n          databaseId\n          isDeleted\n          nick\n          avatar {\n            thumbnailUrl\n            __typename\n          }\n          rank {\n            name\n            __typename\n          }\n          __typename\n        }\n        content\n        answers {\n          nodes {\n            thanksCount\n            ratesCount\n            rating\n            __typename\n          }\n          hasVerified\n          __typename\n        }\n        __typename\n      }\n      highlight {\n        contentFragments\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
    }]

    dataFilter[0].variables.query = frase
    let response = await axios({
        url: URL_API,
        method: 'post',
        data: dataFilter
    })

    resp = response.data[0].data.questionSearch.edges
    let listaUrlTarefas = resp.map(variavel => URL_TAREFA + variavel.node.databaseId)

    var final = []
    for (let i = 0; i < listaUrlTarefas.length; i++) {
        var respostaURL = await axios.get(listaUrlTarefas[i])

        const $ = cheerio.load(respostaURL.data);
        $('div.brn-qpage-next-answer-box__content > div > div > div').map(async (_i, element) => {
            const cheerioElement = $(element);
            final.push($(cheerioElement).text());
        })
    }
    return final
}


app.get('/', (req, res) => {
    res.send('')

})

app.get('/perguntar/:pergunta', async function (req, res) {
    
    res.setHeader('Content-Type', 'application/json');
    
    res.type('json')


    var pergunta = req.params.pergunta;
    let valor = await main(pergunta)
    // Quais as 4 ideias (ou leis) da teoria de Lamarck ? Explique cada um
    console.log(valor);
    res.send(valor)

});

app.listen(port, () => {
    console.log(`Página principal:  http://localhost:${port}`)
    console.log(`Página para perguntas:  http://localhost:${port}/perguntar/`)
})
