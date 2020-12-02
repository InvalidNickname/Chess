const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
app.use(cors())
const PORT = process.env.PORT || 3001
app.use(bodyParser.json())

require('./routes/user.routes')(app);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})