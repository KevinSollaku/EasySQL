//obj{
//  campi[]:
//      nome,
//      lunghezza,
//      tipo
//  foreignKeys[]:
//      campo,
//      obj referenza{
//          campo,
//          tabella
//      }
//  nomeTabella
//}

function generaDomanda(difficolta) {

    const str1 = document.getElementById('table1').value;
    const str2 = document.getElementById('table2').value;
    const str3 = document.getElementById('table3').value;

    const tab1=dividiSQL(str1);
    const tab2=dividiSQL(str2);
    const tab3=dividiSQL(str3);
    console.log(tab1)
    if(difficolta=='facile')         document.getElementById('generatedQuestion').value= domandaFacile(tab1, tab2, tab3);
    else if(difficolta=='medio')     document.getElementById('generatedQuestion').value= domandaMedia(tab1, tab2, tab3);
    else if(difficolta=='difficile') document.getElementById('generatedQuestion').value= domandaDifficile(tab1, tab2, tab3);
    else document.getElementById('generatedQuestion').value= "sei hacker";


}

function dividiSQL(codiceSQL) {
    if (!codiceSQL) return;

    const sqlPulito = codiceSQL.replace(/\s+/g, ' ').trim();
    const indiceInizio = sqlPulito.indexOf('(');
    const indiceFine = sqlPulito.lastIndexOf(')');
    const dettagliTabella = sqlPulito.substring(indiceInizio + 1, indiceFine).trim();
    const righe = dettagliTabella.split(',');

    const infoTabella = {
        nomeTabella: sqlPulito.match(/CREATE TABLE (\w+)/)[1],
        campi: [],
        foreignKeys: []
    };

    const paroleProibite = ['UNIQUE', 'PRIMARY', 'FOREIGN', 'CHECK', 'DEFAULT'];

    //mi ammazzo
    righe.forEach(riga => {
        const [nomeCampo, tipoCampo, ...resto] = riga.trim().split(' ');

        if (!paroleProibite.some(parola => riga.includes(parola))){
            const l= tipoCampo.indexOf('(');
            const campo=tipoCampo[l+1];
            infoTabella.campi.push({ 
                nome: nomeCampo,
                lunghezza: l>0? campo:0,
                tipo: l>0? tipoCampo:tipoCampo.toUpperCase() 
            });
        } 
        else if(riga.includes('FOREIGN')){
            const indiceForeignKey = resto.indexOf('FOREIGN');
            const indiceReferences = resto.indexOf('REFERENCES');
            const campoForeignKey = resto[indiceForeignKey + 1].slice(1, -1);
            const [tabellaRiferimento, campoRiferimento] = resto.slice(indiceReferences + 1).join(' ').split('(').map(str => str.trim().replace(')', ''));

            infoTabella.foreignKeys.push({
                campo: campoForeignKey,
                riferimento: {
                    tabella: tabellaRiferimento,
                    campo: campoRiferimento
                }
            });
        }
    });

    return infoTabella;
}

function domandaFacile(t1, t2, t3){
    const vect = [t1, t2, t3].filter(Boolean);

    const p1=vect[rand(vect.length)];
    const p2=p1.campi[rand(p1.campi.length)];
    if(p2.tipo=='INT' || p2.tipo=='FLOAT' || p2.tipo=='DOUBLE'){
        let h=rand(4); //mettere come val qua caso+1
        switch(h){
            case 0:
                return `visualizza il più ${rand(2)? "grande" : "piccolo"} ${p2.nome} `;
            case 1: 
                return `visualizza tutti i ${p2.nome} tra 0 e ${rand(100)}`;
            case 2:
                return `visualizza tutti i ${p2.nome}`;
            case 3:
                return `visualizza tutti i ${p2.nome} con valore pari a ${rand(100)} `;
        }
    }
    else if(p2.tipo=='VARCHAR' || p2.tipo=='STRING' || p2.tipo=='TEXT'){
        let h=rand(2);
        switch(h){
            case 0:
                return `visualizza i ${p1.campi[rand(p1.campi.length)].nome} con ${p2.nome} pari a ${generaStringaCasuale(rand(p1.campi.nome.length))}`;
            case 1:
                return `visualizza tutti i ${p2.nome}`
        }
    }
    else if(p2.tipo=='DATE' || p2.tipo=='YEAR'){
        return `visualizza i ${p1.campi[rand(p1.campi.length)].nome} con ${p2.nome} ${rand(2)? "dopo" : "prima"} del ${rand(31)+1}/${rand(12)+1}/${2000+rand(25)}`;
    }

    else return "hai sbagliato qualcosa caro mio";
        
}   

function domandaMedia(t1, t2, t3){  
    const vect = [t1, t2, t3].filter(Boolean);
    console.log(vect);
    if(vect.length<2) return "devi inserire almeno 2 tabelle";
    
    const tn0 = vect[0];
    const tn1 = vect[1];

    if(tn1.foreignKeys) 
    {
        let t=tn1.campi[rand(tn1.campi.length)];
        if(t.tipo=="int" || t.tipo=='FLOAT' || t.tipo=='DOUBLE'){
            let h=rand(1); //mettere come val qua caso+1
            switch(h){
                case 0:
                    return `visualizza il più ${rand(2)? "grande" : "piccolo"} ${t.nome}`;
                case 1:
                    return 
            }
        }
    }
    else if(tn0.foreignKeys){

    }
    else return "non ci sono chiavi esterne";

}

function rand(max) {
    return Math.floor(Math.random() * max);
}

function generaStringaCasuale(lunghezza) {
    const caratteri = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let stringaCasuale = '';

    for (let i = 0; i < lunghezza+2; i++) stringaCasuale += caratteri.charAt(rand(caratteri.length));
    

    return stringaCasuale;
}