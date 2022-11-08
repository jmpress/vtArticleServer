const bcrypt = require('bcrypt');

async function makeSaltedHash(plain_pass){
    const saltRounds = 10;
    try{
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(plain_pass, salt);
        return hash;
    } catch(err){
        console.log(err);
    }
}

async function comparePasswords(password, hash){
    console.log(`Inside comparePasswords()| inputPass: ${password}, dbPass: ${user.password}`)
    try{
        const matchFound = await bcrypt.compare(password, hash);
        console.log(`matchFound = ${matchFound}`);
        return matchFound;
    } catch(err) {
        console.log(err);
    }
    return false;
}

function sanitizeInput(stringle, numChar){
    stringle = stringle.replace(/[^a-z0-9áéíóúñü \.,'_@-]/gim,"");
    stringle = stringle.trim();
            if(stringle.length > numChar){
                stringle = stringle.slice(0, numChar);
            }
    return stringle;
}

function normalizeAPIResponse(rawObj){
    console.log(rawObj);
    let normalizedArray = []
    let normalizedObj = {}
    for(let i = 0; i<rawObj.length; i++){
        let id=rawObj[i]._id;
        let type = rawObj[i].type;
        attributes = {
            title: rawObj[i].title,
            subtitle: rawObj[i].sub_title,
            date: rawObj[i].date,
            content: rawObj[i].content
        }
        let newObj = {
            id: id,
            type: type,
            attributes: attributes
        }
        console.log(`newObj[${i}]: ${newObj}`)
        normalizedArray.push(newObj);
    }
    console.log(`normalizedArray = ${normalizedArray}`)
    normalizedObj = {
        data: normalizedArray
    }
    console.log(normalizedObj)
    return normalizedObj;
}

module.exports = { makeSaltedHash, comparePasswords, sanitizeInput, normalizeAPIResponse };