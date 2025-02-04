import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    let version = await database.query("SHOW server_version;");
    version = version.rows[0].server_version;

    let maxConnections = await database.query("SHOW max_connections;");
    maxConnections = maxConnections.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;
    let usedConnections = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1;",
      values: [databaseName],
    });
    usedConnections = usedConnections.rows[0].count;

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: version,
          max_connections: parseInt(maxConnections),
          opened_connections: usedConnections,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.error("\n Erro dentro do catch do controller:");
    console.log(publicErrorObject);

    response.status(500).json({
      // error: "Internal Server Error",
      publicErrorObject,
    });
  }
}

export default status;
