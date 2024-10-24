const app = require('./app')

const PORT = process.env.PORT || 1050
app.listen(PORT, () => {
    console.log('Application running on port  @1050')
})