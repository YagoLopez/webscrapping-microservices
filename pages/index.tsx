import Link from 'next/link'
import Head from '../components/head'
import {useEffect, useState} from "react"
import ScrappedResponse from "./api/models/ScrappedResponse"
import {URL_TO_EXTRACT_TEXT} from "../constants"
import css from './css/index.module.css'

export default () => {

  const [dataState, setDataState] = useState({})

  const getScrappedHtml = () => ({__html: JSON.stringify((dataState as ScrappedResponse).content)})

  const fetchData = async (url: string) => {
    const response = await fetch(`/api/extract-text?url=${url}`)
    const data = await response.json()
    setDataState(data)
  }

  useEffect(() => {
    fetchData(URL_TO_EXTRACT_TEXT)
  }, [])

  return (
    <div className={css.page}>
      <Head title="Home" />
      <div>
        <h1>Experimental Microservices for Data Adquisition using Web Scrapping</h1>
        <div>
          <div >There are two endpoints available:</div>
          <div>
            <Link href={`/api/extract-text?url=${encodeURIComponent(URL_TO_EXTRACT_TEXT)}`}>
              <a className={css.link} target="_blank"><code>Endpoint to extract text from a webpage</code></a>
            </Link>
            <div className={css.linkText}>Data is extracted from this remote url:</div>
            <code>
              <a href={URL_TO_EXTRACT_TEXT} target="_blank" className={css.linkUrl}>
                {URL_TO_EXTRACT_TEXT}
              </a>
            </code>
          </div>
          <div>
            <Link href="/api/github-trending-repos">
              <a className={css.link} target="_blank">
                <code>Endpoint to extract trending github repos</code>
              </a>
            </Link>
            <div className={css.linkText}>Data is extracted from this remote url:</div>
            <code>
              <a href="https://github.com/trending" target="_blank" className={css.linkUrl}>
                https://github.com/trending
              </a>
            </code>
          </div>
        </div>
        <div className={css.textBlock}>
          The text below was extracted from:
          <code>
            <a href={URL_TO_EXTRACT_TEXT} target="_blank" className={css.linkUrl}>{URL_TO_EXTRACT_TEXT}</a>
        </code>
        </div>
        <div className={css.scrappedText} dangerouslySetInnerHTML={ getScrappedHtml() }></div>
        <div className={css.centered}>
          <a href="https://github.com/YagoLopez/webscrapping-microservices" target="_blank" className={css.linkUrl}>
            Project Page on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
