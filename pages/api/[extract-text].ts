import { NextApiRequest, NextApiResponse } from 'next'
import * as webscrapper from 'node-read'
import ScrappedResponse from './models/ScrappedResponse'
import ScrappedError from './models/ScrappedError'

/**
 * Utility function to get remote html
 * Used by /extract-text endpoint
 * @param url
 */
const getRemoteHtml = async (url: string): Promise<ScrappedResponse> => {
  return new Promise((resolve, reject) =>
    webscrapper(url, (err, remoteData, res) => !err ? resolve(remoteData) : reject(err)))
}

/**
 * Extract text from remote web page.
 * Pass a url query string parameter to endpoint to scrape its text.
 * @param {NextApiRequest} req
 * @param {NextApiResponse<ScrappedResponse | ScrappedError>} res
 */
const ExtractText = async (req: NextApiRequest, res: NextApiResponse<ScrappedResponse | ScrappedError>) => {
  const { query: {url} } = req
  try {
    const response: ScrappedResponse = await getRemoteHtml(url as string)
    res.status(200).json(response)
  } catch (e) {
    res.status(400).json({error: e.message})
  }
}

export default ExtractText
