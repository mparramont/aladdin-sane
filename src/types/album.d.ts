interface Album extends LastFMAlbum {
  id: AlbumID
  favorite?: boolean
  createdAt?: number
}

type AlbumID = string

interface LastFMAlbum extends LastFMTopAlbum {
  releasedate?: string
  tags: {
    tag: {
      url: string
      name: string
    }[]
  }
  tracks: {
    track: LastFMTrack[]
  }
  playcount: string | number
  wiki?: {
    summary: string
    content: string
  }
}

// TODO very similar to Album, find a better abstraction
interface TopAlbum extends LastFMTopAlbum {
  id: AlbumID
  favorite?: boolean
  createdAt?: number
}

interface LastFMTopAlbum {
  fromLastFM: true
  artist: Artist
  name: string
  mbid: string
  listeners: string | number
  url: string
  image: LastFMImage[]
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
