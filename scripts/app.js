const app = Vue.createApp({
    data() {
        return {
            init: {
                headers: new Headers({
                    "X-API-key": "49FIPNuYEyfpTDeoEukLIIDCEF3IiTFOf4eEcvkx"
                })
            },
            data: [],
            chequeado: ["R", "D", "ID"],
            selectEstado: "all",
            moreInfo: 'Show More'
        };
    },
    created() {
        let url = ''
        if (document.getElementById("house")) {
            url = "https://api.propublica.org/congress/v1/113/house/members.json"
        }
        if ((document.getElementById("senate"))) {
            url = "https://api.propublica.org/congress/v1/113/senate/members.json"
        }
        fetch(url, this.init)
            .then(res => res.json())
            .then(json => {
                this.data = json.results[0].members
            })
    },
    methods: {
        memberData(){
            let republicano=0
            this.data.forEach(ele => {
                if(ele.party =="R") {
                    republicano+= 1
                }
            })
            return republicano
        },

        filtroEstados() {
            let arrayEstados = []
            this.data.map((elemento) => {
                if (arrayEstados.indexOf(elemento.state) == -1) {
                    arrayEstados.push(elemento.state)
                }
            })
            arrayEstados.sort()
            return arrayEstados
        },
        filtrado() {
            let arrayFiltrado = []
            arrayFiltrado = this.data.filter(elemento => {
                return (this.selectEstado == elemento.state || this.selectEstado == "all") && this.chequeado.indexOf(elemento.party) !== -1
            })
            return arrayFiltrado
        },
        glanceTablaUno() {
            let sumaR=0
            let sumaD=0
            let sumaID=0
            
            this.data.forEach(member => {
                if (member.party === "R"){
                    sumaR++
                }else if(member.party === "D"){
                    sumaD++
                }else if(member.party === "ID"){
                    sumaID++
                }
            })

            let repVotes = 0
            let demVotes = 0
            let idVotes = 0
            this.data.forEach(member => {
                if (member.party === "R"){
                    repVotes += member.votes_with_party_pct
                }else if(member.party === "D"){
                    demVotes += member.votes_with_party_pct
                }else if(member.party === "ID"){
                    idVotes += member.votes_with_party_pct
                }
            });

            let resultadoTablaUno = [
                {
                    'partido': 'Republicans',
                    'miembros': sumaR,
                    'votos': ((repVotes / sumaR).toFixed(2))
                },
                {
                    'partido': 'Democrats',
                    'miembros': sumaD,
                    'votos': ((demVotes / sumaD).toFixed(2))
                },
                {
                    'partido': 'Independents',
                    'miembros': sumaID,
                    'votos': ((idVotes / sumaID).toFixed(2))
                },
                
            ]
            return resultadoTablaUno
        },
        glanceTablaDos() {
            let masVotosPerdidos = []

            this.data.sort((a, b) => b.missed_votes_pct-a.missed_votes_pct)
            for (let i = 0; i < this.data.length*0.1; i++) {
                masVotosPerdidos.push(this.data[i])
            }
            
            return masVotosPerdidos
        },
        glanceTablaTres() {
            let menosVotosPerdidos = []

            this.data.sort((a, b) => a.missed_votes_pct-b.missed_votes_pct)
            for (let i = 0; i < this.data.length*0.1; i++) {
                menosVotosPerdidos.push(this.data[i])
            }
            
            return menosVotosPerdidos
        },
        loyalTablaDos() {
            let menosLeales = []

            this.data.sort((a, b) => b.votes_against_party_pct-a.votes_against_party_pct)
            for (let i = 0; i < this.data.length*0.1; i++) {
                menosLeales.push(this.data[i])
            }
            
            return menosLeales
        },
        loyalTablaTres() {
            let masLeales = []

            this.data.sort((a, b) => b.votes_with_party_pct-a.votes_with_party_pct)
            for (let i = 0; i < this.data.length*0.1; i++) {
                masLeales.push(this.data[i])
            }
            
            return masLeales
        },
    }
})