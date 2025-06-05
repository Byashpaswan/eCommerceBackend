const Mongoose=require('mongoose')


Mongoose.Promise=Promise
let options={
    // useNewUrlParser:true,
    // useUnifiedTopology:true
}


if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV ==='stage' ) {
  options = {
    // ...options,
    replSet: {
      rs_name: "rs0",
      // readPreference: "secondaryPreferred"
    }
  };
}
Mongoose.connect(process.env.MONGO_URL, options)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
const connection=Mongoose.connection;
connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
connection.once('open', () => {
    console.log(Mongoose.connection.readyState === 1 ? 'MongoDB is connected' : 'MongoDB is not connected');    
});