const path = require('path');
const express = require('express');
const homeRoutes = require('./routes/homeRoutes');

// app instance
const app = express();

// request process
app.use(express.json());

// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "download")));

app.use("/", homeRoutes);

app.all('*', (req, res) => {
    res.status(404).send('404 - Not found!');
})

// app listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`app is running on port - ${PORT}`)
);
