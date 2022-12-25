const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/registration", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => { console.log("db connected") })
    .catch((err) => { console.log('err :>> ', err); })