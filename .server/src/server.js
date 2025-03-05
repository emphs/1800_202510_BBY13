import express from 'express';
import fs from 'fs'

const app = express();
const port = 3000;

app.use(express.json());

app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));

app.get("/", function(req, res) {
    let doc = fs.readFileSync("/path/to/index.html", "utf8"); //TODO! decide the entry
    res.send(doc);
});

app.get("/helloHTML", function (req, res) {
    // hard-coded HTML
    let d = new Date();
    res.send("<html><head>" + d + "<title>Hi!</title></head><body><p>Hello!</p></body></html>");
});

app.get("/profile", function (req, res) {

    let doc = fs.readFileSync("./app/html/profile.html", "utf8");

    // just send the text stream
    res.send(doc);

});

app.get("/date", function (req, res) {

    // set the type of response:
    res.setHeader("Content-Type", "application/json");
    let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    let d = new Date();

    res.send({ currentTime: d.toLocaleDateString("en-US", options) });

});

app.use(function (req, res, next) {
    res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static("../path/to/build")); // TODO! found out where to put release
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});