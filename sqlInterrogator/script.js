//tab{
//   campi[]:
//       nome
//       tipo
//   nomeTabella
//}
function generaDomanda(difficolta) {

    const str1 = document.getElementById('table1').value;
    const str2 = document.getElementById('table2').value;
    const str3 = document.getElementById('table3').value;

    const tab1=dividiSQL(str1);
    const tab2=dividiSQL(str2);
    const tab3=dividiSQL(str3);

    if(difficolta=='facile'){
        document.getElementById('generatedQuestion').value= domandaFacile(tab1, tab2, tab3);
    }
}


function dividiSQL(codiceSQL) {
    if(!codiceSQL) return;

    const sqlPulito = codiceSQL.replace(/\s+/g, ' ').trim();
    const indiceInizio = sqlPulito.indexOf('(');
    const indiceFine = sqlPulito.lastIndexOf(')');
    const dettagliTabella = sqlPulito.substring(indiceInizio + 1, indiceFine).trim();
    const righe = dettagliTabella.split(',');
    
    const infoTabella = {
        nomeTabella: sqlPulito.match(/CREATE TABLE (\w+)/)[1],
        campi: []
    };

    righe.forEach(riga => {
        const [nomeCampo, tipoCampo] = riga.trim().split(' ');
        infoTabella.campi.push({ nome: nomeCampo, tipo: tipoCampo });
    });

    return infoTabella;
}


function domandaFacile(t1, t2, t3){
    let vect=[0, 0, 0];
    if(t1) vect[0]=1;
    if(t2) vect[1]=1;
    if(t3) vect[2]=1;

    
}