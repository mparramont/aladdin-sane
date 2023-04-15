interface Album {
  // webapp properties
  id?: string
  favorite?: boolean

  // Last.fm properties
  artist: string
  mbid: string
  tags: {
    tag: {
      url: string
      name: string
    }[]
  }
  name: string
  image: {
    size: string
    '#text': string
  }[]
  tracks: {
    track: {
      name: string
      duration: number | null
      artist: {
        url: string
        name: string
        mbid: MBID
      }
      streamable: {
        fulltrack: string
        '#text': string
      }
      url: string
      '@attr': {
        rank: number
      }
      mbid?: string
    }[]
  }
  listeners: string | number
  playcount: string | number
  url: string
  wiki?: {
    summary: string
    content: string
  }
}
