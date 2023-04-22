interface Album extends LastFMAlbum {
  id: AlbumID
  favorite?: boolean
  createdAt: number
}

type AlbumID = string

interface LastFMAlbum {
  artist: Artist
  mbid: string
  tags: {
    tag: {
      url: string
      name: string
    }[]
  }
  name: string
  image: AlbumImage[]
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

type LastFMAlbumImage = {
  size: string
  '#text': string
}
