import { getDocument, app } from "$lib/fire_base/firebase";
import { allSiteNbaData, allSiteNflData, loading } from "$lib/stores/ketzner";
import { getMessaging, getToken } from "firebase/messaging";

export async function getData() {
    let betonlineData = await getDocument("NFL", "BetOnline")
    let betMgmData = await getDocument("NFL", "BetMgm")
    let myBookieData = await getDocument("NFL", "MyBookie")
    let uniBetData = await getDocument("NFL", "Unibet")
    let draftKingData = await getDocument("NFL", "DraftKing")
    let barStoolData = await getDocument("NFL", "BarStool")
    let pointsBetData = await getDocument("NFL", "PointsBet")
    let sisportData = await getDocument("NFL", "SisportsBook")
    let foxBetData = await getDocument("NFL", "FoxBet")
    let bovadoData = await getDocument("NFL", "Bovada")
    let fanduelData = await getDocument("NFL", "Fanduel")
    let allSitesData = { "Barstool": barStoolData, "BetMGM": betMgmData, "BetOnline": betonlineData, "Bovada": bovadoData, "DraftKings": draftKingData, "FanDuel": fanduelData, "FoxBet": foxBetData, "MyBookie": myBookieData, "PointsBet": pointsBetData, "SI-Sports": sisportData, "UniBet": uniBetData }
    let sitesList = Object.keys(allSitesData)
    //console.log(allSitesData)
    let groupedData = groupData(allSitesData)
    //console.log(groupedData)
    let calculatedOdds = calculateHighsAndLows(groupedData, sitesList)
    //console.log(calculatedOdds)
    let finalData = checkGreatOdds(calculatedOdds, sitesList)
    //console.log(finalData)
    let sitesWithURL = [{
        name: "Barstool",
        link: "https://www.barstoolsportsbook.com/sports/american_football/nfl?category=upcoming"
    }, {
        name: "BetMGM",
        link: "https://sports.az.betmgm.com/en/sports/football-11/betting/usa-9/nfl-35"
    },
    {
        name: "BetOnline",
        link: "https://www.betonline.ag/sportsbook/"
    }, {
        name: "Bovada",
        link: "https://www.bovada.lv/sports/football/nfl"
    }, {
        name: "DraftKings",
        link: "https://sportsbook.draftkings.com/leagues/football/nfl?_ga=2.249996290.542275771.1665834125-675572720.1665407669"
    }, {
        name: "FanDuel",
        link: "https://sportsbook.fanduel.com/navigation/nfl"
    }
        , {
        name: "FoxBet",
        link: "https://nj.foxbet.com/#/american_football/competitions/9574879"
    }, {
        name: "MyBookie",
        link: "https://www.mybookie.ag/sportsbook/nfl/"
    }, {
        name: "PointsBet",
        link: "https://pointsbet.com.au/sports/american-football/NFL"
    }, {
        name: "SI-Sports",
        link: "https://www.sisportsbook.com/football/s-6/"
    }, {
        name: "UniBet",
        link: "https://www.unibet.nl/betting/sports/filter/american_football/nfl/all/matches"
    }]
    let data = {
        games: finalData,
        sitesList: sitesWithURL
    }
    allSiteNflData.set(data)
    //console.log(data)

    return data
    //checkGreatOdds(calculatedOdds,sitesList)
}



function groupData(datas) {
    let sortedData = []
    let max = { siteName: "", length: 0, siteData: [] };
    for (const [key, value] of Object.entries(datas)) {
        if (value.length > max.length) {
            max.length = value.length;
            max.siteName = key;
            max.siteData = value;
        }
    }
    delete datas[max.siteName]
    for (let i = 0; i < max.length; i++) {
        let matchInfo = new Map()
        for (let key in datas) {
            for (let game of datas[key]) {
                if (max.siteData[i].home_team == game.home_team && max.siteData[i].visitor_team == game.visitor_team) {
                    matchInfo.set('home_team', max.siteData[i].home_team)
                    matchInfo.set('visitor_team', max.siteData[i].visitor_team)
                    matchInfo.set(`${key}_home_moneyline`, game.home_moneyline == "" ? "N/A" : game.home_moneyline)
                    matchInfo.set(`${key}_visitor_moneyline`, game.visitor_moneyline == "" ? "N/A" : game.visitor_moneyline)
                    matchInfo.set(`${max.siteName}_home_moneyline`, max.siteData[i].home_moneyline == "" ? "N/A" : max.siteData[i].home_moneyline)
                    matchInfo.set(`${max.siteName}_visitor_moneyline`, max.siteData[i].visitor_moneyline == "" ? "N/A" : max.siteData[i].visitor_moneyline)
                }
            }
        }
        if (matchInfo.size != 0) {
            sortedData.push(matchInfo)
        }
    }
    // console.log("sortedData: ", `(${sortedData.length})`)
    // for (let key of sortedData) {
    //     key.forEach((val, key) => {
    //         console.log(`${key}:${val}`)
    //     })
    //     console.log("---------------------")
    // }
    return sortedData;
}

function calculateHighsAndLows(groupedData, sitesList) {
    for (let stats of groupedData) {
        let plusHigh = 0
        let minusLow = 0
        for (let site of sitesList) {
            if (stats.has(`${site}_home_moneyline`)) {
                let moneyline = stats.get(`${site}_home_moneyline`)
                if (moneyline != "N/A") {
                    if (moneyline.startsWith("-")) {
                        let val = parseInt(moneyline)
                        if (plusHigh < val || minusLow == 0) {
                            plusHigh = val
                        }
                    } else {
                        let val = parseInt(moneyline.split("+")[1])
                        if (plusHigh < val) {
                            plusHigh = val
                        }
                    }
                }
            }
            if (stats.has(`${site}_visitor_moneyline`)) {
                let moneyline = stats.get(`${site}_visitor_moneyline`)
                if (moneyline !== "N/A") {
                    if (moneyline.startsWith("+")) {
                        let val = parseInt(moneyline.split("+")[1])
                        if (minusLow < val) {
                            minusLow = val
                        }
                    } else {
                        let val = parseInt(moneyline)
                        if (minusLow < val || minusLow == 0) {
                            minusLow = val
                        }
                    }
                }
            }
        }
        for (let site of sitesList) {
            if (stats.has(`${site}_home_moneyline`)) {
                let moneyline = stats.get(`${site}_home_moneyline`)
                if (moneyline !== "N/A") {
                    let val
                    let color
                    if (moneyline.startsWith("-")) {
                        val = parseInt(moneyline)
                        color = "table-danger"
                    } else {
                        val = parseInt(moneyline.split("+")[1])
                        color = "table-warning"
                    }

                    if (plusHigh == val || plusHigh == 0) {
                        stats.set(`${site}_home_color`, color)
                    }
                } else {
                    stats.set(`${site}_home_color`, "table-secondary")
                }
            }
            if (stats.has(`${site}_visitor_moneyline`)) {
                let moneyline = stats.get(`${site}_visitor_moneyline`)
                if (moneyline !== "N/A") {
                    let val
                    let color
                    if (moneyline.startsWith("-")) {
                        val = parseInt(moneyline)
                        color = "table-danger"
                    } else {
                        val = parseInt(moneyline.split("+")[1])
                        color = "table-warning"
                    }
                    if (minusLow == val) {
                        stats.set(`${site}_visitor_color`, color)
                    }
                } else {
                    stats.set(`${site}_visitor_color`, "table-secondary")
                }
            }
        }
    }
    return groupedData

}

function checkGreatOdds(calculatedOdds, sitesList) {
    let sendNotification = false;
    let homeHigh
    let visitorHigh
    for (let match of calculatedOdds) {
        homeHigh = { name: "", value: -10000, team: "" }
        visitorHigh = { name: "", value: -10000, team: "" }
        match.forEach((val, key) => {
            for (let site of sitesList) {
                let homeMoneyline = `${site}_home_moneyline`
                let visitorMoneyline = `${site}_visitor_moneyline`
                if (key == homeMoneyline) {
                    if (val !== "N/A") {

                        let odd;
                        if (val.startsWith("+"))
                            odd = parseInt(val.split("+")[1])
                        else {
                            odd = parseInt(val)
                        }
                        if (odd > homeHigh.value) {
                            homeHigh.name = site
                            homeHigh.value = odd
                            homeHigh.team = match["home_team"]
                        }
                    }
                } else if (key == visitorMoneyline) {
                    if (val !== "N/A") {
                        let odd;
                        if (val.startsWith("+"))
                            odd = parseInt(val.split("+")[1])
                        else {
                            odd = parseInt(val)
                        }
                        if (odd > visitorHigh.value) {

                            visitorHigh.name = site
                            visitorHigh.value = odd
                            visitorHigh.team = match["visitor_team"]
                        }
                    }
                }
            }
        })
        if (homeHigh.value < 0) {
            if (Math.abs(homeHigh.value) < Math.abs(visitorHigh.value)) {
                match.set(`${homeHigh.name}_home_color`, "table-success")
                match.set(`${visitorHigh.name}_visitor_color`, "table-success")
                sendNotification = true;
            }
        }
    }
    // if (sendNotification) {
    //     let data = {
    //         home_team: homeHigh.team,
    //         visitor_team: visitorHigh.team,
    //         home_moneyline: `${homeHigh.value}`,
    //         visitor_moneyline: `${visitorHigh.value}`,
    //         home_site: homeHigh.name,
    //         visitor_site: visitorHigh.name,
    //         token:""
    //     }
    //     console.log(`Not: ${data}`)
    //     const messaging = getMessaging(app)
    //     requestPermission().then(()=>{
    //         getToken(messaging,{ vapidKey: "BFTapxnE35I_BEYhF80PI3jdbXbNVVMw7xSOuP--Hi5umsXrtDVefMtMMDsLnY20cmhYb7dzfxDjJ_5bOXcFZDA" }).then((currentToken) => {
    //             if (currentToken) {
    //                 console.log(`token:${currentToken}`)
    //                 data.token = [currentToken]
    //                 fetch('https://ketzner-sports.uc.r.appspot.com/notify', {
    //                     method: 'POST',
    //                     body: JSON.stringify(data),
    //                     mode: 'cors'
    //                 })
    //             } else {
    //                 console.log("Error")
    //             }
    //         })
    //     })
       
    // }
    return calculatedOdds
}
async function requestPermission(){
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        }
    })
}
export async function getNbaData() {
    let betonlineData = await getDocument("NBA", "BetOnline")
    let betMgmData = await getDocument("NBA", "BetMgm")
    let myBookieData = await getDocument("NBA", "MyBookie")
    let uniBetData = await getDocument("NBA", "Unibet")
    let draftKingData = await getDocument("NBA", "DraftKing")
    let barStoolData = await getDocument("NBA", "BarStool")
    let pointsBetData = await getDocument("NBA", "PointsBet")
    let sisportData = await getDocument("NBA", "SisportsBook")
    let foxBetData = await getDocument("NBA", "FoxBet")
    let bovadoData = await getDocument("NBA", "Bovada")
    let fanduelData = await getDocument("NBA", "Fanduel")
    let allSitesData = { "Barstool": barStoolData, "BetMGM": betMgmData, "BetOnline": betonlineData, "Bovada": bovadoData, "DraftKings": draftKingData, "FanDuel": fanduelData, "FoxBet": foxBetData, "MyBookie": myBookieData, "PointsBet": pointsBetData, "SI-Sports": sisportData, "UniBet": uniBetData }
    let sitesList = Object.keys(allSitesData)
    //console.log(allSitesData)
    let groupedData = groupData(allSitesData)
    //console.log(groupedData)
    let calculatedOdds = calculateHighsAndLows(groupedData, sitesList)
    //console.log(calculatedOdds)
    let finalData = checkGreatOdds(calculatedOdds, sitesList)
    //console.log(finalData)
    let sitesWithURL = [{
        name: "Barstool",
        link: "https://www.barstoolsportsbook.com/sports/american_football/nfl?category=upcoming"
    }, {
        name: "BetMGM",
        link: "https://sports.az.betmgm.com/en/sports/football-11/betting/usa-9/nfl-35"
    },
    {
        name: "BetOnline",
        link: "https://www.betonline.ag/sportsbook/"
    }, {
        name: "Bovada",
        link: "https://www.bovada.lv/sports/football/nfl"
    }, {
        name: "DraftKings",
        link: "https://sportsbook.draftkings.com/leagues/football/nfl?_ga=2.249996290.542275771.1665834125-675572720.1665407669"
    }, {
        name: "FanDuel",
        link: "https://sportsbook.fanduel.com/navigation/nfl"
    }
        , {
        name: "FoxBet",
        link: "https://nj.foxbet.com/#/american_football/competitions/9574879"
    }, {
        name: "MyBookie",
        link: "https://www.mybookie.ag/sportsbook/nfl/"
    }, {
        name: "PointsBet",
        link: "https://pointsbet.com.au/sports/american-football/NFL"
    }, {
        name: "SI-Sports",
        link: "https://www.sisportsbook.com/football/s-6/"
    }, {
        name: "UniBet",
        link: "https://www.unibet.nl/betting/sports/filter/american_football/nfl/all/matches"
    }]
    let data = {
        games: finalData,
        sitesList: sitesWithURL
    }
    allSiteNbaData.set(data)
    //console.log(data)

    return data
    //checkGreatOdds(calculatedOdds,sitesList)
}