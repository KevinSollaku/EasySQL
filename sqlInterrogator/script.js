const vectCampi=[];
const vectEsterni=[];

function generaDomanda(difficolta) {
    vectCampi.length= 0;
    vectEsterni.length= 0;
    
    const str1 = document.getElementById('table1').value;
    const str2 = document.getElementById('table2').value;
    const str3 = document.getElementById('table3').value;

    dividiSQL(str1);
    dividiSQL(str2);
    dividiSQL(str3);
    console.log(vectEsterni);
    console.log(vectCampi);
}

function dividiSQL(stringa){
    let regex = /CREATE TABLE (\w+)\(([\s\S]+)\);/;
    let match = stringa.match(regex);

    if (!match) {
        return null;
    }

    let nomeTabella = match[1];
    let campi = match[2].trim().split(/\s*,\s*/);

    campi.forEach(campo => {
        const regexCampo = /`(\w+)`\s+(\w+)/;
        let campoMatch = campo.match(regexCampo);

        if(campoMatch){
            let nomeCampo = campoMatch[1];
            let tipoCampo = campoMatch[2].toUpperCase();
            vectCampi.push([nomeCampo, tipoCampo, nomeTabella]);
        }
        else if(campo.includes('FOREIGN KEY')){
            const regexForeignKey = /FOREIGN KEY \((\w+)\) REFERENCES (\w+)\((\w+)\)/;
            const foreignKeyMatch = campo.match(regexForeignKey);

            if (foreignKeyMatch) {
                const campoInterno = foreignKeyMatch[1];
                const tabellaEsterna = foreignKeyMatch[2];
                const campoEsterno = foreignKeyMatch[3];
                vectEsterni.push([campoInterno, tabellaEsterna, campoEsterno])
            }
        }
        
    });
}