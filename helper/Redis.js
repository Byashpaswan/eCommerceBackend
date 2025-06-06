var redis=require('redis');
var client=redis.createClient(process.env.REDIS_PORT || '6379', process.env.REDIS_HOST || '127.0.0.1');


client.on('error', (err) => {
    console.error('Redis error:', err);
});
client.on('connect', () => {
    console.log('Redis client connected successfully');
});



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

exports.getRedisData=function(key){
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err) {
                reject({error:true,
                    message:'error while fetching data from redis',
                    data: err.message
                });
            } else {
                resolve({
                    error:false,
                    message:'data fetched successfully',
                    data: data
                });
            }
        });
    });
}

exports.setRedisData=function(key, value, exp) {
    return new Promise((resolve, reject) => {
        if(value && typeof value === 'object') {
            value = JSON.stringify(value);
        }
        else if(value==null || value==undefined) {
            return resolve({
                error:true,
                message:'data is null or undefined',
                data: null
            });
        }
        client.set(key,value,(err,result=>{
            if(err){
                reject({
                    error:true,
                    message:'error while setting data in redis',
                    data: err.message
                });
            } 
            exp=exp || 3600; // default expiry time is 1 hour
                client.expire(key, exp, (err, result) => {
                    if (err) {
                        reject({
                            error:true,
                            message:'error while setting expiry for key in redis',
                            data: err.message
                        });
                    }
                    resolve({
                   error:false,
                   message:'data set successfully',
                   data: result
               });
            });

        } ));
    });
}

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

