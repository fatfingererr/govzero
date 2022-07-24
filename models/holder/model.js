const { Holder } = require("./schema")

function addHolders(addresses, names) {
  return new Promise((resolve, reject) => {
    let newHolders = []
    addresses.forEach((addr, idx) => {
      newHolders.push({
        address: addr,
        name: names[idx]
      })
    })
    Holder.insertMany(newHolders)
      .then(() => resolve())
      .catch((err) => reject(err))
  })
}

function updateHolder(holder) {
  return new Promise((resolve, reject) => {
    Holder.findOne({ name: holder.name }).then((found) => {
      if (found !== null) {
        reject("Holder name already exists.")
      } else {
        Holder.findOneAndUpdate({ address: holder.address }, holder)
          .then(() => resolve())
          .catch((err) => reject(err))
      }
    })
  })
}

function getAllHolders() {
  return new Promise((resolve, reject) => {
    Holder.find()
      .then((holders) => resolve(holders))
      .catch((error) => reject(error))
  })
}

function getNewHolders(addresses) {
  return new Promise((resolve, reject) => {
    Holder.find({ address: { $in: addresses } })
      .select({ address: 1 })
      .then((oldHolders) => {
        let newHoldersAddress = []
        let newHoldersName = []
        addresses.forEach((addr) => {
          if (oldHolders.findIndex((h) => h.address === addr) < 0) {
            newHoldersAddress.push(addr)
            newHoldersName.push("")
          }
        })
        resolve({ addresses: newHoldersAddress, names: newHoldersName })
      })
      .catch((error) => reject(error))
  })
}

module.exports = {
  getNewHolders,
  getAllHolders,
  updateHolder,
  addHolders
}
