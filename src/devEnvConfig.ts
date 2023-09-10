import dotenv from 'dotenv'
import * as path from 'path'

export const devEnvConfig = () => {
  const envPath = path.resolve(process.cwd(), '.env')
  console.log(`Loading environment variables from: ${envPath}`)
  dotenv.config({ path: envPath })
}
