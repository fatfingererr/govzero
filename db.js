var sqlite3 = require("sqlite3").verbose()
var db = new sqlite3.Database("./main.db")

db.serialize(function () {

  // db.get('PRAGMA journal_mode=WAL;')

  const sqlCreateTableScoreProposal =
    "create table if not exists ScoreProposal (\
    serial_id INTEGER PRIMARY KEY AUTOINCREMENT,\
    proposal_id TEXT UNIQUE NOT NULL,\
    proposer TEXT NOT NULL,\
    receiver TEXT NOT NULL,\
    amount TEXT NOT NULL,\
    description TEXT NOT NULL,\
    transaction_hash TEXT NOT NULL,\
    propose_time INTEGER NOT NULL\
    )"

  db.run(sqlCreateTableScoreProposal)
})

module.exports = db
