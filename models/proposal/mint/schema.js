const db = require("../../../db")

const MINT_PROPOSAL_MODEL_NAME = "MintProposal"

const mintProposalSchema = db.Schema({
  serialId: { type: Number, unique: true },
  proposalId: String,
  type: String,
  proposer: String,
  receiver: String,
  amount: String,
  receivers: [String],
  amounts: [String],
  description: String,
  proposeTime: Number,
  proposeTx: String,
  queueTx: String,
  executeTx: String
})

const MintProposal = db.model(
  MINT_PROPOSAL_MODEL_NAME,
  mintProposalSchema,
  MINT_PROPOSAL_MODEL_NAME
)

module.exports = {
  MINT_PROPOSAL_MODEL_NAME,
  MintProposal
}
