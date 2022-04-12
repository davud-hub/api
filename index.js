 const Port = process.env.PORT || 8000
 const express = require('express')
 const axios = require('axios')
 const cheerio = require('cheerio')
const { response } = require('express')
 const app = express()

 const newspapers = [
     {
         name: 'ad',
         address: 'https://www.ad.nl/economie/',
         base: ''
     },
     {
        name: 'nu',
        address: 'https://www.nu.nl/economie-achtergrond',
        base: 'https://www.nu.nl'
    },
    {
        name: 'nos',
        address: 'https://nos.nl/nieuws/economie',
        base: 'https://nos.nl'
    },
 ]

 const articles = []

 newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("inflatie")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
 })

 app.get('/', (req,res) => {
    res.json('Welkom')
 })

 app.get('/economie',(req,res) => {
    res.json(articles)
 })

 app.get('/news/:newspaperId', (req, res) => {
     const newspaperId = req.params.newspaperId

     const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
     const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            
            $('a:contains("inflatie")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
 })

 app.listen(Port, () => console.log('server running on PORT ${PORT}'))