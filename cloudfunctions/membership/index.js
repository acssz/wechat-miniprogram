// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'query': {
      return dbQuery(event)
    }
    case 'update': {
      return dbUpdate(event)
    }
    case 'valid': {
      return dbValid(event)
    }
    case 'setEmail': {
      return dbSetEmail(event)
    }
    case 'updateLeak': {
      return dbUpdateLeak(event)
    }
    case 'search':{
      return dbSearchUser(event)
    }
    case 'del':{
      return dbDeletUser(event)
    }
    case 'updateByAdmin':{
      return dbUpdateByAdmin(event)
    }
    case 'block':{
      return dbBlock(event)
    }
  }
}

async function dbUpdateByAdmin(event) {
  try {
    return await
    console.log("event", event),
    db.collection('membership').doc(event.openid).update({
      data:{
        name : event.name,
        email : event.email,
        date : event.date,
        status : event.status
      }
    })
  } catch (e) {
    return "fail"
  }
}

async function dbSearchUser(event) {
  try {
    return await
    console.log("event", event),
    res = db.collection('membership').where({
        name: event.ChineseName
      }).get({
      success: function(res) {
        console.log(res.data)
      }
    }).then((res) => {
      return res
    })
  } catch (e) {
    console.error(e)
  }
}

async function dbDeletUser(event) {
  try {
    return await
    console.log("event", event),
    res = db.collection('membership').doc(event.openid).remove({
      success: function(res) {
        console.log(res.data)
        return "success"
      }
    })    
  } catch (e) {
    console.error(e)
  }
  return "fail"
}

async function dbQuery(event) {
  try {
    return await
    console.log("event", event),
    res = db.collection('membership').doc(event.openid).get({
      success: function(res) {
        console.log(res.data)
      }
    }).then((res) => {
      currentDate = getNowFormatDate()
      // the current date
      let currDate = new Date(Date.parse(currentDate))
      let currYear = currDate.getFullYear()
      let currMonth = currDate.getMonth() + 1
      let currDay = currDate.getDay()
      // the registeration date
      let regDate = new Date(Date.parse(res.data.date))
      // the date before-1/after+1 the registeration date
      var gapDate = new Date()
      gapDate.setDate(regDate.getDate() + 1)
      gapDate = new Date(gapDate)

      updateCheck = false
      // rule 1: dbVuntil 2023/09
      if (currYear < 2023 || currYear < 2024 && currMonth < 10) {
        // rule 2: dbVafter the registration day
        if (regDate < currDate) {
          updateCheck = true
        }
      }
      //res.data.status = updateCheck && res.data.status

      return res
    })
  } catch (e) {
    console.error(e)
  }
}

async function dbSetEmail(event) {
  try {
    return await
    console.log("event", event),
    db.collection('membership').doc(event.openid).set({
      data: {
        status: false,
        email: event.email,
      }
    })
  } catch (e) {
    console.error(e)
  }
}

async function dbValid(event) {
  try {
    return await
    console.log("event", event),
    db.collection('membership').doc(event.openid).update({
      data: {
        status: true
      }
    })
  } catch (e) {
    console.error(e)
  }
}

async function dbBlock(event) {
  try {
    return await
    console.log("event", event),
    db.collection('membership').doc(event.openid).update({
      data: {
        blockStatus: event.blockStatus
      }
    })
  } catch (e) {
    console.error(e)
  }
}

async function dbUpdateLeak(event) {
  try {
    return await
    console.log("event", event),
    db.collection('membership').doc(event.openid).update({
      data: {
        // _id: event.openid,
        date: getNowFormatDate(),
        name: event.name,
        pinyin: event.pinyin,
        lD: event.lD,
      }
    })
  } catch (e) {
    console.error(e)
  }
}

async function dbUpdate(event) {
  try {
    return await
    console.log("event", event),
    db.collection('membership').doc(event.openid).set({
      data: {
        // _id: event.openid,
        date: getNowFormatDate(),
        name: event.name,
        tel: event.tel,
        email: event.email,
        major: event.major,
        status: event.status,
        feedback: event.feedback,
        category: event.category,
        institution: event.institution,
      }
    })
  } catch (e) {
    console.error(e)
  }
}

function getNowFormatDate () {
  var date = new Date();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 1 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var datestamp = date.getFullYear() + "-" + month + "-" + strDate;
  // var timestamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return datestamp;
}
