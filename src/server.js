const express = require('express');
const cors = require('cors');
const app = express();
const config = require('../config');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, './views'));

app.get('/ticket/:ticketId', (req, res) => {
    const transcriptCode = req.params.ticketId;

    const filePath = path.join(__dirname, '../transcripts', `${transcriptCode}`);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).render('error', { err: "Ticket bulunamadı", rp: "/" });
        }

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).render('error', { err: "Ticket okunurken bir hata oluştu", rp: "/" });
            }

            res.render('ticket', { transcript: data });
        });
    });
});

app.get('/ticket/download/:ticketId', (req, res) => {
    const transcriptCode = req.params.ticketId;

    const filePath = path.join(__dirname, '../transcripts', `${transcriptCode}`);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).render('error', { err: "Ticket bulunamadı", rp: "/" });
        }

        res.download(filePath, `${transcriptCode}.html`);
    });
});

app.listen(config.port || 80, () => {
    console.log(`Sunucu ${config.port || 80} portunda başlatıldı.`);
});