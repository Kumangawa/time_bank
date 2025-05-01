# saporito gruppo 10


## Getting started

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab-edu.supsi.ch/dti-isin/giuliano.gremlich/opzione-blockchain-engineering/24-25/progetti-studenti/saporito.git
git branch -M main
git push -uf origin main
```


### Preparazione della Blockchain
1. **Naviga nella cartella del progetto blockchain:**
   cd blockchain
2. **Verifica che il contratto sia presente nella cartella contracts:** Dovresti vedere il contratto smart all'interno della cartella contracts.
3. **Compila il contratto:** Esegui il seguente comando per compilare il contratto e generare gli artifacts (inclusi ABI e Typechain):
    npx hardhat compile
4. **Avvia il nodo della blockchain localmente:** 
    npx hardhat node
5. **Deploy del contratto sulla blockchain locale:** 
    npx hardhat run scripts/deploy_bank.ts --network localhost

## Avvio del frontend
1. **NNaviga nella cartella del frontend:**
   cd ..
   cd frontend
2. **Avvia l'applicazione React:**
   npm run dev

## Avvio dei Test
1. **Naviga nella cartella del progetto blockchain:** 
   cd blockchain
2. **Esegui i test:** Dopo aver configurato correttamente l'ambiente, puoi eseguire i test con il comando:
   npx hardat test
Questo eseguirà tutti i test presenti nel progetto blockchain e ti mostrerà il risultato nel terminale.


## Struttura del Frontend
Nel frontend troverai le seguenti cartelle e file importanti:

- typechain-types: Contiene i file generati da Typechain che sono necessari per interagire con il contratto. Se non li vedi nel    frontend, puoi copiarli dalla cartella typechain-types del progetto blockchain. Se anche nel progetto blockchain non li trovi, significa che c'è stato un errore nel processo di compilazione e dovrai ripetere i passaggi da capo.

- components: Contiene le varie pagine dell'applicazione, tra cui:
    - UserPage, ServicesPage, RequestsPage, TransactionsPage (le pagine principali).

- utils: Contiene i file che gestiscono la logica per interagire con il contratto:
    - TimeBankContract.ts
    - TimeBankFunctions.ts

- App.tsx: Il file di entry point per l'applicazione, che contiene i collegamenti tra le diverse pagine.

## Avvio Rapido dell'Applicazione
Se desideri avviare rapidamente l'applicazione senza entrare nei dettagli:

1. **Avvia il nodo della blockchain:** Esegui il comando nel terminale della cartella blockchain:
    npx hardhat node

2. **Esegui il deploy del contratto:** In un altro terminale, esegui il deploy del contratto sulla rete locale:
    npx hardhat run scripts/deploy_bank.ts --network localhost

3. **Avvia il frontend:** In un altro terminale, vai nella cartella del frontend ed esegui il comando:
    npm run dev

Una volta che il backend e il frontend sono in esecuzione, apri il browser all'indirizzo http://localhost:3000 per interagire con l'applicazione.

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab-edu.supsi.ch/dti-isin/giuliano.gremlich/opzione-blockchain-engineering/24-25/progetti-studenti/saporito/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Questo Progetto si chiama Time Bank

## Description
Questo progetto permette di lanciare una blockchain locale basata su un contratto smart creato ad hoc. Dopo aver effettuato il deployment del contratto, sarà possibile interagire con esso attraverso un'interfaccia utente realizzata con React.  
Quando avvii l'applicazione, ti verrà richiesto di connettere un account MetaMask. Se preferisci, puoi anche utilizzare dei dati di test già preimpostati. Questo ti consentirà di eseguire tutte le operazioni senza dover utilizzare un tuo account MetaMask personale.  
Una volta connesso, avrai accesso alle seguenti pagine principali:
- **User Page**: Ti mostrerà il tuo saldo (credito), i servizi che hai messo a disposizione, le richieste che hai preso, e la possibilità di lasciare una valutazione per i servizi completati. Potrai anche impostare il prezzo per i tuoi servizi e descrivere il tipo di lavoro.
- **Services Page**: Qui puoi creare e offrire i tuoi servizi, impostando il prezzo. In questa sezione potrai anche visualizzare i servizi offerti da altri utenti e decidere se acquistarli.
- **Requests Page**: Puoi creare richieste di servizi che altri utenti potranno accettare. In questa pagina vedrai anche le richieste fatte da altri utenti.
- **Transactions Page**: Mostra l'elenco di tutte le transazioni effettuate, così da tenere traccia dei movimenti sulla piattaforma.


## Troubleshooting
- Se i file Typechain non sono presenti nel frontend, assicurati che la compilazione del contratto sia andata a buon fine nel progetto blockchain (npx hardhat compile).

- Se il contratto non viene distribuito correttamente o non si avvia la blockchain locale, prova a eseguire di nuovo i comandi dalla cartella blockchain.

- Se riscontri problemi con MetaMask, verifica che l'account sia correttamente connesso e che la rete locale sia selezionata.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Prima di iniziare, devi soddisfare questi prerequisiti:

- **Node.js (v20 or higher)**: You can download it from [here](https://nodejs.org/).
- **npm** (Node Package Manager) or **Yarn**: npm comes bundled with Node.js, or you can install Yarn from [here](https://yarnpkg.com/).


## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
Ecco alcuni degli sviluppi futuri previsti per il progetto:

- **Integrazione con wallet diversi**: Implementare il supporto per altre soluzioni di wallet oltre a MetaMask, come Trust Wallet o Coinbase Wallet.
- **Ottimizzazione della UI/UX**: Migliorare l'interfaccia utente per una migliore esperienza utente, includendo miglioramenti grafici e una navigazione più fluida.
- **Funzionalità di feedback avanzato**: Aggiungere funzionalità per lasciare recensioni più dettagliate sui servizi ricevuti e offerti.
- **Integrazione di smart contract avanzati**: Aggiungere funzionalità avanzate come i contratti temporali e la gestione automatica delle transazioni.
- **Estensione per la gestione multi-utente**: Permettere la gestione di account multipli e la possibilità di configurare differenti livelli di permessi per gli utenti.
- **Supporto per altre blockchain**: Espandere il supporto a diverse blockchain, come Binance Smart Chain o Polygon, per permettere una maggiore interoperabilità.
- **Automatizzazione dei test**: Creare una suite di test automatici per garantire la qualità e la sicurezza del codice e per ridurre i rischi di errori.

Queste funzionalità sono pensate per il miglioramento continuo della piattaforma e potrebbero essere implementate a seconda delle priorità e dei feedback degli utenti.

## Contributing
Il maggior contributore a questo progetto è **Samuele Giuseppe Saporito**.

## Authors and acknowledgment
Questo progetto è stato creato e sviluppato da **Samuele Giuseppe Saporito**.

Vorrei ringraziare le risorse online e la documentazione che hanno facilitato la creazione del progetto, tra cui:
- [Documentazione di OpenZeppelin](https://docs.openzeppelin.com/contracts/5.x/)
- [Ethers.js Documentation](https://docs.ethers.org/v5/)
- [Hardhat Documentation](https://hardhat.org/)

## License
For open source projects, say how it is licensed.

## Project status
Sfortunatamente per la mia incapacità, nel file TimeBankContract.ts ho messo la parte dove si può collegare MetaMask, solo che quando si collega non sembra collegarsi al nodo, quindi non ogni volta che tento di fare un servizio continua a generarmi errori, per questo ho lasciato l'altro pulsante che prende i dati localmente.

Sarebbe meglio mettere a posto è sempre nel file TimeBankContract.ts ci sono dei dati importanti che ho lasciato scoperto, se si ha un attimo di tempo dovrebbero essere messi in un vault.

Riuscire a togliere le richieste quando vengono prese o completare, perchè al momento se qualcuno tenta di prendere un servizio preso da qualcun altro viene bloccato ma non visualmente, cioè rimane li il servizio, anche quando chiudo un servizio o gli do un voto succede questo.