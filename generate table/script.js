document.addEventListener('DOMContentLoaded', function(){
    //prendo gli elementi che mi servono
    const nomeTabella= document.getElementById('tableName');
    const tabellaAttributi= document.getElementById('tabellaAttributi');
    const SQLtextArea= document.getElementById('codice');

    //event listener per aggiornare la textarea col codice c'è ovunque non lo rispiegherò
    nomeTabella.addEventListener('input', aggiornaSQL);
    
    //rimuove le righe e aggiorna sql
    tabellaAttributi.addEventListener('click', function(event){
        if(event.target.classList.contains('rimuoviRiga')){
            event.target.closest('tr').remove();
            aggiornaSQL();
        }
    });

    //rimuove le righe e aggiorna sql
    tabellaAttributi.addEventListener('input', function(event){
        if(event.target.classList.contains('attributeInput')){
            controllaAttributi()
            aggiornaSQL();
        }
    });

    //crea le righe
    function nuovaRiga(){
        const nuovaRiga= tabellaAttributi.insertRow();
        const colonne= ['nome', 'tipo', 'lunghezza', 'nullo', 'chiave', 'unico', 'rimuovi'];

        colonne.forEach(function(colName, index){
            const cell= nuovaRiga.insertCell(index);

            switch(colName){
                case 'nome':
                    cell.innerHTML= creaNome(colName);
                    break;
                case 'tipo':
                    cell.innerHTML= creaTipo();
                    break;
                case 'lunghezza':
                    cell.innerHTML= creaLunghezza();
                    break;
                //qua c'è un trikshot praticamente non metto il break e quindi scendono tutte nel case dell'unico e viene passato colName profe se non prendo 10 solo per questa cosa io non so se potremo essere ancora amici perchè sta cosa è stra intelligente
                case 'nullo':
                case 'chiave':
                case 'unico':
                    cell.innerHTML= creaCheckbox(colName);
                    break;
                case 'rimuovi':
                    cell.innerHTML= creaRimuovi();
                    break;
                default:
                    console.log("è finita");
            }
        });

        controllaAttributi();
        aggiornaSQL();
    }

    function creaNome(name){
        return `<input type="text" class="attributeInput" data-attribute="${name}" placeholder="${name}">`;
    }

    function creaTipo(){
        const types= ['INT', 'VARCHAR', 'DATE', 'TEXT'];
        return `<select class="attributeInput" data-attribute="type" onchange="handleTypeChange(this)">
                    ${types.map(type=> `<option value="${type}">${type}</option>`).join('')}
                </select>
                <br>
                <input type="checkbox" class="attributeInput" data-attribute="autoIncrement" onchange="handleAutoIncrementChange(this)"> Auto Increment`;
    }

    function creaLunghezza(){
        return `<input type="number" class="attributeInput" data-attribute="length" placeholder="Lunghezza" min="0" max="255">`;
    }

    function creaCheckbox(name){
        return `<input type="checkbox" class="attributeInput" data-attribute="${name}">`;
    }

    function creaRimuovi(){
        return `<button type="button" class="rimuoviRiga" onclick="removeRow(this)">Rimuovi</button>`;
    }

    //main funzione la più importante
    function aggiornaSQL(){
        let codiceSQL= `CREATE TABLE ${nomeTabella.value}(\n`;

        const righe= tabellaAttributi.getElementsByTagName('tr');
        const attributiUnici= [];

        for(let i= 1; i < righe.length; i++){
            const cells= righe[i].getElementsByTagName('td');
            const nome= cells[0].querySelector('.attributeInput').value;
            const tipo= cells[1].querySelector('.attributeInput').value;
            const cbAutoIncrement= cells[1].querySelector('.attributeInput[data-attribute="autoIncrement"]');
            const autoIncrement= cbAutoIncrement.checked && tipo=== 'INT' ? 'AUTO_INCREMENT' : '';
            const lunghezza= cells[2].querySelector('.attributeInput').value;
            const nullo= cells[3].querySelector('.attributeInput').checked ? 'NOT NULL' : '';
            const chiavePrimaria= cells[4].querySelector('.attributeInput').checked ? 'PRIMARY KEY' : '';
            const isUnico= cells[5].querySelector('.attributeInput').checked;

            if(isUnico){
                attributiUnici.push(nome);
            }

            codiceSQL += `  \`${nome}\` ${tipo} ${tipo=== 'DATE' ? '' : lunghezza ? `(${lunghezza})` : ''} ${nullo} ${chiavePrimaria} ${autoIncrement},\n`;
        }

        codiceSQL += attributiUnici.map(attr=> `  UNIQUE(\`${attr}\`),\n`).join('');
        codiceSQL= codiceSQL.slice(0, -2) + '\n);';

        SQLtextArea.value= codiceSQL;
    }

    //controllo quando vengono aggiuntigli attributi
    function controllaAttributi(){
        const attributi= document.querySelectorAll('.attributeInput[data-attribute="nome"]');
        const nomi= new Set();
    
        attributi.forEach(input=>{
            const name= input.value.trim();
    
            if(nomi.has(name)){
                alert('gli attributi non possono avere lo stesso nome.');
                input.value= '';
            } else{
                nomi.add(name);
    
                if(!(/^[a-zA-Z0-9]*$/.test(name))){
                    alert('il nome degli attributi non può essere composto solo da numeri.');
                    input.value= '';
                }
            }
        });
    }
    
    //qua disabilito o abilito le cose
    window.handleTypeChange= function(select){
        const cbAutoIncrement= select.closest('tr').querySelector('.attributeInput[data-attribute="autoIncrement"]');
        const lunghezza= select.closest('tr').querySelector('.attributeInput[data-attribute="length"]');

        
        cbAutoIncrement.disabled=(select.value !== 'INT');
        lunghezza.disabled=(select.value === 'DATE');

        if(select.value !== 'INT') 
            cbAutoIncrement.checked= false;

            
        aggiornaSQL();
    };

    window.handleAutoIncrementChange= function(checkbox){
        aggiornaSQL();
    };

    window.removeRow= function(button){
        button.closest('tr').remove();
        aggiornaSQL();
    };


    //vabbè questa parte è autoesplicativa
    function exportCode(){
        const n= nomeTabella.value.trim();
        if(/^[a-zA-Z]+$/.test(n)){
            const righe= tabellaAttributi.getElementsByTagName('tr');
            if(righe.length > 1){
                const controlloNomiAttributi= Array.from(tabellaAttributi.querySelectorAll('.attributeInput[data-attribute="nome"]'))
                    .every(input=> input.value.trim() !== '');
                if(controlloNomiAttributi){
                    const sqlCode= SQLtextArea.value;
                    if(sqlCode.trim() !== ''){
                        const blob= new Blob([sqlCode],{ type: 'text/plain' });
                        const link= document.createElement('a');
                        link.href= window.URL.createObjectURL(blob);
                        link.download= `${n}.sql`;
                        link.click();
                    } else{
                        alert('Genera la tabella prima di esportare il codice.');
                    }
                } else{
                    alert('Assegna un nome a tutti gli attributi prima di esportare il codice.');
                }
            } else{
                alert('Aggiungi almeno un attributo prima di esportare il codice.');
            }
        } else{
            alert('Il nome della tabella può contenere solo lettere.');
        }
    }
    //event listener per esportare il codice sql e creare una nuova riga
    document.getElementById('aggiungiRiga').addEventListener('click', nuovaRiga);
    document.getElementById('esporta').addEventListener('click', exportCode);
});
