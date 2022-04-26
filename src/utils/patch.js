
export function comparativeData(newdata, exdata){
  let olddata = JSON.parse(exdata)
  let data = {}
  let keys = Object.keys(newdata)
  if(!keys.length){
    return
  }
  keys.forEach(key => {
    if(newdata[key] && olddata[key]){
      if(newdata[key].toString() !== olddata[key].toString()){
        data[key] = newdata[key]
      }
    } else if(!newdata[key] && !olddata[key]){
      return
    } else {
      data[key] = newdata[key]
    }
  })
  return data
}

export function queryFilter(queryObj){
  let keysP = Object.keys(queryObj)
  keysP.map(key => {
    if(typeof queryObj[key]==="string"){
      queryObj[key]=queryObj[key].trim()
    }
    if(queryObj[key] === '' || queryObj[key] === null){
      delete queryObj[key]
    }
  })
  return queryObj
}
