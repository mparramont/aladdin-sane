interface Album extends LastFMAlbum {
  id: AlbumID
  favorite?: boolean
  createdAt: number
}

type AlbumID = string

interface LastFMAlbum {
  fromLastFM: true
  artist: Artist
  mbid: string
  tags: {
    tag: {
      url: string
      name: string
    }[]
  }
  name: string
  image: LastFMImage[]
  tracks: {
    track: LastFMTrack[]
  }
  listeners: string | number
  playcount: string | number
  url: string
  wiki?: {
    summary: string
    content: string
  }
}

type LastFMTrack = {
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
}

type LastFMImage = {
  size: string
  '#text': string
}
