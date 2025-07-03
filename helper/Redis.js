
const { createClient } = require('redis');

const client = createClient({
  url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || '6379'}`
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', () => {
  console.log('Redis client connected successfully');
});

// Connect Redis immediately
(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();


exports.getRedisKeys=function(pattern){
    return new Promise((resolve,reject)=>{
        client.keys(pattern, (err, keys) => {
            if (err) {
                reject({error:true,
                    message:'error while fetching keys from redis',
                    data: err.message
                });
            } else {
                resolve({
                    error:false,
                    message:'keys fetched successfully',
                    data: keys
                });
            }
        });
    });
}

// exports.getRedisData=function(key){
//     return new Promise((resolve, reject) => {
//         client.get(key, (err, data) => {
//             if (err) {
//                 reject({
//                     error:true,
//                     message:'error while fetching data from redis',
//                     data: err.message
//                 });
//             } else {
//                 resolve({
//                     error:false,
//                     message:'data fetched successfully',
//                     data: data
//                 });
//             }
//         });
//     });
// }
exports.getRedisData = async function(key) {
  try {
    const data = await client.get(key);
    return {
      error: false,
      message: 'Data fetched successfully',
      data
    };
  } catch (err) {
    return {
      error: true,
      message: 'Redis GET failed',
      data: err.message
    };
  }
};


// exports.setRedisData=function(key, value, exp) {
//     return new Promise((resolve, reject) => {
//         if(value && typeof value === 'object') {
//             value = JSON.stringify(value);
//         }
//         else if(value==null || value==undefined) {
//             return resolve({
//                 error:true,
//                 message:'data is null or undefined',
//                 data: null
//             });
//         }
//         client.set(key,value,function(err,result){
//             if(err){
//                 reject({
//                     error:true,
//                     message:'error while setting data in redis',
//                     data: err.message
//                 });
//             } 
//             exp=exp || 3600; // default expiry time is 1 hour
//                 client.expire(key, exp, function(err, result){
//                     if (err) {
//                         debug("could not set expiry to key ", key)
//                     }

//                    resolve({
//                    error:false,
//                    message:'data set successfully',
//                    data: result
//                });
//             });
//         });
//     })
// }

exports.setRedisData = async function(key, value, exp = 3600) {
  try {
    if (value == null || value === undefined) {
      return {
        error: true,
        message: 'Value is null or undefined',
        data: null
      };
    }

    const finalValue = typeof value === 'object' ? JSON.stringify(value) : value;

    await client.set(key, finalValue, {
      EX: exp, // Set expiration in seconds
    });

    return {
      error: false,
      message: 'Data set successfully',
      data: finalValue
    };
  } catch (err) {
    return {
      error: true,
      message: 'Redis SET failed',
      data: err.message
    };
  }
};


exports.deleteRedisData=function(key) {
    return new Promise((resolve, reject) => {
        client.del(key, (err, result) => {
            if (err) {
                reject({error:true,
                    message:'error while deleting data from redis',
                    data: err.message
                });
            } else {
                resolve({
                    error:false,
                    message:'data deleted successfully',
                    data: result
                });
            }
        });
    });
}

// module.exports = client;