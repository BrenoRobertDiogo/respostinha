function acharResposta(pergunta) {
  document.querySelector('#coluninha').innerHTML = '<iframe src="https://giphy.com/embed/3oEjI6SIIHBdRxXI40" width="100%" height="100%" frameBorder="0"></iframe>'
  axios({
    method: 'get',
    url: 'http://localhost:3000/perguntar/' + pergunta.value,
    responseType: 'json'
  })
    .then(function (response) {
      // console.log(response.data);
      var resultadoData = response.data
      let tabela = document.querySelector('#coluninha')

      let adicionar = resultadoData.map( (item) => {
        // console.log(item);
        if (!(item.trim() == '')){
          return `
        <div class="column">
        <div class="card"><b>${item.trim()}</b></div>
        </div>
        `
        }else{
          return ''
        }
        
      } ).join('')
      adicionar += '<hr>'
      tabela.innerHTML = adicionar

    });
}

// acharResposta('Nesta Unidade de Aprendizagem, vimos que A ABNT - Associação Brasileira de Normas Técnicas – é um órgão que estabelece o padrão das normas a ser utilizado nos trabalhos acadêmicos. Essas normatizações são importantes tanto para o desenvolvimento da argumentação clara do autor quanto para a compreensão do leitor, possibilitando assim, a identificação das ideias que estão em jogo ao longo do texto, a forma como o autor se apropria dela e, até mesmo, estabelecer uma espécie de diálogo com os autores que são utilizados como referência.')