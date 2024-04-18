const express = require('express');
const app = express();

const indexRouter = require('./routes/indexRouter');
const productRouter = require('./routes/productRouter');
const cartsRouter = require('./routes/cartsRouter');

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
