import { NextApiRequest, NextApiResponse } from 'next'
import cheerio from 'cheerio'
import TrendingRepo from './models/TrendingRepo'

/**
 * Extract trending repositories from GitHub: https://github.com/trending
 * @param {NextApiRequest} req
 * @param {NextApiResponse<TrendingRepo[]>} res
 */
const getGithubTrendingRepos = async (req: NextApiRequest, res: NextApiResponse<TrendingRepo[]>) => {

  const GITHUB_TRENDING_REPOS_URL = 'https://github.com/trending'
  const GITHUB_BASE_URL = 'https://github.com'
  const data = await fetch(GITHUB_TRENDING_REPOS_URL)
  const remoteHtml = await data.text()
  const $ = cheerio.load(remoteHtml)

  const removeLastCharacters = (str: string = '', n: number): string => str.substring(0, str.length - n)

  try {
    const trendingRepos: TrendingRepo[] = $('article.Box-row')
      .get()
      .map( (repo) => {
        const repoElement = $(repo)
        let result: TrendingRepo = {name: '', url: '', description: '', owner: '', contributors: ''}
        result.name = repoElement.find('a').get(1).children[4].data.trim()
        result.url = GITHUB_BASE_URL + repoElement.find('a').get(1).attribs.href
        result.contributors = GITHUB_BASE_URL + repoElement.find('a').get(2).attribs.href
        result.owner = repoElement.find('span').get(0).children[0].data.trim()
        result.owner = removeLastCharacters(result.owner, 2)
        result.description = repoElement.find('p').text().trim()
        return result
      })
    res.status(200).json(trendingRepos)
  } catch (e) {
    res.status(400).send(null)
  }
}
export default getGithubTrendingRepos