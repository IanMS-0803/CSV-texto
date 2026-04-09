
const fs = require('fs');

// Função que transoforma a tabela csv em um array de objects 
const conversor = (tabelaCSV) => {
    //separa a primeira linha que cotem os headers do resto do csv que contem os dados
    const [cabecalho, ...linhas] = tabelaCSV.split('\n');

    //transforma o string dos headers em um array e remove "_" substituindo por " "
    const titulos = cabecalho.split(",").map((i)=>{return i.split('_').join(' ')});

    //tansforma cada aluno(linha da tabela) em um array que contem as informções do aluno 
    const alunosDados = linhas.filter(linha => linha.trim() !== '')
                              .map((i) => i.split(","));

    //formata cada aluno para um object que possui campos definidos apartir dos headers da tabela csv
    const alunos = alunosDados.map((i) => preencherAluno(i,titulos));

    return alunos;
}

const preencherAluno = (linha, estrutura)=>{
    //cria o object aluno com campos vazios
    let aluno = {};

    //cria e preenche os campos com base na ordem dos headers
    for(let i = 0; i < linha.length; i++){
        // verifica se a linha[i] existe antes de dar split para evitar erros
        aluno[estrutura[i]] = linha[i] ? linha[i].split('"').join('') : '';
    }

    return aluno;
}

// Formatar e imprimir discente específico
const formatarDiscente = (aluno) => {
    let formato = '========================================\n';
    for (const [chave, valor] of Object.entries(aluno)) {
         formato += `${chave}: ${valor}\n`;
    }
    return formato;
}
const imprimirDiscente = (aluno) => {
    console.log(formatarDiscente(aluno));
}
// Salvar os dados em um arquivo de texto
const salvarDadosDisco = (alunos, nomeArquivoDestino) => {
    try {
        const stream = fs.createWriteStream(nomeArquivoDestino, { encoding: 'utf8' });

        stream.once('open', () => {
            alunos.forEach(aluno => {
                stream.write(formatarDiscente(aluno));
        });
        stream.end();
    });
    stream.on('finish', () => {
        console.log(`\nDados salvos no arquvio de texto: ${nomeArquivoDestino}`);
    });
} catch (erro) {
    console.log("Erro ao tentar salvar o arquivo: " + erro);
}
}

// Execução
const main = () => {
    const arquivoOrigem = "dis-csv-discentes-de-graduacao-de-2025_1.csv";
    const arquivoDestino = "relatorio_discentes_2025.txt";
    let csv;
    // Leitura
    try {
        csv = fs.readFileSync(arquivoOrigem, 'utf8').trim();
    } catch (erro) {
        console.log(`Erro ao tentar acessar o arquivo ${arquivoOrigem}: ` + erro);
        return;
    }
    const alunos = conversor(csv);
    if (alunos.length > 0) {
        console.log("Exemplo do primeiro discente da lista:\n");
        imprimirDiscente(alunos[0]);
    }
    salvarDadosDisco(alunos, arquivoDestino);
}
main();
        
