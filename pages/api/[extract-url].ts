import { NextApiRequest, NextApiResponse } from 'next'
import * as webscrapper from 'node-read'
import ScrappedResponse from './models/ScrappedResponse'
import ScrappedError from './models/ScrappedError'

const getRemoteHtml = async (url: string): Promise<ScrappedResponse> => {
  return new Promise((resolve, reject) =>
    webscrapper(url, (err, remoteData, res) => !err ? resolve(remoteData) : reject(err)))
}

export default async (req: NextApiRequest, res: NextApiResponse<ScrappedResponse | ScrappedError>) => {
  const { query: {url} } = req
  console.log('url', url)
  try {
    const response: ScrappedResponse = await getRemoteHtml(url as string)
    res.status(200).json(response)
  } catch (e) {
    console.log(e.stack)
    res.status(400).json({error: e.message})
  }
}
