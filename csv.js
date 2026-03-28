const fs = require('fs');

const csv = fs.readFileSync("dis-csv-discentes-de-graduacao-de-2025_1.csv", 'utf8').trim();

// Função que transoforma a tabela csv em um array de objects 
const conversor = (tabelaCSV) => {
    //separa a primeira linha que cotem os headers do resto do csv que contem os dados
    const [cabecalho, ...linhas] = tabelaCSV.split('\n');

    //transforma o string dos headers em um array e remove "_" substituindo por " "
    const titulos = cabecalho.split(",").map((i)=>{return i.split('_').join(' ')});

    //tansforma cada aluno(linha da tabela) em um array que contem as informções do aluno 
    const alunosDados = linhas.map((i)=>{ return i.split(",")});

    //formata cada aluno para um object que possui campos definidos apartir dos headers da tabela csv
    const alunos = alunosDados.map((i) => preencherAluno(i,titulos));

    //apenas para testes - lembrar de remover depois
    console.log(alunos);
}

const preencherAluno = (linha, estrutura)=>{
    //cria o object aluno com campos vazios
    let aluno = {};

    //cria e preenche os campos com base na ordem dos headers
    for(let i = 0; i < linha.length; i++){
        aluno[estrutura[i]] = linha[i].split('"').join('');
    }

    return aluno;
}



conversor(csv);