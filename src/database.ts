const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const Base = require('lowdb/adapters/Base')

export class PostgresSync extends Base {
  constructor(id: string) {
    super(id)
  }

  async read() {
    let result = await pool.query("SELECT data FROM games WHERE game_id=$1", [this.source])
    if (result.rows.length == 0) {
      pool.query("INSERT INTO games (data, game_id) VALUES ($1, $2)", [this.serialize(this.defaultValue), this.source])
      return this.defaultValue
    }
    return result.rows[0].data.trim() ? this.deserialize(result.rows[0].data.trim()) : this.defaultValue
  }

  async write(data) {
    let result = await pool.query("UPDATE games SET data=$1 WHERE game_id=$2", [this.serialize(data), this.source])
    if (result.rows.length == 0) {
      result = await pool.query("INSERT INTO games (data, game_id) VALUES ($1, $2)", [this.serialize(data), this.source])
    }
    return result
  }
}