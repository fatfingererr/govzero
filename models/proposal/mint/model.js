const { MintProposal } = require("./schema")

function getMintProposals(offset, limit) {
  return new Promise((resolve, reject) => {
    MintProposal.find()
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit)
      .exec((err, proposals) => {
        if (err) reject(err)
        resolve(proposals)
      })
  })
}


function updateProposal(proposal) {
  return new Promise((resolve, reject) => {
    MintProposal.findOneAndUpdate({ proposalId: proposal.proposalId }, proposal)
    .then(() => resolve())
    .catch((err) => reject(err))
  })
}



function findProposal(proposal) {
  return new Promise((resolve, reject) => {
    MintProposal.findOne(proposal).exec((err, found) => {
      if (err) reject(err)
      resolve(found)
    })
  })
}

function createBatchMintProposal(
  proposalId,
  proposer,
  receivers,
  amounts,
  description,
  proposeTime,
  proposeTx
) {
  return new Promise((resolve, reject) => {
    MintProposal.findOne()
      .select({ serialId: 1 })
      .sort({ serialId: -1 })
      .exec((err, pmax) => {
        if (err) reject(err)
        let serialId = 1
        if (pmax !== undefined && pmax !== null) {
          serialId = pmax.serialId + 1
        }
        new MintProposal({
          type: "batchmint",
          proposalId,
          serialId,
          proposer,
          receivers,
          amounts,
          description,
          proposeTx,
          proposeTime
        })
          .save()
          .then(() => resolve())
          .catch((err) => reject(err))
      })
  })
}

function createMintProposal(
  proposalId,
  proposer,
  receiver,
  amount,
  description,
  proposeTime,
  proposeTx
) {
  return new Promise((resolve, reject) => {
    MintProposal.findOne()
      .select({ serialId: 1 })
      .sort({ serialId: -1 })
      .exec((err, pmax) => {
        if (err) reject(err)
        let serialId = 1
        if (pmax !== undefined && pmax !== null) {
          serialId = pmax.serialId + 1
        }
        new MintProposal({
          type: "mint",
          proposalId,
          serialId,
          proposer,
          receiver,
          amount,
          description,
          proposeTx,
          proposeTime
        })
          .save()
          .then(() => resolve())
          .catch((err) => reject(err))
      })
  })
}

module.exports = {
  getMintProposals,
  createMintProposal,
  findProposal,
  updateProposal,
  createBatchMintProposal
}
